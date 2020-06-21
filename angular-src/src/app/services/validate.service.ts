import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ValidateService {
  constructor() {}

  validateRegister(user) {
    return !(
      user.name == undefined ||
      user.password == undefined ||
      user.passwordConfirm == undefined ||
      user.email == undefined
    );
  }
  validateLogin(user) {
    return !(user.password == undefined || user.email == undefined);
  }

  validateEmail(email) {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
  }

  validatePassword(password) {
    return /^(?=.*[0-9]+.*)(?=.*[a-zA-Z]+.*)[0-9a-zA-Z]{8,}$/.test(password);
  }

  validatePasswordConfirm(password, passwordConfirm) {
    return passwordConfirm === password;
  }
}
