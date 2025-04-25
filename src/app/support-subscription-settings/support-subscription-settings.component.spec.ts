import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportSubscriptionSettingsComponent } from './support-subscription-settings.component';

describe('SupportSubscriptionSettingsComponent', () => {
  let component: SupportSubscriptionSettingsComponent;
  let fixture: ComponentFixture<SupportSubscriptionSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupportSubscriptionSettingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupportSubscriptionSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
