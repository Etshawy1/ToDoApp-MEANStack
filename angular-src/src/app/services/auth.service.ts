import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private httpClient: HttpClient) {}

  authToken: any;
  user: any;

  private REST_API_SERVER = 'http://localhost:3000/api/v1/';
  sendRegisterRequest(user) {
    return this.httpClient.post(`${this.REST_API_SERVER}users/signup`, user);
  }

  sendLoginRequest(user) {
    return this.httpClient.post(`${this.REST_API_SERVER}users/login`, user);
  }

  storeUserData(token, user) {
    localStorage.setItem('id_token', token);
    localStorage.setItem('userName', user.name);
    localStorage.setItem('userId', user._id);
    this.user = user;
    this.authToken = token;
  }

  logout() {
    this.authToken = undefined;
    this.user = undefined;
    localStorage.clear();
  }
}
