
// import { Component, OnInit } from '@angular/core';
// import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
// import { VideoSectionService, VideoSection } from '../services/video-section.service'; // Import service and interface
// import { MatSnackBar } from '@angular/material/snack-bar';
// import { environment } from 'src/environments/environment'; // Import environment

// @Component({
//   selector: 'app-video-section-setting',
//   templateUrl: './video-section-setting.component.html',
//   styleUrls: ['./video-section-setting.component.css']
// })
// export class VideoSectionSettingComponent implements OnInit {
//   videoSections: VideoSection[] = [];
//   isLoading: boolean = false; // Flag for loading state
//   // baseApiUrl = environment.baseurl; // Store base URL for template usage
//   baseApiUrl = environment.image_url; 

//   // --- State for Creating New Video ---
//   newVideo: Partial<VideoSection> = { // Object to hold data for the new video form
//     title: '',
//     sort_order: 1,
//     status: 'active',
//     youtube_link: '',
//     video_file: null // Not directly bound, handled by newVideoFile
//   };
//   newVideoFile: File | null = null; // Holds the file selected in the "Create" form

//   // --- State for Editing Existing Video ---
//   editingVideoId: number | null = null; // ID of the video currently being edited
//   editableVideoData: Partial<VideoSection> = {}; // Temporary storage for edits
//   fileForUpdate: File | null = null; // Holds the file selected in the loop for update

//   constructor(
//     private videoService: VideoSectionService,
//     private snackBar: MatSnackBar,
//     private sanitizer: DomSanitizer
//   ) {}

//   ngOnInit(): void {
//     this.loadVideos();
//   }

//   showSnackbar(message: string, panelClass: string = 'success-snackbar'): void {
//     this.snackBar.open(message, 'Close', {
//       duration: 3000,
//       horizontalPosition: 'right',
//       verticalPosition: 'top',
//       panelClass: [panelClass] // Use array for panelClass
//     });
//   }

//   loadVideos(): void {
//     this.isLoading = true;
//     this.videoService.getAllVideos().subscribe({
//       next: (res) => {
//         if (res.status && res.data) {
//             this.videoSections = res.data.map(video => ({
//                 ...video,
//                 // Prepend base URL if video_file path is relative
//                 video_file: video.video_file ? `${this.baseApiUrl}${video.video_file}` : null
//             }));
//         } else {
//              this.videoSections = [];
//              // Optionally show snackbar for empty data if needed
//              // this.showSnackbar(res.message || 'No videos found', 'info-snackbar');
//         }
//         this.isLoading = false;
//       },
//       error: (err) => {
//         console.error("Error loading videos:", err);
//         this.showSnackbar('Failed to load videos', 'error-snackbar');
//         this.isLoading = false;
//       }
//     });
//   }

//   // --- Create Video Section ---

//   onFileSelectedNewVideo(event: Event): void {
//     const inputElement = event.target as HTMLInputElement | null;
//     if (inputElement?.files && inputElement.files.length > 0) {
//       this.newVideoFile = inputElement.files[0];
//        // Optionally clear youtube link if a file is chosen, matching backend logic
//        // this.newVideo.youtube_link = '';
//        console.log('New video file selected:', this.newVideoFile.name);
//     } else {
//       this.newVideoFile = null;
//     }
//   }

//   createNewVideo(): void {
//     // Basic Validation
//     if (!this.newVideo.title) {
//       this.showSnackbar('Please provide a title', 'error-snackbar');
//       return;
//     }
//      if (!this.newVideo.youtube_link && !this.newVideoFile) {
//       this.showSnackbar('Please provide a YouTube link OR upload a video file', 'error-snackbar');
//       return;
//     }
//     // Backend handles the "not both" case, but we can check here too
//     if (this.newVideo.youtube_link && this.newVideoFile) {
//         this.showSnackbar('Please provide either a YouTube link or a video file, not both.', 'error-snackbar');
//         return;
//     }

//     this.isLoading = true;
//     this.videoService.createVideoSection(this.newVideo, this.newVideoFile).subscribe({
//       next: (res) => {
//         this.showSnackbar(res.message || 'Video section created successfully!', 'success-snackbar');
//         this.clearCreateForm(); // Clear form fields
//         this.loadVideos(); // Refresh the list
//         this.isLoading = false;
//       },
//       error: (err) => {
//         console.error("Error creating video:", err);
//         this.showSnackbar(err.error?.message || 'Failed to create video section', 'error-snackbar');
//         this.isLoading = false;
//       },
//     });
//   }

//   clearCreateForm(): void {
//     this.newVideo = {
//       title: '',
//       sort_order: 1,
//       status: 'active',
//       youtube_link: '',
//     };
//     this.newVideoFile = null;
//     // Reset the file input visually (find a robust way if needed, e.g., using ViewChild)
//     const fileInput = document.getElementById('newVideoFile') as HTMLInputElement;
//     if (fileInput) {
//       fileInput.value = '';
//     }
//   }

//   // --- Edit/Update Video Section ---

//   editVideo(video: VideoSection): void {
//     this.editingVideoId = video.id;
//     // Create a shallow copy for editing to avoid modifying the original object directly
//     this.editableVideoData = { ...video };
//     // Clear any previously selected file for update when starting a new edit
//     this.fileForUpdate = null;
//   }

//   cancelEdit(): void {
//     this.editingVideoId = null;
//     this.editableVideoData = {};
//     this.fileForUpdate = null; // Clear selected file on cancel
//   }

//   onFileSelected(event: Event, videoId: number): void {
//     // Only allow selecting a file if we are editing this specific video
//     if (this.editingVideoId !== videoId) {
//        this.showSnackbar('Please click "Edit" first before changing the file.', 'info-snackbar');
//        // Reset the input
//        const inputElement = event.target as HTMLInputElement;
//        if(inputElement) inputElement.value = '';
//        return;
//     }

//     const inputElement = event.target as HTMLInputElement | null;
//     if (inputElement?.files && inputElement.files.length > 0) {
//       this.fileForUpdate = inputElement.files[0];
//       // Optionally clear youtube link in editable data if a file is chosen
//       // this.editableVideoData.youtube_link = '';
//       console.log(`File selected for update (ID ${videoId}):`, this.fileForUpdate.name);
//     } else {
//       this.fileForUpdate = null;
//     }
//   }

//   saveEdit(): void {
//     if (!this.editingVideoId || !this.editableVideoData) return;

//     // Validation before sending
//     if (this.editableVideoData.youtube_link && this.fileForUpdate) {
//          this.showSnackbar('Cannot have both a YouTube link and an uploaded file during update. Clear one.', 'error-snackbar');
//         return;
//     }
//     // You might add !this.editableVideoData.youtube_link && !this.fileForUpdate && !this.editableVideoData.video_file
//     // if one must always exist, but the backend might allow removing both.

//     this.isLoading = true;

//     // Pass the ID, the edited data, and the potentially selected new file
//     this.videoService.updateVideoSection(this.editingVideoId, this.editableVideoData, this.fileForUpdate)
//       .subscribe({
//         next: (res) => {
//           this.showSnackbar(res.message || 'Video updated successfully', 'success-snackbar');
//           this.cancelEdit(); // Exit editing mode
//           this.loadVideos(); // Refresh the list
//           this.isLoading = false;
//         },
//         error: (err) => {
//           console.error("Error updating video:", err);
//           this.showSnackbar(err.error?.message || 'Update failed', 'error-snackbar');
//           this.isLoading = false;
//           // Optionally keep editing mode open on failure, or cancel:
//           // this.cancelEdit();
//         }
//     });
//   }

//   // --- Delete Video Section ---

//   deleteVideo(video: VideoSection): void {
//     if (!confirm(`Are you sure you want to delete "${video.title}"?`)) return;

//     this.isLoading = true;
//     this.videoService.deleteVideoSection(video.id).subscribe({
//       next: (res) => {
//         this.showSnackbar(res.message || 'Video deleted successfully', 'success-snackbar');
//         this.loadVideos(); // Refresh the list
//         this.isLoading = false;
//       },
//       error: (err) => {
//         console.error("Error deleting video:", err);
//         this.showSnackbar(err.error?.message || 'Deletion failed', 'error-snackbar');
//         this.isLoading = false;
//       }
//     });
//   }

//   // --- Utility ---

//   sanitizeYoutubeUrl(url: string | null): SafeResourceUrl | null {
//     if (!url) return null;
//     const videoId = this.extractYoutubeVideoId(url);
//     if (!videoId) {
//          console.warn("Could not extract video ID from URL:", url);
//          return null; // Or return a placeholder SafeResourceUrl
//     }
//     const embedUrl = `https://www.youtube.com/embed/${videoId}`;
//     return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
//   }

//   extractYoutubeVideoId(url: string): string | null {
//      // Updated regex to handle more variations including shorts
//     const regExps = [
//         /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/, // Standard watch URL
//         /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([a-zA-Z0-9_-]{11})/,            // Shortened URL
//         /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,   // Embed URL
//         /(?:https?:\/\/)?(?:www\.)?youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/  // Shorts URL
//     ];

//     for (const regex of regExps) {
//         const match = url.match(regex);
//         if (match && match[1]) {
//             return match[1];
//         }
//     }
//     return null; // No match found
//   }
// }






















import { Component, OnInit, ViewChild, ElementRef } from '@angular/core'; // Added ViewChild, ElementRef
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { VideoSectionService, VideoSection } from '../services/video-section.service'; // Import updated service and interface
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-video-section-setting',
  templateUrl: './video-section-setting.component.html',
  styleUrls: ['./video-section-setting.component.css']
})
export class VideoSectionSettingComponent implements OnInit {

  // --- View Children for resetting file inputs ---
  @ViewChild('newVideoFileInput') newVideoFileInput?: ElementRef<HTMLInputElement>;
  @ViewChild('newVideoFileEnInput') newVideoFileEnInput?: ElementRef<HTMLInputElement>;
  @ViewChild('newVideoFileHiInput') newVideoFileHiInput?: ElementRef<HTMLInputElement>;
  // Add similar @ViewChild for edit inputs if needed, though resetting on cancel might suffice

  videoSections: VideoSection[] = [];
  isLoading: boolean = false;
  baseApiUrl = environment.image_url; // Use the correct env variable

  // --- State for Creating New Video ---
  newVideo: Partial<VideoSection> = this.resetNewVideoData(); // Use helper to initialize
  newVideoFiles: {
      video_file: File | null;
      video_file_en: File | null;
      video_file_hi: File | null;
  } = { video_file: null, video_file_en: null, video_file_hi: null };

  // --- State for Editing Existing Video ---
  editingVideoId: number | null = null;
  editableVideoData: Partial<VideoSection> = {}; // Includes links and EXISTING file paths
  filesForUpdate: {
      video_file: File | null;
      video_file_en: File | null;
      video_file_hi: File | null;
  } = { video_file: null, video_file_en: null, video_file_hi: null };

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
      duration: 3500, // Slightly longer duration
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: [panelClass]
    });
  }

  loadVideos(): void {
    this.isLoading = true;
    this.videoService.getAllVideos().subscribe({
      next: (res) => {
        if (res.status && Array.isArray(res.data)) {
          // Store raw data, paths are relative from the backend
          this.videoSections = res.data;
        } else {
          this.videoSections = [];
          if (res.message) { // Show message from API if available
              this.showSnackbar(res.message, 'info-snackbar');
          }
        }
        this.isLoading = false;
      },
      error: (err) => {
        // console.error("Error loading videos:", err);
        this.showSnackbar(err.error?.message || 'Failed to load videos', 'error-snackbar');
        this.isLoading = false;
      }
    });
  }

  // --- Create Video Section ---

  // Handles file selection for any of the "Create" form's file inputs
  onFileSelectedNew(event: Event, fileType: 'video_file' | 'video_file_en' | 'video_file_hi'): void {
    const inputElement = event.target as HTMLInputElement | null;
    const file = inputElement?.files?.[0];

    if (file) {
        this.newVideoFiles[fileType] = file;
        //  console.log(`New ${fileType} selected:`, file.name);
         // Clear corresponding youtube link when a file is chosen
         if (fileType === 'video_file') this.newVideo.youtube_link = '';
         if (fileType === 'video_file_en') this.newVideo.youtube_link_en = '';
         if (fileType === 'video_file_hi') this.newVideo.youtube_link_hi = '';
    } else {
        // User might have cancelled selection, keep existing file selection if any
        // this.newVideoFiles[fileType] = null; // Only nullify if you want 'cancel' to clear
    }
     // Reset file input value visually so the same file can be selected again if needed after clearing
     if(inputElement) inputElement.value = '';
  }

  // Helper to reset the newVideo object
  resetNewVideoData(): Partial<VideoSection> {
    return {
        title: '',
        sort_order: 1,
        status: 'active',
        youtube_link: '',
        youtube_link_en: '',
        youtube_link_hi: '',
        // file paths are not part of this initial object
    };
  }


  createNewVideo(): void {
    // Validation 1: Required fields
    if (!this.newVideo.title) {
        this.showSnackbar('Title is required.', 'error-snackbar');
        return;
    }
    if (this.newVideo.sort_order === undefined || this.newVideo.sort_order === null || isNaN(Number(this.newVideo.sort_order))) {
        this.showSnackbar('Sort Order must be a valid number.', 'error-snackbar');
        return;
    }

    // Validation 2: At least one source
    const hasAnySource = this.newVideo.youtube_link || this.newVideo.youtube_link_en || this.newVideo.youtube_link_hi ||
                         this.newVideoFiles.video_file || this.newVideoFiles.video_file_en || this.newVideoFiles.video_file_hi;
    if (!hasAnySource) {
      this.showSnackbar('Please provide at least one YouTube link or upload at least one video file.', 'error-snackbar');
      return;
    }

    // Validation 3: Conflicts
    if (this.newVideo.youtube_link && this.newVideoFiles.video_file) { this.showSnackbar('Cannot provide both Fallback YouTube link and Fallback file.', 'error-snackbar'); return; }
    if (this.newVideo.youtube_link_en && this.newVideoFiles.video_file_en) { this.showSnackbar('Cannot provide both English YouTube link and English file.', 'error-snackbar'); return; }
    if (this.newVideo.youtube_link_hi && this.newVideoFiles.video_file_hi) { this.showSnackbar('Cannot provide both Hindi YouTube link and Hindi file.', 'error-snackbar'); return; }


    this.isLoading = true;
    // Pass the link data and the files object
    this.videoService.createVideoSection(this.newVideo, this.newVideoFiles).subscribe({
      next: (res) => {
        this.showSnackbar(res.message || 'Video section created successfully!', 'success-snackbar');
        this.clearCreateForm();
        this.loadVideos(); // Refresh the list
        // isLoading set to false within loadVideos completion
      },
      error: (err) => {
        // console.error("Error creating video:", err);
        this.showSnackbar(err.error?.message || 'Failed to create video section', 'error-snackbar');
        this.isLoading = false; // Ensure loading stops on error
      },
      // complete: () => { this.isLoading = false; } // Redundant if loadVideos sets it
    });
  }

  clearCreateForm(): void {
    this.newVideo = this.resetNewVideoData(); // Use helper
    this.newVideoFiles = { video_file: null, video_file_en: null, video_file_hi: null };
    // Reset file inputs visually using ViewChild references
    if (this.newVideoFileInput) this.newVideoFileInput.nativeElement.value = '';
    if (this.newVideoFileEnInput) this.newVideoFileEnInput.nativeElement.value = '';
    if (this.newVideoFileHiInput) this.newVideoFileHiInput.nativeElement.value = '';
  }

  // --- Edit/Update Video Section ---

  editVideo(video: VideoSection): void {
    this.editingVideoId = video.id;
    // Copy ALL properties from the video object
    this.editableVideoData = { ...video };
    // Reset any files selected for update for OTHER items
    this.filesForUpdate = { video_file: null, video_file_en: null, video_file_hi: null };
  }

  cancelEdit(): void {
    this.editingVideoId = null;
    this.editableVideoData = {};
    this.filesForUpdate = { video_file: null, video_file_en: null, video_file_hi: null };
  }

  // Handles file selection for any of the "Edit" form's file inputs
  onFileSelectedEdit(event: Event, videoId: number, fileType: 'video_file' | 'video_file_en' | 'video_file_hi'): void {
    if (this.editingVideoId !== videoId) return; // Safety check

    const inputElement = event.target as HTMLInputElement | null;
    const file = inputElement?.files?.[0];

    if (file) {
        this.filesForUpdate[fileType] = file; // Store the new file to be uploaded
        // console.log(`New ${fileType} selected for update (ID ${videoId}):`, file.name);
        // Clear corresponding youtube link in editable data
        if (fileType === 'video_file') this.editableVideoData.youtube_link = '';
        if (fileType === 'video_file_en') this.editableVideoData.youtube_link_en = '';
        if (fileType === 'video_file_hi') this.editableVideoData.youtube_link_hi = '';
        // Clear corresponding existing file path as well, since new file overrides it
        if (fileType === 'video_file') this.editableVideoData.video_file = null;
        if (fileType === 'video_file_en') this.editableVideoData.video_file_en = null;
        if (fileType === 'video_file_hi') this.editableVideoData.video_file_hi = null;
    } else {
        // If user cancels, clear the selection for upload
        this.filesForUpdate[fileType] = null;
        // DO NOT restore editableVideoData link/file path here, as user might clear link/file intentionally
    }
    // Reset file input visually
     if(inputElement) inputElement.value = '';
  }

  // Handle clearing a specific link input during edit
  onLinkChanged(linkType: 'youtube_link' | 'youtube_link_en' | 'youtube_link_hi') {
      if (this.editableVideoData[linkType]) { // If a link was entered
          // Clear the corresponding file selection and existing file path
          if (linkType === 'youtube_link') {
              this.filesForUpdate.video_file = null;
              this.editableVideoData.video_file = null;
          } else if (linkType === 'youtube_link_en') {
              this.filesForUpdate.video_file_en = null;
              this.editableVideoData.video_file_en = null;
          } else if (linkType === 'youtube_link_hi') {
              this.filesForUpdate.video_file_hi = null;
              this.editableVideoData.video_file_hi = null;
          }
      }
  }

  saveEdit(): void {
    if (!this.editingVideoId || !this.editableVideoData) return;

    // Validation: Required fields
    if (!this.editableVideoData.title) { this.showSnackbar('Title is required.', 'error-snackbar'); return; }
    if (this.editableVideoData.sort_order === undefined || this.editableVideoData.sort_order === null || isNaN(Number(this.editableVideoData.sort_order))) { this.showSnackbar('Sort Order must be a valid number.', 'error-snackbar'); return; }

    // Validation: Conflicts
    if (this.editableVideoData.youtube_link && (this.filesForUpdate.video_file || this.editableVideoData.video_file)) { this.showSnackbar('Cannot have both Fallback YouTube link and Fallback file.', 'error-snackbar'); return; }
    if (this.editableVideoData.youtube_link_en && (this.filesForUpdate.video_file_en || this.editableVideoData.video_file_en)) { this.showSnackbar('Cannot have both English YouTube link and English file.', 'error-snackbar'); return; }
    if (this.editableVideoData.youtube_link_hi && (this.filesForUpdate.video_file_hi || this.editableVideoData.video_file_hi)) { this.showSnackbar('Cannot have both Hindi YouTube link and Hindi file.', 'error-snackbar'); return; }

    // Validation: At least one source must remain/be provided
    const hasAnySource = this.editableVideoData.youtube_link || this.editableVideoData.youtube_link_en || this.editableVideoData.youtube_link_hi ||
                         this.filesForUpdate.video_file || this.filesForUpdate.video_file_en || this.filesForUpdate.video_file_hi ||
                         this.editableVideoData.video_file || this.editableVideoData.video_file_en || this.editableVideoData.video_file_hi;
    if (!hasAnySource) {
        this.showSnackbar('Please ensure at least one video source (YouTube or File) remains.', 'error-snackbar');
        return;
    }

    this.isLoading = true;
    // Pass the ID, the full editable data (contains links and EXISTING file paths)
    // Pass the object containing any NEWLY selected files for upload
    this.videoService.updateVideoSection(this.editingVideoId, this.editableVideoData, this.filesForUpdate)
      .subscribe({
        next: (res) => {
          this.showSnackbar(res.message || 'Video updated successfully', 'success-snackbar');
          this.cancelEdit();
          this.loadVideos();
          // isLoading handled by loadVideos
        },
        error: (err) => {
          // console.error("Error updating video:", err);
          this.showSnackbar(err.error?.message || 'Update failed', 'error-snackbar');
          this.isLoading = false;
        },
        // complete: () => { this.isLoading = false; } // Handled by loadVideos
    });
  }

  // --- Delete Video Section ---

  deleteVideo(video: VideoSection): void {
    if (!confirm(`Are you sure you want to delete "${video.title}"? This action cannot be undone.`)) return;

    this.isLoading = true;
    this.videoService.deleteVideoSection(video.id).subscribe({
      next: (res) => {
        this.showSnackbar(res.message || 'Video deleted successfully', 'success-snackbar');
        this.loadVideos(); // Refresh
        // isLoading handled by loadVideos
      },
      error: (err) => {
        // console.error("Error deleting video:", err);
        this.showSnackbar(err.error?.message || 'Deletion failed', 'error-snackbar');
        this.isLoading = false;
      },
       // complete: () => { this.isLoading = false; } // Handled by loadVideos
    });
  }


    // --- NEW Method to Clear Existing File Path during Edit ---
    clearExistingFile(fileType: 'video_file' | 'video_file_en' | 'video_file_hi'): void {
      if (this.editingVideoId && this.editableVideoData) {
          // console.log(`Clearing existing file path for type: ${fileType}`);
          this.editableVideoData[fileType] = null; // Set the existing path to null in the edit object
          // Note: This only clears the path in the temporary edit data.
          // The actual file deletion on the server happens when 'Save Changes' is clicked
          // and the backend receives an empty string or null for this file path.
          // Also, ensure the corresponding file input isn't disabled if the link is also empty
      }
    }

  // --- Utility ---

  sanitizeYoutubeUrl(url: string | null): SafeResourceUrl | null {
    if (!url || url.trim() === "") return null;
    const videoId = this.extractYoutubeVideoId(url);
    if (!videoId) {
         // console.warn("Could not extract video ID from URL:", url); // Already logged
         return null;
    }
    // Basic embed URL for admin preview, no autoplay needed
    const embedUrl = `https://www.youtube.com/embed/${videoId}`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
  }

  extractYoutubeVideoId(url: string): string | null {
    if (!url || url.trim() === "") return null;
    const regExps = [
        /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
        /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([a-zA-Z0-9_-]{11})/,
        /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
        /(?:https?:\/\/)?(?:www\.)?youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/
    ];
    for (const regex of regExps) {
        const match = url.match(regex);
        if (match && match[1]) {
            return match[1];
        }
    }
    //  console.warn('Could not match YouTube ID pattern for:', url);
    return null;
  }
}