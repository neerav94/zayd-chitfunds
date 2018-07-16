import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { GroupService } from '../../../services/group.service';

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.css', '../../../css/typography.css']
})
export class AdminHomeComponent implements OnInit {

  loading: boolean = false;
  numUsers: number = 0;
  numGroups: number = 0;
  paymentCollected: number = 0;
  aggregateAmount: string = '';
  dailyCollection: string = '';
  weeklyCollection: string = '';

  constructor(private userService: UserService, private groupService: GroupService) { }

  ngOnInit() {
    document.getElementById("homeView").classList.add("current");
    document.getElementById("userView").classList.remove("current");
    document.getElementById("groupView").classList.remove("current");
    document.getElementById("profileView").classList.remove("current");

    this.loading = true;
    this.userService.getAllUsers().subscribe(data => {
      if(data.status) {
        this.numUsers = data.message.length;
      } else {
        alert(data.message)
      }
      this.loading = false;
    })

    this.loading = true;
    this.groupService.getAllGroups().subscribe(data => {
      if(data.status) {
        let tempGroups = data.message;
        let groupsArray = [];
        for(let i=0; i<tempGroups.length; i++) {
          let diff = tempGroups[i].num_members - tempGroups[i].months
          if(diff >= 0) {
            groupsArray.push(tempGroups[i]);
          }
        }
        var promises = []
        for (var i = 0; i < groupsArray.length; i++) {
          promises.push(this.countGroups(groupsArray[i]))
          promises.push(this.aggregatePayment(groupsArray[i]))
        }
        this.loading = false;
        Promise.all(promises).then(response => {
          this.aggregateAmount = this.paymentCollected.toLocaleString('en', {useGrouping:true})
        })
      }
    })

    this.loading = true;
    this.groupService.getDailyCollection().subscribe(data => {
      if(data.status) {
        if(data.message) {
          this.dailyCollection = data.message.toLocaleString('en', {useGrouping:true})
        } else {
          this.dailyCollection = '0';
        }
      } else {
        alert(data.message)
      }
      this.loading = false;
    })

    this.loading = true;
    this.groupService.getWeeklyCollection().subscribe(data => {
      if(data.status) {
        if(data.message) {
          this.weeklyCollection = data.message.toLocaleString('en', {useGrouping:true})
        } else {
          this.weeklyCollection = '0';
        }
      } else {
        alert(data.message)
      }
      this.loading = false;
    })
  }

  countGroups(obj) {
    console.log(obj);
    return new Promise((resolve, reject) => {
      this.loading = true;
      this.groupService.getGroupById(obj.grp_id).subscribe(data => {
        if(data.status) {
          let groupInfo = data.message
          if(groupInfo[0].start_date) {
            this.groupService.getAllSubscribers(groupInfo[0].grp_id).subscribe(data => {
              if(data.message.length >= groupInfo[0].num_members) {
                this.numGroups += 1;
                resolve(true);
              } else {
                reject(false);
              }
            })
          } else {
            reject(false);
          }
        } else {
          alert("Some error occurred. Please try again.")
          reject(false);
        }
        this.loading = false;
      }, err => {
        this.loading = false;
        alert("Some error occurred. Please try again.")
      })
    })
  }

  aggregatePayment(obj) {
    return new Promise((resolve, reject) => {
      this.loading = true;
      this.groupService.paymentCollected(obj.grp_id).subscribe(data => {
        if (data.status) {
          if(data.message) {
            this.paymentCollected += parseInt(data.message);
            resolve(true);
          }
        } else {
          alert(data.message);
          reject(false);
        }
        this.loading = false;
      })
    })
  }
}
