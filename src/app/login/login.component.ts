

// import { Component } from '@angular/core';
// import { Router } from '@angular/router';
// import { LoginService } from '../services/login.service';

// @Component({
//   selector: 'app-login',
//   templateUrl: './login.component.html',
//   styleUrls: ['./login.component.css'],
// })
// export class LoginComponent {
//   usernameOrMobile: string = '';
//   password: string = '';
//   passwordFieldType: string = 'password';

//   constructor(private router: Router, private loginService: LoginService) {}

//   onLogin() {
//     const credentials = {
//       emailOrPhone: this.usernameOrMobile,
//       password: this.password,
//     };

//     this.loginService.adminLogin(credentials).subscribe({
//       next: (response) => {
//         if (response.status) {
//           localStorage.setItem('token', response.token); // Store JWT token
//           this.router.navigate(['/dashboard']); // Redirect to dashboard
//         } else {
//           alert(response.message || 'Invalid login credentials');
//         }
//       },
//       error: (error) => {
//         console.error('Login error:', error);
//         alert('An error occurred during login. Please try again.');
//       },
//     });
//   }

//   togglePasswordVisibility() {
//     this.passwordFieldType =
//       this.passwordFieldType === 'password' ? 'text' : 'password';
//   }
// }



import { Component } from '@angular/core';
// Import ActivatedRoute along with Router
import { Router, ActivatedRoute } from '@angular/router';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  usernameOrMobile: string = '';
  password: string = '';
  passwordFieldType: string = 'password';
  errorMessage: string = ''; // For displaying errors in the template (optional)
  loading: boolean = false; // For loading indicator (optional)

  constructor(
    private router: Router,
    private loginService: LoginService,
    private route: ActivatedRoute // <<< Inject ActivatedRoute
  ) {}

  onLogin() {
    this.loading = true; // Optional: Indicate loading started
    this.errorMessage = ''; // Optional: Clear previous error message

    const credentials = {
      emailOrPhone: this.usernameOrMobile,
      password: this.password,
    };

    this.loginService.adminLogin(credentials).subscribe({
      next: (response) => {
        this.loading = false; // Optional: Indicate loading finished
        if (response.status && response.token) { // Check for status and token
          localStorage.setItem('token', response.token); // Store JWT token

          // --- MODIFIED REDIRECT LOGIC ---
          // Check for the 'returnUrl' query parameter added by the AuthGuard
          const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard'; // Default to dashboard
          console.log('Login successful, redirecting to:', returnUrl); // For debugging

          // Navigate to the intended URL or the default dashboard
          this.router.navigateByUrl(returnUrl);
          // --- END OF MODIFIED REDIRECT LOGIC ---

        } else {
          // Handle cases where status is false or token is missing
          const message = response.message || 'Invalid login credentials or missing token.';
          alert(message); // Use alert or set errorMessage
          this.errorMessage = message; // Optional
        }
      },
      error: (error) => {
        this.loading = false; // Optional: Indicate loading finished on error
        console.error('Login error:', error);
        const message = 'An error occurred during login. Please try again.';
        alert(message); // Use alert or set errorMessage
        this.errorMessage = message; // Optional
      },
    });
  }

  togglePasswordVisibility() {
    this.passwordFieldType =
      this.passwordFieldType === 'password' ? 'text' : 'password';
  }
}