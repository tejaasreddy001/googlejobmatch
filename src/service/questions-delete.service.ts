import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { QuestionResponse } from '../component/questions/question.model';

@Injectable({
  providedIn: 'root'
})
export class QuestionsDeleteService {
  private apiUrl = 'http://127.0.0.1:5000/delete-question';

  constructor(private http: HttpClient) { }

  deleteQuestions(username: any, delete_index: number): Observable<QuestionResponse> {
    const body = { user_name: username, delete_index: delete_index };
    return this.http.post<QuestionResponse>(this.apiUrl, body);
  }
}