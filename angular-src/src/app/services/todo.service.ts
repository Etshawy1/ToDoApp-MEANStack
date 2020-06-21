import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  ToDoList: Array<any>;
  constructor(private httpClient: HttpClient) {}

  private REST_API_SERVER = 'http://localhost:3000/api/v1/';
  getToDoList() {
    return this.httpClient.get(`${this.REST_API_SERVER}todos`);
  }
}
