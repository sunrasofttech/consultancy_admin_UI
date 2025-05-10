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
  youtube_link: string | null; // Can be null if video_file exists
  video_file: string | null;   // Can be null if youtube_link exists
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
  createVideoSection(videoData: Partial<VideoSection>, videoFile: File | null): Observable<any> {
    const formData = new FormData();

    // Append fields that are always required or have defaults
    formData.append('title', videoData.title || '');
    formData.append('sort_order', (videoData.sort_order ?? 1).toString()); // Default sort order if needed
    formData.append('status', videoData.status || 'active'); // Default status

    // Append youtube_link only if provided
    if (videoData.youtube_link) {
        formData.append('youtube_link', videoData.youtube_link);
    }

    // Append video_file only if provided
    if (videoFile) {
      formData.append('video_file', videoFile, videoFile.name);
    }

    return this.http.post(`${this.baseUrl}/createVideoSection`, formData, {
      headers: this.getHeaders(true), // Indicate FormData
    });
  }

  // Update an existing video section (Uses FormData as backend uses multer)
  // Pass the full payload and optional file
  updateVideoSection(id: number, payload: Partial<VideoSection>, videoFile: File | null): Observable<any> {
    const formData = new FormData();

    // Append all fields from the payload
    if (payload.title !== undefined) formData.append('title', payload.title);
    if (payload.sort_order !== undefined) formData.append('sort_order', payload.sort_order.toString());
    if (payload.status !== undefined) formData.append('status', payload.status);

    // Handle link/file update logic based on backend (send link even if empty?)
    // Check your backend: Does sending an empty youtube_link clear it?
    // Assuming sending the current value or empty string is desired
    formData.append('youtube_link', payload.youtube_link || ''); // Send empty string if null/undefined

    // Append the new video file if one was selected for upload
    if (videoFile) {
      formData.append('video_file', videoFile, videoFile.name);
      // If uploading a file overwrites the youtube_link on the backend,
      // you might explicitly set youtube_link to empty/null here in the FormData
      // formData.set('youtube_link', ''); // Example if upload clears link
    }
     // If NO new file is uploaded, do NOT append 'video_file'.
     // The backend should retain the existing video_file value in this case.

    return this.http.post(`${this.baseUrl}/updateVideoSection/${id}`, formData, {
      headers: this.getHeaders(true) // Indicate FormData
    });
  }


  // Delete a video section
  deleteVideoSection(id: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/deleteVideoSection/${id}`, {
      headers: this.getHeaders() // Not FormData
    });
  }

  // No separate uploadVideoFile method needed, handled by updateVideoSection
}