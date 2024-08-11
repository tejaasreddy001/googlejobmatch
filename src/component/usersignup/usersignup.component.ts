import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; 
import { UserSignupService } from '../../service/user-signup.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-usersignup',
  standalone: true,
  imports: [HttpClientModule, FormsModule],
  templateUrl: './usersignup.component.html',
  styleUrl: './usersignup.component.css'
})
export class UsersignupComponent {
  username: string= '';
  contact_info: string = '';
  password: string = '';
  signupError: string= 'Test';

  constructor(private usersignup: UserSignupService, private router: Router) {
    console.log("We are in constructor signup");
  }

  signup(): void {
    console.log("*************We are in signup outside the constructor ************");
    this.usersignup.signup(this.username,this.contact_info,this.password)
      .subscribe(
        response => {
          this.signupError = 'Successful';
          console.log('Login Successful:');
          this.router.navigate(['/login']);
        },
        error => {
          alert("Username already taken");
          this.signupError = 'Failure';
          console.error('Login Failed:', error);
        }
      );
  }
  
}
