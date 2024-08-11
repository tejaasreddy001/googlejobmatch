import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { QuestionResponse } from '../component/questions/question.model';

@Injectable({
  providedIn: 'root'
})
export class QuestionsCreateService {
  private apiUrl = 'http://127.0.0.1:5000/create-question';

  constructor(private http: HttpClient) { }

  createQuestion(username: any, question: string): Observable<QuestionResponse> {
    const body = { user_name: username, question: question };
    return this.http.post<QuestionResponse>(this.apiUrl, body);
  }
}
