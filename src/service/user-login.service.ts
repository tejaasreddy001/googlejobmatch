import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { SharedDataService } from './shared-data.service';

@Injectable({
  providedIn: 'root'
})
export class UserLoginService {
  private apiUrl = 'http://127.0.0.1:5000/users/login';

  constructor(private http: HttpClient, private sharedDataService: SharedDataService) {
   }

  login(username: string, password: string) {
    console.log("We are in user-login service")
    const body = { user_name: username, password: password };
    return this.http.post(this.apiUrl, body).pipe(tap((userData: any) => {
      this.sharedDataService.setUserId(userData._id);
      this.sharedDataService.setUserName(userData.user_name);
    }))
  }
}
