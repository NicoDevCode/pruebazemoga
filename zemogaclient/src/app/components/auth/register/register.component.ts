import { User } from './../../../models/user';
import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  public user: User;
  status: string;
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private userService: UserService
  ) { 
    this.user = new User('', '', '', '', true);
  }


  ngOnInit() {
  }

  onSubmit() {
    this.userService.register(this.user).subscribe(
      response => {
          this.user = response.user;
          this.status = 'succes'
          this.user = new User('', '', '', '', true);
      }, error => {
        console.log('error', error)
        this.status = 'error'
      }
    )
  }

}
