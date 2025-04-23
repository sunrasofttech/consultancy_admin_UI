import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterPageSettingComponent } from './footer-page-setting.component';

describe('FooterPageSettingComponent', () => {
  let component: FooterPageSettingComponent;
  let fixture: ComponentFixture<FooterPageSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FooterPageSettingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FooterPageSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
