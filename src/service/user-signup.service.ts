import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserSignupService {
  private apiUrl = 'http://127.0.0.1:5000/newuser';
  constructor(private http: HttpClient) { }
  signup(username: string, contact_info: string, password: string) {
    console.log("We are in user-signup service");
    const body = { user_name: username, password: password, contact_info: contact_info};
    return this.http.post(this.apiUrl, body);
  }
}