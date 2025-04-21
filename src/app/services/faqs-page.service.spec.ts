import { TestBed } from '@angular/core/testing';

import { FaqsPageService } from './faqs-page.service';

describe('FaqsPageService', () => {
  let service: FaqsPageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FaqsPageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
