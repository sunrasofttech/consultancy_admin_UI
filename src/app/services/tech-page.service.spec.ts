import { TestBed } from '@angular/core/testing';

import { TechPageService } from './tech-page.service';

describe('TechPageService', () => {
  let service: TechPageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TechPageService);
  });
  

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
