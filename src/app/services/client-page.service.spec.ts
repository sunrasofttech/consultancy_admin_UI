import { TestBed } from '@angular/core/testing';

import { ClientPageService } from './client-page.service';

describe('ClientPageService', () => {
  let service: ClientPageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClientPageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
