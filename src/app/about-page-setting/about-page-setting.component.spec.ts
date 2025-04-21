import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutPageSettingComponent } from './about-page-setting.component';

describe('AboutPageSettingComponent', () => {
  let component: AboutPageSettingComponent;
  let fixture: ComponentFixture<AboutPageSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AboutPageSettingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AboutPageSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
