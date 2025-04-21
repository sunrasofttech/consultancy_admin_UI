import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechPageSettingComponent } from './tech-page-setting.component';

describe('TechPageSettingComponent', () => {
  let component: TechPageSettingComponent;
  let fixture: ComponentFixture<TechPageSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TechPageSettingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TechPageSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
