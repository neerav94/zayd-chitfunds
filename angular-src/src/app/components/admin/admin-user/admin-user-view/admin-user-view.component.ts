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
  genderStatus: string = '';
  age: string = '';
  dob: string = '';
  pan: string = '';
  aadhar: string = '';
  number: string = '';
  occupationStatus: string = '';
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
        for(let i in this.occupation) {
          if(this.occupation[i]["value"] == this.userInfo[0]["occupation"]) {
            this.occupation[i]["checked"] = true;
            break;
          }
        }
        for(let i in this.gender) {
          if(this.gender[i]["value"] == this.userInfo[0]["gender"]) {
            this.gender[i]["checked"] = true;
          }
        }
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

  changeGender(i) {
    this.genderStatus = this.gender[i].value;
  }

  changeOccupation(i) {
    this.occupationStatus = this.occupation[i].value;
  }

  submitUserInfo(userInfo) {
    userInfo["id"] = this.id;
    if(this.genderStatus) {
      userInfo["gender"] = this.genderStatus;
    } else {
      userInfo["gender"] = this.userInfo[0]["gender"];
    }
    if(this.occupationStatus) {
      userInfo["occupation"] = this.occupationStatus;
    } else {
      userInfo["occupation"] = this.userInfo[0]["occupation"];
    }
    
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
