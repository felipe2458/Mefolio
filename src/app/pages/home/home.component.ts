import { Component } from '@angular/core';
import { SafeAboutMeInfos } from '../../interface/int';
import { GetInfosService } from '../../service/get-infos.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent{
  aboutMe_infos!: SafeAboutMeInfos[];

  constructor(private getInfos: GetInfosService, private sanitizer: DomSanitizer){
    this.getInfos.getInfos().subscribe(infos => {
      this.aboutMe_infos = infos.map(info => ({
        ...info,
        icon: this.sanitizer.bypassSecurityTrustHtml(info.icon)
      }));
    })
  }
}
