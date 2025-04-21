import { TestBed } from '@angular/core/testing';

import { FeaturePageService } from './feature-page.service';

describe('FeaturePageService', () => {
  let service: FeaturePageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FeaturePageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
