import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import {SnotifyService, SnotifyPosition} from 'ng-snotify';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  porcentUp0 = 0;
  porcentDown0 = 0;
  porcentUp2 = 0;
  porcentDown2 = 0;
  porcentUp1 = 0;
  porcentDown1 = 0;
  porcentUp3 = 0;
  porcentDown3 = 0;
  votoBool: number;
  candidatos: any;
  votar: any;
  alert = true;
  token: any;
  constructor(private snotifyService: SnotifyService, private userService: UserService) { }

  ngOnInit() {
    this.Getcandidatos();
    this.token = JSON.parse(localStorage.getItem("token"));
  }

  Getcandidatos() {
    this.userService.candidatos().subscribe(
      data => {
       this.candidatos = data.candidatos;
       console.log(this.candidatos);
       this.porcentUp0 = Math.round((this.candidatos[0].votosUp/this.candidatos[0].votos)*100);
       this.porcentDown0 = Math.round((this.candidatos[0].votosDown/this.candidatos[0].votos)*100);
       document.getElementById("up-votes-0").style.width = `${this.porcentUp0}%`;
       document.getElementById("down-votes-0").style.width = `${this.porcentDown0}%`;

       this.porcentUp2 = Math.round((this.candidatos[2].votosUp/this.candidatos[2].votos)*100);
       this.porcentDown2 = Math.round((this.candidatos[2].votosDown/this.candidatos[2].votos)*100);
       document.getElementById("up-votes-2").style.width = `${this.porcentUp2}%`;
       document.getElementById("down-votes-2").style.width = `${this.porcentDown2}%`;

       this.porcentUp1 = Math.round((this.candidatos[1].votosUp/this.candidatos[1].votos)*100);
       this.porcentDown1 = Math.round((this.candidatos[1].votosDown/this.candidatos[1].votos)*100);
       document.getElementById("up-votes-1").style.width = `${this.porcentUp1}%`;
       document.getElementById("down-votes-1").style.width = `${this.porcentDown1}%`;

       this.porcentUp3 = Math.round((this.candidatos[3].votosUp/this.candidatos[3].votos)*100);
       this.porcentDown3 = Math.round((this.candidatos[3].votosDown/this.candidatos[3].votos)*100);
       document.getElementById("up-votes-3").style.width = `${this.porcentUp3}%`;
       document.getElementById("down-votes-3").style.width = `${this.porcentDown3}%`;
      }
    );
  }

  selectVoto = (voto) => {
      if (voto) {
        this.votoBool = 1;
      } else {
        this.votoBool = 0;
      }
  }

  votaNow = (Id) => {
    if (this.token !== null) {
      let data = JSON.parse(localStorage.getItem("data"));
      let email = data.email; 
      console.log('email', email)
      console.log('id', Id)
      this.votar = {
        Id: Id,
        email: email,
        voto: this.votoBool
      } 
      console.log(this.votar);
      if(this.votoBool != undefined){
        this.userService.votar(this.votar).subscribe(
          data => {
            if(data.tope == true) {
              console.log('tope', data.tope);
              this.snotifyService.info(`thanks for participating but you have finished your vows`, 'Try again!', { timeout: 2000, showProgressBar: false, closeOnClick: true, position: SnotifyPosition.rightTop });
            }else {
              this.snotifyService.success(`Thank you for participating and voting.`, 'Success', { timeout: 2000, showProgressBar: false, closeOnClick: true, position: SnotifyPosition.rightTop });
            }
           console.log('data', data);         
          }
        );
      } else {
        this.snotifyService.error(`you must choose an option to participate and vote`, 'Try again!', { timeout: 2000, showProgressBar: false, closeOnClick: true, position: SnotifyPosition.rightTop });
      }
    } else {
      this.snotifyService.error(`sorry you must login or to participate`, 'Try again!', { timeout: 2000, showProgressBar: false, closeOnClick: true, position: SnotifyPosition.rightTop });
    }
     
  }

  close = () => {
    this.alert = false;
  }


}
