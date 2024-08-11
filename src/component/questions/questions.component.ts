import { Component, OnInit } from '@angular/core';
import { QuestionsFetchService } from '../../service/questions-fetch.service';
import { QuestionsCreateService } from '../../service/questions-create.service';
import { FormsModule } from '@angular/forms'; 
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { QuestionResponse } from './question.model';
import { SharedDataService } from '../../service/shared-data.service';
import { HomeComponent } from '../home/home.component';
import { QuestionsDeleteService } from '../../service/questions-delete.service';
import { response } from 'express';

@Component({
  selector: 'app-questions',
  standalone: true,
  imports: [HttpClientModule, FormsModule, CommonModule],  // Import FormsModule if needed for forms
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.css']
})
export class QuestionsComponent{
  userName: string | null = null;
  question: string = '';
  userId: string | null = null;
  questions: string[] = [];  // To hold fetched questions
  error: string = '';
  selectedQuestion: string | null = null;
  selectedQuestionIndex: number | null = null;
  selectedQuestionContent: string = '';
  
  constructor(
    private questionsFetchService: QuestionsFetchService,
    private questionsCreateService: QuestionsCreateService,
    private sharedDataService: SharedDataService,
    private deleteQuestionService: QuestionsDeleteService
  ) { 
    this.sharedDataService.userName$.subscribe(userName => {
      console.log('UserName from SharedDataService:', userName);
    });
  }
  
  ngOnInit(): void {
    console.log('ngOnInit called in QuestionsComponent');
    this.sharedDataService.userName$.subscribe(userName => {
      console.log('UserName from SharedDataService:', userName);
    });
    this.sharedDataService.userId$.subscribe((userId) => {
      console.log('Received userId in QuestionsComponent:', userId);
      this.userId = userId;
    });
    this.sharedDataService.userName$.subscribe((userName) => {
      console.log('Received userName in QuestionsComponent:', userName);
      this.userName = userName;
    });
    if (this.userName){
      this.fetchQuestions();
    }
  }
  
  fetchQuestions(): void {
    if (this.userName) {
      console.log("in fetch questions");
      this.questionsFetchService.fetchQuestions(this.userName)
      .subscribe(
        response => {
          this.questions = response['questions'] || [];
        },
        error => {
          this.error = 'Failed to fetch questions';
          console.error('Error fetching questions:', error);
        }
      );
    }
    else {
      this.error = 'No username';
    }
  }

  onQuestionClick(question: string, index: number): void {
    console.log(`Question clicked: ${question} at index ${index}`);
    this.selectedQuestion = question;
    this.selectedQuestionIndex = index;
    this.selectedQuestionContent = question;
  }
  deleteQuestion(index: number | null): void {
    if (index !== null && index >= 0 && index < this.questions.length) {
      this.questions.splice(index, 1);
      this.selectedQuestion = null;  // Clear the selection after deletion
      this.selectedQuestionIndex = null;
      this.selectedQuestionContent = '';

      this.deleteQuestionService.deleteQuestions(this.userName, index).subscribe(
        response => {
          this.questions = response['questions'] || [];
          this.question = '';
        },
        error => {
          this.error = 'Failed to delete question';
          console.error('Error deleting question:', error);
        }
      );
    }
  }

  createQuestion(): void {
    if (this.userName){
      this.questionsCreateService.createQuestion(this.userName, this.question)
      .subscribe(
        response => {
          this.questions = response['questions'] || [];
          this.question = '';  // Clear the input field
        },
        error => {
          this.error = 'Failed to create question';
          console.error('Error creating question:', error);
        }
      );
    }
    else {
      this.error = 'Failed to fetch questions';
    }
  }
}
