import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HomeComponent } from "../component/home/home.component";
import { QuestionsComponent } from '../component/questions/questions.component';
import { SharedDataService } from '../service/shared-data.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HomeComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'jobmatch';

  constructor(private sharedDataservice: SharedDataService){}

  Logout(){
    this.sharedDataservice.clearUserData();
  }
  
  
}
