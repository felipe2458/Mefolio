import { Component } from '@angular/core';
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
  aboutMe_infos!: SafeAboutMeInfos[];
  projects!: Projects[];

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
  }
}
