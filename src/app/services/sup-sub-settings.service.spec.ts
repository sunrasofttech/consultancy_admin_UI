import { TestBed } from '@angular/core/testing';

import { SupSubSettingsService } from './sup-sub-settings.service';

describe('SupSubSettingsService', () => {
  let service: SupSubSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SupSubSettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
