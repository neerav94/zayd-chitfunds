import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { GroupService } from '../../../services/group.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-home',
  templateUrl: './user-home.component.html',
  styleUrls: ['./user-home.component.css', '../../../css/typography.css']
})
export class UserHomeComponent implements OnInit {

  user: Object;
  userGroupIds;
  userGroups;
  loading: boolean = false;

  userGroupsObject: Object;
  promiseArray: Array<any> = []; 
  promiseGroupArray: Array<object> = [];

  pendingAmount: number = 0;

  userPrizedMoney: string = '';
  userSavings: string = '';
  userPendingAmount: string = '';
  userSavingsAmount: number = 0;

  selfTransactionsData: Array<object> = [];

  constructor(
    private authService: AuthService,
    private groupService: GroupService,
    private router: Router
  ) {}

  ngOnInit() {
    document.getElementById("userHomeView").classList.add("current");
    document.getElementById("userProfileView").classList.remove("current");
    this.loading = true;
    this.authService.usersHomePage().subscribe(home => {
      if(home.status) {
        this.user = home.user;
        this.groupService.getGroupByNumber(this.user[0].number).subscribe(data => {
          if(data.status) {
            this.userGroupIds = data.message
            this.groupService.getAllGroups().subscribe(groupData => {
              if(groupData.status) {
                this.userGroups = [];
                this.userGroupsObject = {};
                let tempGroups = groupData.message
                for(let i=0; i<tempGroups.length; i++) {
                  if(this.userGroupIds.indexOf(tempGroups[i].grp_id) > -1) {
                    this.userGroupsObject[tempGroups[i].grp_id] = tempGroups[i];
                    this.userGroups.push(tempGroups[i])
                  }
                }
                // calculating prized money/savings of the user
                this.loading = true;
                this.groupService.getUserSubscribedGroups(this.user[0].number).subscribe(data => {
                  if(data.status) {
                    let tempData = data.message;
                    this.selfTransactionsData = tempData;
                    let amount = 0;
                    for(let i=0; i<tempData.length; i++) {
                      this.promiseArray.push(this.getTotalSavings(tempData[i]));
                      if(tempData[i].prized_cycle) {
                        amount += 0.95 * this.userGroupsObject[tempData[i].group_id].chit_value;
                      }
                    }
                    this.userPrizedMoney = amount.toLocaleString('en-IN', {useGrouping:true});
                    Promise.all(this.promiseArray).then(response => {}).catch(err => {
                      alert(err);
                    })
                    for(let i in tempData) {
                      this.promiseGroupArray.push(this.getTotalPendings(tempData[i]));
                    }
                    Promise.all(this.promiseGroupArray).then(response => {}).catch(err => {
                      console.log(err);
                    })
                    this.loading = false;
                  } else {
                    this.loading = false;
                    alert(data.message);
                  }
                })
              } else {
                alert(data.message)
              }
            })
          } else {
            alert(data.message);
          }
          this.loading = false;
        });
      } else {
        this.router.navigate(['/v1/error']);
      }
    },
    err => {
      return false;
    })
  }

  getTotalSavings(obj) {
    return new Promise((resolve, reject) => {
      this.loading = true;
      this.groupService.getUserSavings(obj.group_id, obj.token, obj.active).subscribe(data => {
        if(data.status) {
          this.userSavingsAmount += data.message;
          this.userSavings = this.userSavingsAmount.toLocaleString('en-IN', {useGrouping:true});
          this.loading = false;
          resolve(true);
        } else {
          this.loading = false;
          alert(data.message);
          reject(false);
        }
      })
    })
  }

  getTotalPendings(obj) {
    return new Promise((resolve, reject) => {
      this.loading = true;
      this.groupService.getActiveSubscribers(obj.group_id).subscribe(data => {
        if (data.status) {
          let tempGroupData = data.message;
          for(let i in tempGroupData) {
            if(tempGroupData[i]["number"] == this.user[0].number) {
              this.pendingAmount += tempGroupData[i]["pending"];
            }
            for(let j in this.userGroups) {
              if(this.userGroups[j]["grp_id"] == tempGroupData[i]["group_id"]) {
                this.userGroups[j]["pendingAmount"] = tempGroupData[i]["pending"].toLocaleString('en-IN', {useGrouping:true});
              }
            }
          }
          this.userPendingAmount = this.pendingAmount.toLocaleString('en-IN', {useGrouping:true});
        } else {
          alert(data.message);
        }
        this.loading = false;
      })
    })
  }

}
