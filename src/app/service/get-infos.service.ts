import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AboutMeInfos } from '../interface/int';

@Injectable({
  providedIn: 'root'
})
export class GetInfosService {
  constructor(private http: HttpClient) { }

  getInfos(): Observable<AboutMeInfos[]>{
    return this.http.get<AboutMeInfos[]>('assets/json/aboutMe.json');
  }
}
