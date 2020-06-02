import { Component, OnInit, ViewChild } from '@angular/core'
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  token: any;
  checkNanbtn: boolean;
  constructor(private router:Router) { }

  ngOnInit() {
    this.token = JSON.parse(localStorage.getItem("token"));
    if(this.token == null){
      this.checkNanbtn = true;
    }else {
      this.checkNanbtn = false;
    }
    console.log('token',  this.token)
  }

  LogOut() {
    localStorage.clear()
    this.router.navigate(['/login']);
    window.location.reload();
  } 

}
