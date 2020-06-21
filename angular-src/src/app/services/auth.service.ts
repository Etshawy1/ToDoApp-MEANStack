import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';

const helper = new JwtHelperService();

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private httpClient: HttpClient) {}

  user: any;

  sendRegisterRequest(user) {
    return this.httpClient.post(`api/v1/users/signup`, user);
  }

  sendLoginRequest(user) {
    return this.httpClient.post(`api/v1/users/login`, user);
  }

  storeUserData(token, user) {
    localStorage.setItem('id_token', token);
    localStorage.setItem('userName', user.name);
    localStorage.setItem('userId', user._id);
    this.user = user;
    environment.authToken = token;
  }

  loadToken() {
    environment.authToken = localStorage.getItem('id_token');
  }

  setAuthHeader() {
    let headers = new HttpHeaders();
    this.loadToken();
    return headers.append('Authorization', `Bearer ${environment.authToken}`);
  }

  logout() {
    environment.authToken = undefined;
    this.user = undefined;
    localStorage.clear();
  }

  loggedIn() {
    return !helper.isTokenExpired(localStorage.getItem('id_token'));
  }
}
