import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { bard } from '../component/home/bard.model';


@Injectable({
  providedIn: 'root'
})
export class FetchGeminiService {
  private apiUrl = 'http://127.0.0.1:5000/fetch-bard';

  constructor(private http: HttpClient) { }

  fetchBard(username: any, job: string, resume: string): Observable<bard>{
    const body = { user_name: username, job: job, resume: resume };
    return this.http.post<bard>(this.apiUrl, body);
  }
}