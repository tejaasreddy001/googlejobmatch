import { TestBed } from '@angular/core/testing';

import { FetchGeminiService } from './fetch-gemini.service';

describe('FetchGeminiService', () => {
  let service: FetchGeminiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FetchGeminiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
