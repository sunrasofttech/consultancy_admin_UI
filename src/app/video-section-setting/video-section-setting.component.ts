
import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { VideoSectionService, VideoSection } from '../services/video-section.service'; // Import service and interface
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from 'src/environments/environment'; // Import environment

@Component({
  selector: 'app-video-section-setting',
  templateUrl: './video-section-setting.component.html',
  styleUrls: ['./video-section-setting.component.css']
})
export class VideoSectionSettingComponent implements OnInit {
  videoSections: VideoSection[] = [];
  isLoading: boolean = false; // Flag for loading state
  // baseApiUrl = environment.baseurl; // Store base URL for template usage
  baseApiUrl = environment.image_url; 

  // --- State for Creating New Video ---
  newVideo: Partial<VideoSection> = { // Object to hold data for the new video form
    title: '',
    sort_order: 1,
    status: 'active',
    youtube_link: '',
    video_file: null // Not directly bound, handled by newVideoFile
  };
  newVideoFile: File | null = null; // Holds the file selected in the "Create" form

  // --- State for Editing Existing Video ---
  editingVideoId: number | null = null; // ID of the video currently being edited
  editableVideoData: Partial<VideoSection> = {}; // Temporary storage for edits
  fileForUpdate: File | null = null; // Holds the file selected in the loop for update

  constructor(
    private videoService: VideoSectionService,
    private snackBar: MatSnackBar,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.loadVideos();
  }

  showSnackbar(message: string, panelClass: string = 'success-snackbar'): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: [panelClass] // Use array for panelClass
    });
  }

  loadVideos(): void {
    this.isLoading = true;
    this.videoService.getAllVideos().subscribe({
      next: (res) => {
        if (res.status && res.data) {
            this.videoSections = res.data.map(video => ({
                ...video,
                // Prepend base URL if video_file path is relative
                video_file: video.video_file ? `${this.baseApiUrl}${video.video_file}` : null
            }));
        } else {
             this.videoSections = [];
             // Optionally show snackbar for empty data if needed
             // this.showSnackbar(res.message || 'No videos found', 'info-snackbar');
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error("Error loading videos:", err);
        this.showSnackbar('Failed to load videos', 'error-snackbar');
        this.isLoading = false;
      }
    });
  }

  // --- Create Video Section ---

  onFileSelectedNewVideo(event: Event): void {
    const inputElement = event.target as HTMLInputElement | null;
    if (inputElement?.files && inputElement.files.length > 0) {
      this.newVideoFile = inputElement.files[0];
       // Optionally clear youtube link if a file is chosen, matching backend logic
       // this.newVideo.youtube_link = '';
       console.log('New video file selected:', this.newVideoFile.name);
    } else {
      this.newVideoFile = null;
    }
  }

  createNewVideo(): void {
    // Basic Validation
    if (!this.newVideo.title) {
      this.showSnackbar('Please provide a title', 'error-snackbar');
      return;
    }
     if (!this.newVideo.youtube_link && !this.newVideoFile) {
      this.showSnackbar('Please provide a YouTube link OR upload a video file', 'error-snackbar');
      return;
    }
    // Backend handles the "not both" case, but we can check here too
    if (this.newVideo.youtube_link && this.newVideoFile) {
        this.showSnackbar('Please provide either a YouTube link or a video file, not both.', 'error-snackbar');
        return;
    }

    this.isLoading = true;
    this.videoService.createVideoSection(this.newVideo, this.newVideoFile).subscribe({
      next: (res) => {
        this.showSnackbar(res.message || 'Video section created successfully!', 'success-snackbar');
        this.clearCreateForm(); // Clear form fields
        this.loadVideos(); // Refresh the list
        this.isLoading = false;
      },
      error: (err) => {
        console.error("Error creating video:", err);
        this.showSnackbar(err.error?.message || 'Failed to create video section', 'error-snackbar');
        this.isLoading = false;
      },
    });
  }

  clearCreateForm(): void {
    this.newVideo = {
      title: '',
      sort_order: 1,
      status: 'active',
      youtube_link: '',
    };
    this.newVideoFile = null;
    // Reset the file input visually (find a robust way if needed, e.g., using ViewChild)
    const fileInput = document.getElementById('newVideoFile') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  // --- Edit/Update Video Section ---

  editVideo(video: VideoSection): void {
    this.editingVideoId = video.id;
    // Create a shallow copy for editing to avoid modifying the original object directly
    this.editableVideoData = { ...video };
    // Clear any previously selected file for update when starting a new edit
    this.fileForUpdate = null;
  }

  cancelEdit(): void {
    this.editingVideoId = null;
    this.editableVideoData = {};
    this.fileForUpdate = null; // Clear selected file on cancel
  }

  onFileSelected(event: Event, videoId: number): void {
    // Only allow selecting a file if we are editing this specific video
    if (this.editingVideoId !== videoId) {
       this.showSnackbar('Please click "Edit" first before changing the file.', 'info-snackbar');
       // Reset the input
       const inputElement = event.target as HTMLInputElement;
       if(inputElement) inputElement.value = '';
       return;
    }

    const inputElement = event.target as HTMLInputElement | null;
    if (inputElement?.files && inputElement.files.length > 0) {
      this.fileForUpdate = inputElement.files[0];
      // Optionally clear youtube link in editable data if a file is chosen
      // this.editableVideoData.youtube_link = '';
      console.log(`File selected for update (ID ${videoId}):`, this.fileForUpdate.name);
    } else {
      this.fileForUpdate = null;
    }
  }

  saveEdit(): void {
    if (!this.editingVideoId || !this.editableVideoData) return;

    // Validation before sending
    if (this.editableVideoData.youtube_link && this.fileForUpdate) {
         this.showSnackbar('Cannot have both a YouTube link and an uploaded file during update. Clear one.', 'error-snackbar');
        return;
    }
    // You might add !this.editableVideoData.youtube_link && !this.fileForUpdate && !this.editableVideoData.video_file
    // if one must always exist, but the backend might allow removing both.

    this.isLoading = true;

    // Pass the ID, the edited data, and the potentially selected new file
    this.videoService.updateVideoSection(this.editingVideoId, this.editableVideoData, this.fileForUpdate)
      .subscribe({
        next: (res) => {
          this.showSnackbar(res.message || 'Video updated successfully', 'success-snackbar');
          this.cancelEdit(); // Exit editing mode
          this.loadVideos(); // Refresh the list
          this.isLoading = false;
        },
        error: (err) => {
          console.error("Error updating video:", err);
          this.showSnackbar(err.error?.message || 'Update failed', 'error-snackbar');
          this.isLoading = false;
          // Optionally keep editing mode open on failure, or cancel:
          // this.cancelEdit();
        }
    });
  }

  // --- Delete Video Section ---

  deleteVideo(video: VideoSection): void {
    if (!confirm(`Are you sure you want to delete "${video.title}"?`)) return;

    this.isLoading = true;
    this.videoService.deleteVideoSection(video.id).subscribe({
      next: (res) => {
        this.showSnackbar(res.message || 'Video deleted successfully', 'success-snackbar');
        this.loadVideos(); // Refresh the list
        this.isLoading = false;
      },
      error: (err) => {
        console.error("Error deleting video:", err);
        this.showSnackbar(err.error?.message || 'Deletion failed', 'error-snackbar');
        this.isLoading = false;
      }
    });
  }

  // --- Utility ---

  sanitizeYoutubeUrl(url: string | null): SafeResourceUrl | null {
    if (!url) return null;
    const videoId = this.extractYoutubeVideoId(url);
    if (!videoId) {
         console.warn("Could not extract video ID from URL:", url);
         return null; // Or return a placeholder SafeResourceUrl
    }
    const embedUrl = `https://www.youtube.com/embed/${videoId}`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
  }

  extractYoutubeVideoId(url: string): string | null {
     // Updated regex to handle more variations including shorts
    const regExps = [
        /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/, // Standard watch URL
        /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([a-zA-Z0-9_-]{11})/,            // Shortened URL
        /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,   // Embed URL
        /(?:https?:\/\/)?(?:www\.)?youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/  // Shorts URL
    ];

    for (const regex of regExps) {
        const match = url.match(regex);
        if (match && match[1]) {
            return match[1];
        }
    }
    return null; // No match found
  }
}