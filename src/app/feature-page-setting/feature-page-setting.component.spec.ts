import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeaturePageSettingComponent } from './feature-page-setting.component';

describe('FeaturePageSettingComponent', () => {
  let component: FeaturePageSettingComponent;
  let fixture: ComponentFixture<FeaturePageSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FeaturePageSettingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeaturePageSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
