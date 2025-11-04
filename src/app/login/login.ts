import { Component, OnInit } from '@angular/core';
import { GoogleAuthService } from '../services/google-auth';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {

  constructor(private googleAuth: GoogleAuthService) { }

  ngOnInit(): void {
    this.googleAuth.initializeGoogleSignIn();
  }
}