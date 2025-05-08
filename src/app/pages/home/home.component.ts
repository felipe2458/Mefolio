import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { Projects, SafeAboutMeInfos, SafeServices, SafeSkills } from '../../interface/int';
import { GetInfosService } from '../../service/get-infos.service';
import { DomSanitizer } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent{
  @ViewChildren('ObersavableHeader') slide!: QueryList<ElementRef>;
  aboutMe_infos!: SafeAboutMeInfos[];
  projects!: Projects[];
  slide_initializer: boolean[] = [];
  intervals: any[] = [];
  services!: SafeServices[];
  skills!: SafeSkills[];

  constructor(private getInfos: GetInfosService, private sanitizer: DomSanitizer){
    this.getInfos.getAboutMeInfos().subscribe(infos => {
      this.aboutMe_infos = infos.map(info => ({
        ...info,
        icon: this.sanitizer.bypassSecurityTrustHtml(info.icon)
      }));
    })

    this.getInfos.getProjects().subscribe(projects => {
      this.projects = projects;

      this.projects.forEach((project) => {
        if(Array.isArray(project.image_url)){
          project.slide = project.image_url.map((img, i) => ({
            image: img.image,
            opacity: i === 0 ? 1 : 0,
          }))
        }
      })
    })

    this.slide_initializer = new Proxy([false, false, false], {
      set: (target, prop: string, value) => {
        const oldValue = target[prop as any];

        if(oldValue !== value){
          if(!isNaN(Number(prop))){
            target[prop as any] = value;
            this.slideInicializer();
            this.slideReset();
          }
        }

        return true;
      }
    })

    this.getInfos.getServices().subscribe(services => {
      this.services = services.map(s => ({
        ...s,
        icon: this.sanitizer.bypassSecurityTrustHtml(s.icon)
      }))
    })

    this.getInfos.getSkills().subscribe(skills => {
      this.skills = skills.map(s => ({
        ...s,
        icon: this.sanitizer.bypassSecurityTrustHtml(s.icon)
      }))
    })
  }

  scrollToSection(id: string, offset: number = 140){
    const element = document.getElementById(id);
    if (element){
      const topPosition = element.getBoundingClientRect().top + window.scrollY;

      window.scrollTo({
        top: topPosition - offset,
        behavior: 'smooth'
      });
    }
  }

  slideInicializer(){
    this.intervals.forEach(clearInterval);
    this.intervals = [];

    const IndexOfSlide = this.slide_initializer.map((value, index)=> value === true ? index: -1).filter(value => value !== -1);

    function addOpacity(slide: { opacity: number }){
      slide.opacity = 1;
    }

    function removeOpacity(slide: { opacity: number }){
      slide.opacity = 0;
    }

    IndexOfSlide.forEach(i => {
      const slide = this.projects[i].slide;
      let currentIndex = slide.findIndex(s => s.opacity === 1);

      const intervalId = setInterval(()=>{
        const nextIndex = (currentIndex + 1) % slide.length;

        removeOpacity(slide[currentIndex]);
        addOpacity(slide[nextIndex]);

        currentIndex = nextIndex;
      }, 5000)

      this.intervals.push(intervalId)
    });
  }

  slideReset(){
    const indexOfSlide = this.slide_initializer.map((value, index)=> value === false ? index: -1).filter(value => value !== -1);

    indexOfSlide.forEach(i => {
      if(!this.projects[i] || !this.projects[i].slide) return;

      this.projects[i].slide.forEach((s, ip) => {
        s.opacity = ip === 0 ? 1 : 0;
      })
    })
  }

  ngAfterViewInit(){
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const index = Number(entry.target.getAttribute('data-index'));

        if(entry.isIntersecting){
          this.slide_initializer[index] = true;
          return;
        }

        this.slide_initializer[index] = false;
      })
    })

    this.slide.toArray().forEach((el: ElementRef, i: number) => {
      el.nativeElement.setAttribute('data-index', i);
      observer.observe(el.nativeElement);
    })

    const observerSlide = () => {
      this.slide.forEach((el: ElementRef) => {
        this.slide.toArray().forEach((el: ElementRef, i: number) => {
          el.nativeElement.setAttribute('data-index', i);
          observer.observe(el.nativeElement);
        })
      })
    }

    this.slide.changes.subscribe(() => {
      observerSlide();
    })
  }
}
