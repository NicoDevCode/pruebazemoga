import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public user: User;
  token: any;
  status: string;
  ghome: boolean;
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private userService: UserService,
    private router:Router
  ) { 
    this.user = new User('', '', '', '', true);
  }

  ngOnInit() {
    this.token = JSON.parse(localStorage.getItem("token"));
    if (this.token !== null){
      this.ghome = true
    }else{
      this.ghome = false
    }
  }

  onSubmit() {
    this.userService.login(this.user).subscribe(
      response => {
          this.user = response.user;
          console.log(response);
          localStorage.setItem('token', JSON.stringify(response.user.token))
          localStorage.setItem('data', JSON.stringify(response.user.data))
          this.user = new User('', '', '', '', true);
          this.status = 'succes'
          window.location.reload();
      }, error => {
        console.log('error', error)
        this.status = 'error'
      }
    )
  }

}
