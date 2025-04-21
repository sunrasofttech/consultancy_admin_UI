import { TestBed } from '@angular/core/testing';

import { NavbarSettingsService } from './navbar-settings.service';

describe('NavbarSettingsService', () => {
  let service: NavbarSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NavbarSettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
