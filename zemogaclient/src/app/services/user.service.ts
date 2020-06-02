import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {throwError} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private registerAPI = 'https://eqfd2uf728.execute-api.us-east-1.amazonaws.com/dev/api/register'
  private loginAPI = 'https://eqfd2uf728.execute-api.us-east-1.amazonaws.com/dev/api/login'
  private voteAPI = 'https://eqfd2uf728.execute-api.us-east-1.amazonaws.com/dev/api/vote'
  private candidatosAPI = 'https://eqfd2uf728.execute-api.us-east-1.amazonaws.com/dev/api/allcandidatos'

  constructor(private  http: HttpClient) { }

  register(data): Observable<any> {
    let headers = new HttpHeaders({'Content-Type':'application/json'})
    return this.http.post(`${this.registerAPI}`, data, {headers: headers} );
  }

  login(data): Observable<any> {
    let headers = new HttpHeaders({'Content-Type':'application/json'})
    return this.http.post(`${this.loginAPI}`, data, {headers: headers} );
  }

  candidatos(): Observable<any> {
    return this.http.get(`${this.candidatosAPI}`);
  }

  votar(data): Observable<any> {
    let headers = new HttpHeaders({'Content-Type':'application/json'})
    return this.http.post(`${this.voteAPI}`, data, {headers: headers} );
  }
}
