import { Component, OnInit } from '@angular/core';
import { ValidateService } from '../../services/validate.service';
import { AuthService } from '../../services/auth.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  name: String;
  password: String;
  passwordConfirm: String;
  email: String;
  data: any;

  constructor(
    private validateService: ValidateService,
    private flashMessage: FlashMessagesService,
    private authService: AuthService,
    private router: Router
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

  onRegister() {
    const user = {
      name: this.name,
      email: this.email,
      password: this.password,
      passwordConfirm: this.passwordConfirm,
    };

    // Required fields
    if (!this.validateService.validateRegister(user)) {
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

    // Validate password confirm
    if (
      !this.validateService.validatePasswordConfirm(
        user.password,
        user.passwordConfirm
      )
    ) {
      const msg = 'password and password confirm do not match';
      this.showErrors(msg);
      return false;
    }

    // Register user
    this.authService.sendRegisterRequest(user).subscribe(
      (data) => {
        this.data = data;
        this.showSuccess();
        this.authService.storeUserData(this.data.token, this.data.user);
        this.router.navigate(['/']);
      },
      (e) => {
        console.log(e);
        this.showErrors(e.error.msg || e.error.message);
        this.router.navigate(['/register']);
      }
    );
  }
}
