// import { Injectable, NgZone } from '@angular/core';
// import { Router } from '@angular/router';

// declare const google: any;

// @Injectable({
//   providedIn: 'root'
// })
// export class GoogleAuthService {
//   private clientId = '42508244887-n9iqmtoog1e8k33k0roq4l0qqui1o72u.apps.googleusercontent.com';
//   private userData: any = null;

//   constructor(private zone: NgZone, private router: Router) { }

//   initializeGoogleSignIn(): void {
//     const tryInit = () => {
//       if (typeof google !== 'undefined') {
//         google.accounts.id.initialize({
//           client_id: this.clientId,
//           callback: (response: any) => {
//             this.zone.run(() => {
//               const user = this.decodeJwtResponse(response.credential);
//               this.userData = user;
//               localStorage.setItem('user', JSON.stringify(user));
//               const savedUser = localStorage.getItem('user');
//               if (savedUser) {
//                 this.router.navigate(['/dashboard']);
//               } else {
//                 console.error('Failed to save user data');
//               }
//             });
//           }
//         });

//         google.accounts.id.renderButton(
//           document.getElementById('google-btn'),
//           { theme: 'filled_blue', size: 'large', width: 250 }
//         );
//       } else {
//         setTimeout(tryInit, 200);
//       }
//     };

//     tryInit();
//   }


//   getUser() {
//     return this.userData || JSON.parse(localStorage.getItem('user') || 'null');
//   }

//   logout() {
//     this.userData = null;
//     localStorage.removeItem('user');
//     this.router.navigate(['/login']);
//   }

//   private decodeJwtResponse(token: string): any {
//     const base64Url = token.split('.')[1];
//     const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
//     const jsonPayload = decodeURIComponent(
//       atob(base64)
//         .split('')
//         .map(c => `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`)
//         .join('')
//     );
//     return JSON.parse(jsonPayload);
//   }
// }


import { Injectable, NgZone, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { secrets } from '../../env/secrets';

declare const google: any;

@Injectable({
  providedIn: 'root'
})
export class GoogleAuthService {
  private clientId = secrets.googleClientId;
  private userData: any = null;

  constructor(
    private zone: NgZone,
    private router: Router
  ) { }

  initializeGoogleSignIn(): void {
    const tryInit = () => {
      // Wait until Google object is available
      if (typeof google !== 'undefined' && google.accounts?.id) {
        google.accounts.id.initialize({
          client_id: this.clientId,
          callback: (response: any) => this.handleCredentialResponse(response)
        });

        google.accounts.id.renderButton(
          document.getElementById('google-btn'),
          {
            theme: 'filled_blue',
            size: 'large',
            width: 250
          }
        );
      } else {
        // Retry until google script is ready
        setTimeout(tryInit, 200);
      }
    };

    tryInit();
  }

  private handleCredentialResponse(response: any): void {
    // Run inside Angular zone so UI updates instantly
    this.zone.run(() => {
      const user = this.decodeJwtResponse(response.credential);
      this.userData = user;
      localStorage.setItem('user', JSON.stringify(user));

      // Check if stored successfully
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        this.router.navigate(['/dashboard']);
      } else {
        console.error('❌ Failed to save user data in localStorage');
      }
    });
  }

  getUser() {
    return this.userData || JSON.parse(localStorage.getItem('user') || 'null');
  }

  logout() {
    this.userData = null;
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  private decodeJwtResponse(token: string): any {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`)
        .join('')
    );
    return JSON.parse(jsonPayload);
  }
}
