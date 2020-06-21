import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  constructor(
    private httpClient: HttpClient,
    private authService: AuthService
  ) {}

  getToDoList() {
    const headers = this.authService.setAuthHeader();
    return this.httpClient.get(`api/v1/todo`, {
      headers,
    });
  }

  createToDo(content) {
    const todo = { content, createdAt: Date.now() };
    const headers = this.authService.setAuthHeader();
    return this.httpClient.post(`api/v1/todo`, todo, {
      headers,
    });
  }

  updateToDo(content) {
    const headers = this.authService.setAuthHeader();
    return this.httpClient.patch(`api/v1/todo/${content._id}`, content, {
      headers,
    });
  }

  deleteToDo(content) {
    const headers = this.authService.setAuthHeader();
    return this.httpClient.delete(`api/v1/todo/${content._id}`, {
      headers,
    });
  }
}
