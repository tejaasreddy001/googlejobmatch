import { Component } from '@angular/core';
import { SharedDataService } from '../../service/shared-data.service';
import { FetchGeminiService } from '../../service/fetch-gemini.service';
import { FormsModule } from '@angular/forms';
import { bard } from './bard.model';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  userName: string | null = null;
  userId: string | null = null;
  jobText: string = 'Copy paste the Job Description Here..';
  resumeText: string = 'Copy paste the Resume Enter Here..';
  result: string | null = null;
  presult: string | null = null;
  cresult: string | null = null;
  loading: boolean = false;

  headers: string[] = [];
  sections: string[] = [];
  expandedSection: number | null = null;


  constructor(private sharedDataService: SharedDataService, private geminiservice: FetchGeminiService) {
    console.log('In constructor of home page');
    this.sharedDataService.userName$.subscribe(userName => {
      console.log('UserName from SharedDataService:', userName);
      this.userName = userName;
    });
  }

  ngOnInit(){
    console.log("in home ngOnInit");
    this.sharedDataService.userName$.subscribe(userName => {
      console.log('UserName from SharedDataService:', userName);
      this.userName = userName;
    });
    this.sharedDataService.userId$.subscribe((userId) => {
      this.userId = userId;
    });
    this.sharedDataService.userName$.subscribe((userName) => {
      this.userName = userName;
    });
  }

  runJobMatch(): void {
    this.loading = true;
    if (!this.userName){
      alert('Please Signup or Login');
    }
    if (this.jobText && this.resumeText) {
      this.geminiservice.fetchBard(this.userName, this.jobText, this.resumeText).subscribe(
        response => {
          this.result = response.result;
          this.presult = response.presult;
          const { headers, sections } = this.extractContentAndHeaders(this.result);
          this.headers = headers;
          this.sections = sections;
          this.loading = false;
        },
        error => {
          console.error('Error:', error);
          this.loading = false;
        }
      );
    } else {
      alert('Job or Resume text is empty');
    }
  }
  extractContentAndHeaders(html: string): { headers: string[], sections: string[] } {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const elements = doc.body.childNodes;

    const headers: string[] = [];
    const sections: string[] = [];
    let currentSection: string[] = [];

    elements.forEach((node) => {
      if (node.nodeName === 'H2') {
        if (currentSection.length > 0) {
          sections.push(currentSection.join(''));
          currentSection = [];
        }
        headers.push((node.textContent || '').trim());
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        currentSection.push((node as Element).outerHTML);
      } else if (node.nodeType === Node.TEXT_NODE) {
        currentSection.push((node.textContent || '').trim());
      }
    });

    if (currentSection.length > 0) {
      sections.push(currentSection.join(''));
    }

    return { headers, sections };
  }

  toggleSection(index: number): void {
    this.expandedSection = this.expandedSection === index ? null : index;
  }
}