import { Component, OnInit } from '@angular/core';
import { ValidationService } from '../../../services/validation.service';
import { GroupService } from '../../../services/group.service';

@Component({
  selector: 'app-admin-group',
  templateUrl: './admin-group.component.html',
  styleUrls: ['./admin-group.component.css', '../../../css/typography.css']
})
export class AdminGroupComponent implements OnInit {

  createGroupStatus: boolean = false;
  createGroupError: boolean = false;

  createGroupErrorMessage: string = "";

  groupName: boolean = false;
  chitValue: boolean = false;
  numMonths: boolean = false;
  showNotification: boolean = false;
  loading: boolean = false;

  allGroups: any;

  constructor(
    private validationService: ValidationService,
    private groupService: GroupService
  ) { }

  ngOnInit() {
    document.getElementById("homeView").classList.remove("current");
    document.getElementById("userView").classList.remove("current");
    document.getElementById("groupView").classList.add("current");
    document.getElementById("profileView").classList.remove("current");

    this.loading = true;
    this.groupService.getAllGroups().subscribe(data => {
      if(data.status) {
        this.allGroups = data.message;
      } else {
        alert(data.message)
      }
      this.loading = false;
    })
  }

  //function called to open the dialog to create a group
  createGroup():void {
    if(this.createGroupStatus) {
      this.createGroupStatus = false;
      this.createGroupError = false;
    } else {
      this.createGroupStatus = true;
    }
  }

  // function called when a user clicks on submit group info button
  submitGroupInfo(groupInfo: any):void {
    if(this.validationService.isNumberEmpty(groupInfo.chitValue)) {
      this.chitValue = true
    } else {
      this.chitValue = false
    }

    if(this.validationService.isNameEmpty(groupInfo.name)) {
      this.groupName = true
    } else {
      this.groupName = false
    }

    if(this.validationService.isNumberEmpty(groupInfo.months)) {
      this.numMonths = true
    } else {
      this.numMonths = false
    }

    if(!this.chitValue && !this.groupName && !this.numMonths) {
      if(groupInfo.status == "") {
        groupInfo.status = false;
      }
      this.loading = true;
      this.groupService.createGroup(groupInfo).subscribe(data => {
        if(data.status) {
          this.loading = false;
          this.createGroupStatus = false;
          this.createGroupError = false;  
          this.showNotification = true;
          setTimeout(() => {
            this.showNotification = false;
          },5000);
          this.groupService.getAllGroups().subscribe(data => {
            if(data.status) {
              this.allGroups = data.message;
            } else {
              alert(data.message)
            }
          })
        } else {
          this.loading = false;
          this.createGroupError = true;
          this.createGroupErrorMessage = data.message
        }
      })
    }
  }
}
