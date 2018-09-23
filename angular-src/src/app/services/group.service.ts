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

  // get group by number
  getGroupByNumber(number) {
    let headers = new Headers()
    this.loadToken()
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.url + '/v1/group/getGroupByNumber?number=' + number, {headers: headers})
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

  startGroup(id) {
    let headers = new Headers()
    this.loadToken()
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.url + '/v1/group/startGroup?id=' + id, {headers: headers})
    .map(res => res.json())
  }

  closeGroup(id) {
    let headers = new Headers()
    this.loadToken()
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.url + '/v1/group/closeGroup?id=' + id, {headers: headers})
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

  substituteSubscriber(data) {
    let headers = new Headers()
    this.loadToken()
    headers.append('Authorization', this.authToken)
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.url + '/v1/group/substituteSubscriber', data, {headers: headers})
    .map(res => res.json())
  }

  removeUser(data) {
    let headers = new Headers()
    this.loadToken()
    headers.append('Authorization', this.authToken)
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.url + '/v1/group/removeUser', data, {headers: headers})
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

  recordPayment(paymentData) {
    let headers = new Headers()
    this.loadToken()
    headers.append('Authorization', this.authToken)
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.url + '/v1/group/recordPayment', paymentData, {headers: headers})
    .map(res => res.json())
  }

  recordPrizedSubscriber(data) {
    let headers = new Headers()
    this.loadToken()
    headers.append('Authorization', this.authToken)
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.url + '/v1/group/recordPrizedSubscriber', data, {headers: headers})
    .map(res => res.json())
  }

  paymentCollected(groupId) {
    let headers = new Headers()
    this.loadToken()
    headers.append('Authorization', this.authToken)
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.url + '/v1/group/getGroupPayment?groupId=' + groupId, {headers: headers})
    .map(res => res.json())
  }

  getDailyCollection() {
    let headers = new Headers();
    this.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.url + '/v1/group/getDailyCollection', {headers: headers})
    .map(res => res.json());
  }

  getWeeklyCollection() {
    let headers = new Headers();
    this.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.url + '/v1/group/getWeeklyCollection', {headers: headers})
    .map(res => res.json());
  }

  getUserDataReport() {
    let headers = new Headers();
    this.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.url + '/v1/group/getUserDataReport', {headers: headers})
    .map(res => res.json());
  }

  getSubstitutedSubscribersReport() {
    let headers = new Headers();
    this.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.url + '/v1/group/getSubstitutedSubscribersReport', {headers: headers})
    .map(res => res.json());
  }

  getCollectionReportData(startDate, endDate) {
    let headers = new Headers()
    this.loadToken()
    headers.append('Authorization', this.authToken)
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.url + '/v1/group/getCollectionReportData?startDate=' + startDate + '&endDate=' + endDate, {headers: headers})
    .map(res => res.json())
  }

  getActiveSubscribers(groupId) {
    let headers = new Headers()
    this.loadToken()
    headers.append('Authorization', this.authToken)
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.url + '/v1/group/getActiveSubscribers?groupId=' + groupId, {headers: headers})
    .map(res => res.json())
  }

  getUserSubscribedGroups(number) {
    let headers = new Headers()
    this.loadToken()
    headers.append('Authorization', this.authToken)
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.url + '/v1/group/getSubscribedGroups?number=' + number, {headers: headers})
    .map(res => res.json())
  }

  getUserSavings(groupId, token, active) {
    let headers = new Headers()
    this.loadToken()
    headers.append('Authorization', this.authToken)
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.url + '/v1/group/getUserSavings?groupId=' + groupId + '&token=' + token + '&active=' + active, {headers: headers})
    .map(res => res.json())
  }

  getSelfTransactions(groupId, token, active) {
    let headers = new Headers()
    this.loadToken()
    headers.append('Authorization', this.authToken)
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.url + '/v1/group/getSelfTransactions?groupId=' + groupId + '&token=' + token + '&active=' + active, {headers: headers})
    .map(res => res.json())
  }

  getUserPaymentDetails(tokenId, groupId) {
    let headers = new Headers()
    this.loadToken()
    headers.append('Authorization', this.authToken)
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.url + '/v1/group/getSubscriberPaymentDetails?groupId=' + groupId + '&tokenId=' + tokenId , {headers: headers})
    .map(res => res.json())
  }

  updateUserPayments(paymentData) {
    let headers = new Headers()
    this.loadToken()
    headers.append('Authorization', this.authToken)
    headers.append('Content-Type', 'application/json');
    return this.http.put(this.url + '/v1/group/updateUserPayments', paymentData, {headers: headers})
    .map(res => res.json())
  }
}
