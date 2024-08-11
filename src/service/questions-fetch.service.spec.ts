import { TestBed } from '@angular/core/testing';

import { QuestionsFetchService } from './questions-fetch.service';

describe('QuestionsFetchService', () => {
  let service: QuestionsFetchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QuestionsFetchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
