import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessPageSettingComponent } from './process-page-setting.component';

describe('ProcessPageSettingComponent', () => {
  let component: ProcessPageSettingComponent;
  let fixture: ComponentFixture<ProcessPageSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProcessPageSettingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProcessPageSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
