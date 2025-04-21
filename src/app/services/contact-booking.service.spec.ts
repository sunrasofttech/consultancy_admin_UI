import { TestBed } from '@angular/core/testing';

import { ContactBookingService } from './contact-booking.service';

describe('ContactBookingService', () => {
  let service: ContactBookingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContactBookingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
