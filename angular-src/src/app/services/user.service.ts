import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { tokenNotExpired } from 'angular2-jwt';

@Injectable()
export class UserService {

  url: string = ""
  authToken: any;

  constructor(
    private http: Http
  ) { }

  // function to load the token
  loadToken() {
    const token = localStorage.getItem('token')
    this.authToken = token;
  }
 
  addUser(user) {
    let headers = new Headers();
    this.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.url + '/v1/user/addUser', user, {headers: headers})
    .map(res => res.json());
  }

  getAllUsers() {
    let headers = new Headers();
    this.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.url + '/v1/user/getAllUsers', {headers: headers})
    .map(res => res.json());
  }

  getUserById(id) {
    let headers = new Headers()
    this.loadToken()
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.url + '/v1/user/getUserById?id='+id, {headers: headers})
    .map(res => res.json())
  }

  addMultipleUsers(files: Array<File>) {
    var formData: any = new FormData();
    for(var i = 0; i < files.length; i++) {
      formData.append("uploads[]", files[i], files[i].name);
    }
    let headers = new Headers()
    this.loadToken()
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.url + '/v1/user/addMultipleUsers', formData, {headers: headers})
    .map(res => res.json());
  }

  updateUserInfo(userData) {
    let headers = new Headers()
    this.loadToken()
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.url + '/v1/user/updateUserInfo', userData, {headers: headers})
    .map(res => res.json());
  }
}
