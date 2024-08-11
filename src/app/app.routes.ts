import { Routes } from '@angular/router';
import { QuestionsComponent } from '../component/questions/questions.component';
import { HomeComponent } from '../component/home/home.component';
import { UserloginComponent } from '../component/userlogin/userlogin.component';
import { UsersignupComponent } from '../component/usersignup/usersignup.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'questions', component: QuestionsComponent },
    { path: 'login', component: UserloginComponent },
    { path: 'signup', component: UsersignupComponent }
];
