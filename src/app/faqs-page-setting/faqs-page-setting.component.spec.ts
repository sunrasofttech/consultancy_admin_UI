import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaqsPageSettingComponent } from './faqs-page-setting.component';

describe('FaqsPageSettingComponent', () => {
  let component: FaqsPageSettingComponent;
  let fixture: ComponentFixture<FaqsPageSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FaqsPageSettingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FaqsPageSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
