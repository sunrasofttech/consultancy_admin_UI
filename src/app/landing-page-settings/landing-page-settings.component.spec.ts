import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingPageSettingsComponent } from './landing-page-settings.component';

describe('LandingPageSettingsComponent', () => {
  let component: LandingPageSettingsComponent;
  let fixture: ComponentFixture<LandingPageSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LandingPageSettingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LandingPageSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
