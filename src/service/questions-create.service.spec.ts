import { TestBed } from '@angular/core/testing';

import { QuestionsCreateService } from './questions-create.service';

describe('QuestionsCreateService', () => {
  let service: QuestionsCreateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QuestionsCreateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
