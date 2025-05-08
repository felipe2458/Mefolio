import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AboutMeInfos, Projects, Services, Skills } from '../interface/int';

@Injectable({
  providedIn: 'root'
})
export class GetInfosService {
  constructor(private http: HttpClient) { }

  getAboutMeInfos(): Observable<AboutMeInfos[]>{
    return this.http.get<AboutMeInfos[]>('assets/json/aboutMe.json');
  }

  getProjects(): Observable<Projects[]>{
    return this.http.get<Projects[]>('assets/json/projects.json');
  }

  getServices(): Observable<Services[]>{
    return this.http.get<Services[]>('assets/json/services.json');
  }

  getSkills(): Observable<Skills[]>{
    return this.http.get<Skills[]>('assets/json/skills.json');
  }
}
