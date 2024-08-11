import { TestBed } from '@angular/core/testing';

import { QuestionsDeleteService } from './questions-delete.service';

describe('QuestionsDeleteService', () => {
  let service: QuestionsDeleteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QuestionsDeleteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
