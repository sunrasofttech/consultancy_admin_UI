// import { Component } from '@angular/core';
// import { Router } from '@angular/router';
// import { LoginService } from '../services/login.service';

// @Component({
//   selector: 'app-login',
//   templateUrl: './login.component.html',
//   styleUrls: ['./login.component.css']
// })
// export class LoginComponent {
//   usernameOrMobile: string = ''; // Binding to form input
//   password: string = '';         // Binding to form input
//   passwordFieldType: string = 'password'; // Track password input type

//   constructor(
//     private router: Router,
//     private loginService: LoginService,
//   ) { }

//   onLogin() {
//     const credentials = {
//       emailOrPhone: this.usernameOrMobile,
//       password: this.password
//     };

//     this.loginService.adminLogin(credentials).subscribe({
//       next: (response) => {
//         console.log("2")

//         if (response.status) {
//           console.log("response", response)

//           localStorage.setItem('token', response.token); // Store JWT token
//           console.log("response after")

//           this.router.navigate(['/dashboard']); // Redirect to dashboard
//         } else {
//           console.log("response else")

//         }
//       },
//       error: (error) => {
//         console.log("response else")
//         console.error('Login error:', error);

//       }
//     });
//   }

//   onClick() {
//     // const credentials = {
//     //   emailOrPhone: this.usernameOrMobile,
//     //   password: this.password
//     // };

//     // this.loginService.adminLogin(credentials).subscribe({
//     //   next: (response) => {
//     //     console.log("2")

//     //     if (response.status) {
//     //       console.log("response", response)

//     //       localStorage.setItem('token', response.token); // Store JWT token
//     //       console.log("response after")

//     //       this.router.navigate(['/dashboard']); // Redirect to dashboard
//     //     } else {
//     //       console.log("response else")

//     //     }
//     //   },
//     //   error: (error) => {
//     //     console.log("response else")
//     //     console.error('Login error:', error);

//     //   }
//     // });

//     // this.router.navigate(['/dashboard'])
//   }

//   togglePasswordVisibility() {
//     this.passwordFieldType =
//       this.passwordFieldType === 'password' ? 'text' : 'password';
//   }
// }


import { Component } from '@angular/core';
import { Router } from '@angular/router';
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

  constructor(private router: Router, private loginService: LoginService) {}

  onLogin() {
    const credentials = {
      emailOrPhone: this.usernameOrMobile,
      password: this.password,
    };

    this.loginService.adminLogin(credentials).subscribe({
      next: (response) => {
        if (response.status) {
          localStorage.setItem('token', response.token); // Store JWT token
          this.router.navigate(['/dashboard']); // Redirect to dashboard
        } else {
          alert(response.message || 'Invalid login credentials');
        }
      },
      error: (error) => {
        console.error('Login error:', error);
        alert('An error occurred during login. Please try again.');
      },
    });
  }

  togglePasswordVisibility() {
    this.passwordFieldType =
      this.passwordFieldType === 'password' ? 'text' : 'password';
  }
}

