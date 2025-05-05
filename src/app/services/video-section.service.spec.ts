import { TestBed } from '@angular/core/testing';

import { VideoSectionService } from './video-section.service';

describe('VideoSectionService', () => {
  let service: VideoSectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VideoSectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
