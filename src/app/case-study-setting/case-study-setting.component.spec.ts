import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseStudySettingComponent } from './case-study-setting.component';

describe('CaseStudySettingComponent', () => {
  let component: CaseStudySettingComponent;
  let fixture: ComponentFixture<CaseStudySettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaseStudySettingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaseStudySettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
