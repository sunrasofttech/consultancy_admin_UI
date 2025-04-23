import { TestBed } from '@angular/core/testing';

import { FooterPageSettingService } from './footer-page-setting.service';

describe('FooterPageSettingService', () => {
  let service: FooterPageSettingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FooterPageSettingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
