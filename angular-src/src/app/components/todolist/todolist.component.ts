import { Component, OnInit } from '@angular/core';
import { TodoService } from '../../services/todo.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-todolist',
  templateUrl: './todolist.component.html',
  styleUrls: ['./todolist.component.css'],
})
export class TodolistComponent implements OnInit {
  constructor(
    private toDoService: TodoService,
    private router: Router,
    private flashMessage: FlashMessagesService,
    private toastr: ToastrService
  ) {}

  ToDoList: any;

  showErrors(errorMessage) {
    this.toastr.error(errorMessage);
  }

  showSuccess() {
    this.toastr.success('Success', '', { timeOut: 1000 });
  }

  ngOnInit(): void {
    this.toDoService.getToDoList().subscribe(
      (data) => {
        this.ToDoList = data;
      },
      (e) => {
        console.log(e);
        this.showErrors(e.error.msg || e.error.message);
        this.router.navigate(['/']);
      }
    );
  }

  createToDo(content) {
    if (!content) return false;
    this.toDoService.createToDo(content).subscribe(
      (data) => {
        this.ToDoList.unshift(data);
        this.showSuccess();
      },
      (e) => {
        console.log(e);
        this.showErrors(e.error.msg || e.error.message);
      }
    );
  }

  checkOrUncheckToDo(_id, flag) {
    const removeIndex = this.ToDoList.map(function (item) {
      return item._id;
    }).indexOf(_id);
    const toDo = this.ToDoList[removeIndex];
    toDo.checked = flag;
    if (flag) toDo.checkedAt = Date.now();
    else toDo.createdAt = Date.now();
    this.showSuccess();
    this.toDoService.updateToDo(toDo).subscribe(
      (data) => {
        this.ToDoList.splice(removeIndex, 1);
        if (toDo.checked) this.ToDoList.push(data);
        else this.ToDoList.unshift(data);
      },
      (e) => {
        console.log(e);
        this.showErrors(e.error.msg || e.error.message);
      }
    );
  }

  deleteToDo(_id) {
    const removeIndex = this.ToDoList.map(function (item) {
      return item._id;
    }).indexOf(_id);
    this.toDoService.deleteToDo(this.ToDoList[removeIndex]).subscribe(
      (data) => {
        ~removeIndex && this.ToDoList.splice(removeIndex, 1);
        this.showSuccess();
      },
      (e) => {
        console.log(e);
        this.showErrors(e.error.msg || e.error.message);
      }
    );
  }
}
