import { Component, OnInit } from '@angular/core';
import { ValidateService } from '../../services/validate.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  email: String;
  password: String;
  data: any;

  constructor(
    private router: Router,
    private authService: AuthService,
    private validateService: ValidateService,
    private flashMessage: FlashMessagesService
  ) {}

  ngOnInit(): void {
    if (this.authService.loggedIn()) {
      this.router.navigate(['/']);
    }
  }

  showSuccess() {
    this.flashMessage.show('Success', {
      cssClass: 'alert-success',
      timeout: 3000,
    });
  }

  showErrors(errorMessage) {
    this.flashMessage.show(errorMessage, {
      cssClass: 'alert-danger',
      timeout: 6000,
    });
  }

  onLogin() {
    const user = {
      email: this.email,
      password: this.password,
    };

    // Required fields
    if (!this.validateService.validateLogin(user)) {
      this.showErrors('Please fill in all fields');
      return false;
    }

    // Validate email
    if (!this.validateService.validateEmail(user.email)) {
      this.showErrors('Please enter a valid email');
      return false;
    }

    // Validate password
    if (!this.validateService.validatePassword(user.password)) {
      const msg =
        'password must be at least 8 characters of letters and numbers';
      this.showErrors(msg);
      return false;
    }

    // Signin user
    this.authService.sendLoginRequest(user).subscribe(
      (data) => {
        this.data = data;
        this.showSuccess();
        this.authService.storeUserData(this.data.token, this.data.user);
        this.router.navigate(['/']);
      },
      (e) => {
        console.log(e);
        this.showErrors(e.error.msg || e.error.message);
        this.router.navigate(['/login']);
      }
    );
  }
}
