import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { tokenNotExpired } from 'angular2-jwt';

@Injectable()
export class GroupService {

  url: string = "http://localhost:3000"
  authToken: any;

  constructor(
    private http: Http
  ) { }

  // function to load the token
  loadToken() {
    const token = localStorage.getItem('token')
    this.authToken = token;
  }

  // Create new group
  createGroup(group) {
    let headers = new Headers();
    this.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.url + '/v1/group/createGroup', group, {headers: headers})
    .map(res => res.json());
  }

  // Get all groups
  getAllGroups() {
    let headers = new Headers();
    this.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.url + '/v1/group/getAllGroups', {headers: headers})
    .map(res => res.json());
  }

  // get group by id
  getGroupById(id) {
    let headers = new Headers()
    this.loadToken()
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.url + '/v1/group/getGroupById?id='+id, {headers: headers})
    .map(res => res.json())
  }

  // Set dates to start the group
  setStartDate(data) {
    let headers = new Headers();
    this.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.url + '/v1/group/setDate', data, {headers: headers})
    .map(res => res.json())
  }

  subscribeUser(data) {
    let headers = new Headers()
    this.loadToken()
    headers.append('Authorization', this.authToken)
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.url + '/v1/group/subscribeUser', data, {headers: headers})
    .map(res => res.json())
  }

  getAllSubscribers(groupId) {
    let headers = new Headers()
    this.loadToken()
    headers.append('Authorization', this.authToken)
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.url + '/v1/group/getAllSubscribers?groupId=' + groupId, {headers: headers})
    .map(res => res.json())
  }
}
