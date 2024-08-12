import { Component, OnInit, signal } from '@angular/core';
import { QuestionsFetchService } from '../../service/questions-fetch.service';
import { QuestionsCreateService } from '../../service/questions-create.service';
import { FormsModule } from '@angular/forms'; 
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { SharedDataService } from '../../service/shared-data.service';
import { QuestionsDeleteService } from '../../service/questions-delete.service';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import {MatDividerModule} from '@angular/material/divider';
import {MatListModule} from '@angular/material/list';

@Component({
  selector: 'app-questions',
  standalone: true,
  imports: [HttpClientModule, FormsModule, CommonModule, MatCardModule, MatExpansionModule, MatListModule, MatDividerModule],
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.css']
})
export class QuestionsComponent {

  readonly panelOpenState = signal(false);

  userName: string | null = null;
  question: string = '';
  userId: string | null = null;
  questions: string[] = [];  
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

  resetSelectedQuestion(): void {
    this.selectedQuestion = null;
    this.selectedQuestionIndex = null;
    this.selectedQuestionContent = '';
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
          this.question = '';  
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
