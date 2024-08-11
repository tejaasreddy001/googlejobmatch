import { Component } from '@angular/core';
import { UserLoginService } from '../../service/user-login.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; 
import { HttpClientModule } from '@angular/common/http';
import { SharedDataService } from '../../service/shared-data.service';

@Component({
  selector: 'app-userlogin',
  standalone: true,
  imports: [HttpClientModule, FormsModule],
  templateUrl: './userlogin.component.html',
  styleUrl: './userlogin.component.css'
})
export class UserloginComponent {
  username: string = '';
  password: string = '';
  loginError:string = 'Test';

  constructor(private userlogin: UserLoginService, private sharedDataService: SharedDataService, private router: Router) {
    console.log("We are in constructor login");
  }

  login(): void {
    console.log("*************We are in login outside the constructor ************");
    this.userlogin.login(this.username, this.password)
      .subscribe(
        response => {
          this.loginError = 'Successful';
          console.log('Login Successful:');
          this.sharedDataService.setUserId(response.userId);
          this.sharedDataService.setUserName(this.username);  
          this.sharedDataService.userName$.subscribe(userName => {
            console.log('UserName from SharedDataService:', userName);
          });
          this.router.navigate(['']);
        },
        error => {
          this.loginError = 'Failure';
          alert("Username or Password incorrect");
          console.error('Login Failed:', error);
        }
      );
  }

}
