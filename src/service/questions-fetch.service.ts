import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { QuestionResponse } from '../component/questions/question.model';

@Injectable({
  providedIn: 'root'
})
export class QuestionsFetchService {
  private apiUrl = 'http://127.0.0.1:5000/fetch-question';

  constructor(private http: HttpClient) { }

  fetchQuestions(username: any): Observable<QuestionResponse> {
    const body = { user_name: username };
    return this.http.post<QuestionResponse>(this.apiUrl, body);
  }
}
