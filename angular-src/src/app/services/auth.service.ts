import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { tokenNotExpired } from 'angular2-jwt';

@Injectable()
export class AuthService {

  authToken: any;
  user: any;
  url: string = ""

  constructor( private http: Http ) { }

  // Register normal user
  registerUser(user) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.url + '/v1/login/users/register', user, {headers: headers})
    .map(res => res.json());
  }

  // Register admin user
  registerAdmin(admin) {
    let headers = new Headers();
    this.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.url + '/v1/login/admin/adminRegister', admin, {headers: headers})
    .map(res => res.json());
  }

  // Register super admin user
  registerSuperAdmin(admin) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.url + '/v1/login/admin/superAdminRegister', admin, {headers: headers})
    .map(res => res.json());
  }

  getAdmins() {
    let headers = new Headers();
    this.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.url + '/v1/login/admin/getAdmins', {headers: headers})
    .map(res => res.json());
  }

  updatePassword(passwordObj) {
    let headers = new Headers();
    this.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.url + '/v1/login/admin/updatePassword', passwordObj, {headers: headers})
    .map(res => res.json());
  }

  updateNumber(numberObj) {
    let headers = new Headers();
    this.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.url + '/v1/login/admin/updateNumber', numberObj, {headers: headers})
    .map(res => res.json());
  }

  forgotPassword(userObj) {
    let headers = new Headers();
    this.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.url + '/v1/login/admin/forgotPassword', userObj, {headers: headers})
    .map(res => res.json());
  }

  deleteAdmin(id) {
    let headers = new Headers();
    this.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.url + '/v1/login/admin/deleteAdmin?id=' + id, {headers: headers})
    .map(res => res.json());
  }

  // login user
  login(user) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.url + '/v1/login/users/authenticate', user, {headers: headers})
    .map(res => res.json());
  }

  //logout user
  logOut() {
    this.authToken = null;
    this.user = null;
    localStorage.clear();
  }

  // store user info
  storeUserData(token, user) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.authToken = token;
    this.user = user;
  }

  // home page authentication request
  usersHomePage() {
    let headers = new Headers();
    this.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.url + '/v1/login/users/home', {headers: headers})
    .map(res => res.json());
  }

  // function to load the token
  loadToken() {
    const token = localStorage.getItem('token')
    this.authToken = token;
  }

  // function to check if user is logged in
  loggedIn() {
    return tokenNotExpired();
  }
}
