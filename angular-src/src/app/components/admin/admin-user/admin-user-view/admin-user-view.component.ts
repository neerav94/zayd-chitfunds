import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { UserService } from '../../../../services/user.service';

@Component({
  selector: 'app-admin-user-view',
  templateUrl: './admin-user-view.component.html',
  styleUrls: ['./admin-user-view.component.css', '../../../../css/typography.css']
})
export class AdminUserViewComponent implements OnInit {

  loading: boolean = false;
  activeView: boolean = false;
  id: number;
  
  gender;
  occupation;
  name: string = '';
  fatherName: string = '';
  age: string = '';
  dob: string = '';
  pan: string = '';
  aadhar: string = '';
  number: string = '';
  otherNumber: string = '';
  email: string = '';
  dependents: string = '';
  business: string = '';
  nominee: string = '';
  resAddress: string = '';
  officeAddress: string = '';
  income: string = '';
  firstReference: string = '';
  secondReference: string = '';

  userInfo: any;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService
  ) {
    this.gender = [
      {name:'Male', value:'Male', checked:false},
      {name:'Female', value:'Female', checked:false}
     ];
     this.occupation = [
      {name:'Businessman', value:'Businessman', checked:false},
      {name:'Self Employed', value:'Self Employed', checked:false},
      {name:'Housewife', value:'Housewife', checked:false},
      {name:'Salaried', value:'Salaried', checked:false}
     ]
   }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = +params['id']; // (+) converts string 'id' to a number.
    });
    this.loading = true;
    this.userService.getUserById(this.id).subscribe(data => {
      if(data.status) {
        this.userInfo = data.message
        this.activeView = true;
        this.name = this.userInfo[0].name
        this.number = this.userInfo[0].number
        this.email = this.userInfo[0].email
        this.fatherName = this.userInfo[0].father_husband_name
        this.dob = this.userInfo[0].dob;
        this.age = this.userInfo[0].age;
        this.otherNumber = this.userInfo[0].other_number
        this.resAddress = this.userInfo[0].residential_address
        this.pan = this.userInfo[0].pan
        this.aadhar = this.userInfo[0].aadhar
        this.nominee = this.userInfo[0].nominee
        this.dependents = this.userInfo[0].dependents
        this.business = this.userInfo[0].business_name
        this.officeAddress = this.userInfo[0].office_address
        this.income = this.userInfo[0].income
        this.firstReference = this.userInfo[0].first_reference
        this.secondReference = this.userInfo[0].second_reference
      } else {
        this.activeView = false;
        alert("Some error occurred. Please try again.")
      }
      this.loading = false;
    }, err => {
      this.loading = false;
      alert("Some error occurred. Please try again.")
    })
  }

  submitUserInfo(userInfo) {
    var gender = this.gender.filter(opt => opt.checked).map(opt => opt.value);
    var occupation = this.occupation.filter(opt => opt.checked).map(opt => opt.value);
    var genderStatus = false;
    var occupationStatus = false;
    userInfo["id"] = this.id;
    if(gender.length == 2) {
      alert("Please select one gender");
      genderStatus = false;
    } else if(gender.length == 1) {
      userInfo["gender"] = gender[0]
      genderStatus = true;
    } else if(gender.length == 0) {
      userInfo["gender"] = ''
      genderStatus = true;
    }

    if(occupation.length == 0) {
      userInfo["occupation"] = ''
      occupationStatus = true;
    } else if(occupation.length == 1) {
      userInfo["occupation"] = occupation[0]
      occupationStatus = true;
    } else if(occupation.length > 0) {
      alert("Please select one occupation");
      occupationStatus = false;
    }
    if(genderStatus && occupationStatus) {
      this.loading = true;
      this.userService.updateUserInfo(userInfo).subscribe(data => {
        if(data.status) {
          alert("User info successfully updated.");
        } else {
          alert(data.message);
        }
        this.loading = false;
        this.ngOnInit()
      })
    }
  }
}
