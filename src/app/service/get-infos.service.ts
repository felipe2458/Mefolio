import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AboutMeInfos, Projects } from '../interface/int';

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
}
