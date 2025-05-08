import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

// Interface matching the data structure used in the component/API
export interface VideoSection {
  id: number;
  title: string;
  sort_order: number;
  status: 'active' | 'inactive';
  youtube_link: string | null;
  youtube_link_en?: string | null; // Added optional
  youtube_link_hi?: string | null; // Added optional
  video_file: string | null;
  video_file_en?: string | null; // Added optional
  video_file_hi?: string | null; // Added optional
  // Add other fields returned by API if needed (e.g., created_at, updated_at)
}

// Interface for the API response structure (specifically for getAll)
interface GetAllVideosResponse {
    status: boolean;
    message: string;
    data: VideoSection[];
}

@Injectable({
  providedIn: 'root',
})
export class VideoSectionService {
  private baseUrl = `${environment.baseurl}/admin`; // Use environment variable

  constructor(private http: HttpClient) {}

  // Helper to get headers, handles Authorization and Content-Type for FormData
  private getHeaders(isFormData: boolean = false): HttpHeaders {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    // IMPORTANT: Do NOT set Content-Type for FormData requests
    // The browser will set it automatically with the correct boundary
    // if (!isFormData) {
    //   headers = headers.set('Content-Type', 'application/json');
    // }

    return headers;
  }

  // Fetch all video sections (Using POST as per your backend route)
  getAllVideos(): Observable<GetAllVideosResponse> {
    // Pass empty object {} if backend expects a body for POST
    return this.http.post<GetAllVideosResponse>(`${this.baseUrl}/getAllVideoSections`, {}, {
      headers: this.getHeaders() // Not FormData
    });
  }

  // Create a new video section (Uses FormData)
  // createVideoSection(videoData: Partial<VideoSection>, videoFile: File | null): Observable<any> {
  //   const formData = new FormData();

  //   // Append fields that are always required or have defaults
  //   formData.append('title', videoData.title || '');
  //   formData.append('sort_order', (videoData.sort_order ?? 1).toString()); // Default sort order if needed
  //   formData.append('status', videoData.status || 'active'); // Default status

  //   // Append youtube_link only if provided
  //   if (videoData.youtube_link) {
  //       formData.append('youtube_link', videoData.youtube_link);
  //   }

  //   // Append video_file only if provided
  //   if (videoFile) {
  //     formData.append('video_file', videoFile, videoFile.name);
  //   }

  //   return this.http.post(`${this.baseUrl}/createVideoSection`, formData, {
  //     headers: this.getHeaders(true), // Indicate FormData
  //   });
  // }





  // --- UPDATED createVideoSection ---
  createVideoSection(
    videoData: Partial<VideoSection>, // Contains title, sort_order, status, links
    files: { // Object to hold potential files
        video_file: File | null;
        video_file_en: File | null;
        video_file_hi: File | null;
    }
): Observable<any> {
  const formData = new FormData();

  formData.append('title', videoData.title || '');
  formData.append('sort_order', (videoData.sort_order ?? 1).toString());
  formData.append('status', videoData.status || 'active');

  // Append links only if provided
  if (videoData.youtube_link) formData.append('youtube_link', videoData.youtube_link);
  if (videoData.youtube_link_en) formData.append('youtube_link_en', videoData.youtube_link_en);
  if (videoData.youtube_link_hi) formData.append('youtube_link_hi', videoData.youtube_link_hi);

  // Append files only if provided
  if (files.video_file) formData.append('video_file', files.video_file, files.video_file.name);
  if (files.video_file_en) formData.append('video_file_en', files.video_file_en, files.video_file_en.name);
  if (files.video_file_hi) formData.append('video_file_hi', files.video_file_hi, files.video_file_hi.name);

  // Backend validation should check conflicts (e.g., youtube_link_en AND video_file_en)
  // and ensure at least one source exists.

  return this.http.post(`${this.baseUrl}/createVideoSection`, formData, {
    headers: this.getHeaders(), // Headers without Content-Type for FormData
  });
}









  // updateVideoSection(id: number, payload: Partial<VideoSection>, videoFile: File | null): Observable<any> {
  //   const formData = new FormData();

  //   // Append standard text fields
  //   if (payload.title !== undefined) formData.append('title', payload.title);
  //   if (payload.sort_order !== undefined) formData.append('sort_order', payload.sort_order.toString());
  //   if (payload.status !== undefined) formData.append('status', payload.status);

  //   // --- Logic for video_file and youtube_link ---

  //   if (videoFile) {
  //     // 1. NEW FILE UPLOADED: Send the new file, clear the link.
  //     console.log('Service: Sending NEW video file');
  //     formData.append('video_file', videoFile, videoFile.name);
  //     formData.append('youtube_link', ''); // Clear link if new file is uploaded

  //   } else if (payload.youtube_link) {
  //     // 2. YOUTUBE LINK PROVIDED (and no new file): Send the link.
  //     //    Backend should handle clearing the existing video_file path in the DB.
  //     console.log('Service: Sending YouTube link');
  //     formData.append('youtube_link', payload.youtube_link);
  //     // **Crucially, DO NOT send the old video_file path if a link is provided.**
  //     // Depending on backend: maybe send an empty 'video_file' to signal clearing?
  //     // formData.append('video_file', ''); // Uncomment if backend expects this to clear

  //   } else if (payload.video_file) {
  //     // 3. NO NEW FILE, NO LINK, but EXISTING PATH exists: Send the path string.
  //     console.log('Service: Sending EXISTING video file path string:', payload.video_file);
  //     formData.append('video_file', payload.video_file); // Send the relative path as a string
  //     formData.append('youtube_link', ''); // Ensure link field is empty

  //   } else {
  //     // 4. NO NEW FILE, NO LINK, NO EXISTING PATH: Send empty values.
  //     console.log('Service: Sending empty link and potentially empty file path');
  //     formData.append('youtube_link', '');
  //     // Depending on backend: maybe send an empty 'video_file' to signal clearing?
  //     // formData.append('video_file', ''); // Uncomment if backend expects this
  //   }
  //   // --- End Logic ---


  //   return this.http.post(`${this.baseUrl}/updateVideoSection/${id}`, formData, {
  //     headers: this.getHeaders(true) // Indicate FormData
  //   });
  // }






  // --- UPDATED updateVideoSection ---
  updateVideoSection(
    id: number,
    payload: Partial<VideoSection>, // Contains title, sort_order, status, links, AND existing file paths
    newFiles: { // Object to hold potentially NEW files for update
        video_file: File | null;
        video_file_en: File | null;
        video_file_hi: File | null;
    }
): Observable<any> {
  const formData = new FormData();

  // Append standard text fields
  if (payload.title !== undefined) formData.append('title', payload.title);
  if (payload.sort_order !== undefined) formData.append('sort_order', payload.sort_order.toString());
  if (payload.status !== undefined) formData.append('status', payload.status);

  // Append YouTube links (send empty string if link is cleared)
  formData.append('youtube_link', payload.youtube_link || '');
  formData.append('youtube_link_en', payload.youtube_link_en || '');
  formData.append('youtube_link_hi', payload.youtube_link_hi || '');

  // Append video files (new file OR existing path string OR empty string to clear)
  // Fallback
  if (newFiles.video_file) {
      formData.append('video_file', newFiles.video_file, newFiles.video_file.name);
  } else if (payload.video_file) { // If no new file, send existing path string (if it exists)
      formData.append('video_file', payload.video_file);
  } else {
       formData.append('video_file', ''); // Send empty if no new file and no existing path (or cleared)
  }

  // English
  if (newFiles.video_file_en) {
      formData.append('video_file_en', newFiles.video_file_en, newFiles.video_file_en.name);
  } else if (payload.video_file_en) {
      formData.append('video_file_en', payload.video_file_en);
  } else {
       formData.append('video_file_en', '');
  }

  // Hindi
  if (newFiles.video_file_hi) {
      formData.append('video_file_hi', newFiles.video_file_hi, newFiles.video_file_hi.name);
  } else if (payload.video_file_hi) {
      formData.append('video_file_hi', payload.video_file_hi);
  } else {
       formData.append('video_file_hi', '');
  }

  // Backend needs robust logic to handle updates:
  // - If a new file is sent for a slot (e.g., video_file_en), delete the old one if it exists.
  // - If a youtube link is sent for a slot, delete the corresponding file path in DB.
  // - If an empty file path string is sent (''), delete the corresponding file path in DB.

  return this.http.post(`${this.baseUrl}/updateVideoSection/${id}`, formData, {
    headers: this.getHeaders(), // Headers without Content-Type for FormData
  });
}



deleteVideoSection(id: number): Observable<any> {
  // Backend POST route should probably expect an empty body or specific ID if needed
  return this.http.post(`${this.baseUrl}/deleteVideoSection/${id}`, {}, { // Pass empty body
    headers: this.getHeaders()
  });
}






  // // Delete a video section
  // deleteVideoSection(id: number): Observable<any> {
  //   return this.http.post(`${this.baseUrl}/deleteVideoSection/${id}`, {
  //     headers: this.getHeaders() // Not FormData
  //   });
  // }

  // No separate uploadVideoFile method needed, handled by updateVideoSection
}
