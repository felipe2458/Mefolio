import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { Projects, SafeAboutMeInfos } from '../../interface/int';
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
            opacity: i === 0 ? 1 : 0
          }))
        }
      })
    })

    this.slide_initializer = new Proxy([false, false, false, false], {
      set: (target, prop: string, value) => {
        const oldValue = target[prop as any];

        if(oldValue !== value){
          if(!isNaN(Number(prop))){
            target[prop as any] = value;
            this.slideInicializer();
          }
        }

        return true;
      }
    })
  }

  slideInicializer(){
    const IndexOfSlide = this.slide_initializer.map((value, index)=> value === true ? index: -1).filter(value => value !== -1);

    function addOpacity(slide: { opacity: number }){
      const interval = setInterval(()=>{
        if(slide.opacity >= 1){
          clearInterval(interval);
          return;
        }

        slide.opacity = Number((slide.opacity + 0.1).toFixed(1));
      }, 500)
    }

    function removeOpacity(slide: { opacity: number }){
      const interval = setInterval(()=>{
        if(slide.opacity > 1){
          clearInterval(interval);
          return;
        }

        if(slide.opacity <= 0){
          clearInterval(interval);
          return;
        }

        console.log(slide.opacity)

        slide.opacity = Number((slide.opacity - 0.1).toFixed(1));
      }, 500)
    }

    IndexOfSlide.forEach(i => {
      const slide = this.projects[i].slide;
      let currentIndex = slide.findIndex(s => s.opacity === 1);

      setInterval(()=>{
        const nextIndex = (currentIndex + 1) % slide.length;

        removeOpacity(slide[currentIndex]);
        addOpacity(slide[nextIndex]);

        currentIndex = nextIndex;
      }, 5000)

    });
  }

  ngAfterViewInit(){
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const index = entry.target.getAttribute('data-index');

        if(entry.isIntersecting){
          this.slide_initializer[Number(index)] = true;
          return;
        }

        this.slide_initializer[Number(index)] = false;
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
