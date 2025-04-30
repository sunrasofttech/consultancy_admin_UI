import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from "jwt-decode"; // Correct import

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router: Router) { }

  // Get the token from localStorage
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Check if the user is currently logged in (token exists and is not expired)
  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) {
      return false; // No token
    }

    try {
      // Decode the token to get its payload (including expiration)
      const decodedToken: any = jwtDecode(token);

      // Check if token has expiration claim ('exp')
      if (!decodedToken.exp) {
          console.warn('Token does not have an expiration claim.');
          // Decide how to handle tokens without expiration - treat as invalid?
          return false; // Or true depending on your security policy
      }

      // 'exp' is usually in seconds since epoch, convert to milliseconds
      const expirationDate = decodedToken.exp * 1000;
      const now = Date.now();

      // Check if expiration date is in the past
      if (expirationDate < now) {
          console.log('Token expired.');
          this.logout(); // Optionally clear expired token
          return false;
      }

      // Token exists, is decoded, and is not expired
      return true;

    } catch (error) {
      // If decoding fails, the token is invalid or corrupted
      console.error('Error decoding token:', error);
      this.logout(); // Clean up invalid token
      return false;
    }
  }

  // Method to log the user out (e.g., clear token, redirect)
  logout(): void {
    localStorage.removeItem('token');
    // Optional: Clear other user data
    // this.router.navigate(['/login']); // Redirect to login after logout

    this.router.navigate(['/login'], { replaceUrl: true }); // <<<--- ADD { replaceUrl: true }

    console.log('AuthService: Navigated to /login with history replacement.');
  }

  
}