import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { tokenNotExpired } from 'angular2-jwt';

@Injectable()
export class AuthService {

  authToken: any;
  user: any;

  constructor( private http: Http ) { }

  // Register normal user
  registerUser(user) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:3000/v1/users/register', user, {headers: headers})
    .map(res => res.json());
  }

  // Register admin user
  registerAdmin(admin) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:3000/v1/admin/adminRegister', admin, {headers: headers})
    .map(res => res.json());
  }

  // Register super admin user
  registerSuperAdmin(admin) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:3000/v1/admin/superAdminRegister', admin, {headers: headers})
    .map(res => res.json());
  }

  // login user
  login(user) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:3000/v1/users/authenticate', user, {headers: headers})
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
    return this.http.get('http://localhost:3000/v1/users/home', {headers: headers})
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
