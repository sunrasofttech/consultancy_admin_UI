import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactBookingSettingComponent } from './contact-booking-setting.component';

describe('ContactBookingSettingComponent', () => {
  let component: ContactBookingSettingComponent;
  let fixture: ComponentFixture<ContactBookingSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContactBookingSettingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactBookingSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
