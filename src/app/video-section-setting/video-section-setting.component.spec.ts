import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoSectionSettingComponent } from './video-section-setting.component';

describe('VideoSectionSettingComponent', () => {
  let component: VideoSectionSettingComponent;
  let fixture: ComponentFixture<VideoSectionSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VideoSectionSettingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VideoSectionSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
