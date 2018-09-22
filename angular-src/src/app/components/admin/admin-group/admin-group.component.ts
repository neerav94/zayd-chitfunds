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
  auctionDay: boolean = false;
  showNotification: boolean = false;
  loading: boolean = false;

  promiseGroupArray: Array<Object> = [];
  
  allGroups: any;
  allGroupsBackup: any;

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
        this.allGroups.sort(function(a,b) {
          if ( a.grp_name < b.grp_name )
              return -1;
          if ( a.grp_name > b.grp_name )
              return 1;
          return 0;
        });
        for(let i in this.allGroups) {
          let tempAmount = parseInt(this.allGroups[i]["chit_value"]) / parseInt(this.allGroups[i]["num_members"])
          this.allGroups[i]["amountEveryMonth"] = tempAmount.toLocaleString('en-IN', {useGrouping:true})
          this.allGroups[i]["chit_value"] = this.allGroups[i]["chit_value"].toLocaleString('en-IN', {useGrouping:true})
          this.promiseGroupArray.push(this.getTotalPendings(this.allGroups[i]));
        }
        this.allGroupsBackup = this.allGroups;
        Promise.all(this.promiseGroupArray).then(response => {}).catch(err => {
          console.log(err);
        })
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

  closeCreateGroup() {
    this.createGroupStatus = false;
    this.createGroupError = false;
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

    if(this.validationService.isNumberEmpty(groupInfo.auctionDate)) {
      this.auctionDay = true
    } else {
      this.auctionDay = false
    }

    if(!this.chitValue && !this.groupName && !this.numMonths && !this.auctionDay) {
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
              this.allGroups.sort(function(a,b) {
                if ( a.grp_name < b.grp_name )
                    return -1;
                if ( a.grp_name > b.grp_name )
                    return 1;
                return 0;
              });
              for(let i in this.allGroups) {
                let tempAmount = parseInt(this.allGroups[i]["chit_value"]) / parseInt(this.allGroups[i]["num_members"])
                this.allGroups[i]["amountEveryMonth"] = tempAmount.toLocaleString('en-IN', {useGrouping:true})
                this.allGroups[i]["chit_value"] = this.allGroups[i]["chit_value"].toLocaleString('en-IN', {useGrouping:true})
                this.promiseGroupArray.push(this.getTotalPendings(this.allGroups[i]));
              }
              this.allGroupsBackup = this.allGroups;
              Promise.all(this.promiseGroupArray).then(response => {}).catch(err => {
                console.log(err);
              })
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

  getTotalPendings(obj) {
    return new Promise((resolve, reject) => {
      this.loading = true;
      this.groupService.getActiveSubscribers(obj.grp_id).subscribe(data => {
        if (data.status) {
          let tempGroupData = data.message;
          let pendingAmount = 0;
          for(let i in tempGroupData) {
            pendingAmount += tempGroupData[i]["pending"];
            for(let j in this.allGroups) {
              if(this.allGroups[j]["grp_id"] == tempGroupData[i]["group_id"]) {
                this.allGroups[j]["pendingAmount"] = pendingAmount.toLocaleString('en-IN', {useGrouping:true});
              }
            }
          }
        } else {
          alert(data.message);
        }
        this.loading = false;
      })
    })
  }

  _searchGroup(value) {
    if (value) {
      let groupList = [];
      for (let i = 0; i < this.allGroupsBackup.length; i++) {
        let testableRegExp = new RegExp(this._regularExpression(value), "i");
        let tempString = this.allGroupsBackup[i]["grp_name"]
        if (tempString.match(testableRegExp)) {
          groupList.push(this.allGroupsBackup[i]);
        }
      }
      this.allGroups = groupList;
    } else {
      this.allGroups = this.allGroupsBackup;
    }
  }

  _regularExpression(input) {
    return input.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
  }

}
