import { TestBed } from '@angular/core/testing';

import { ProcessPageService } from './process-page.service';

describe('ProcessPageService', () => {
  let service: ProcessPageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProcessPageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
