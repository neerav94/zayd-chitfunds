import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { GroupService } from '../../../../../services/group.service';
import { ValidationService } from '../../../../../services/validation.service';

import { FileUploader } from 'ng2-file-upload';

@Component({
  selector: 'app-future-group-view',
  templateUrl: './future-group-view.component.html',
  styleUrls: ['./future-group-view.component.css', '../../../../../css/typography.css']
})
export class FutureGroupViewComponent implements OnInit {

  @Input() groupInfo;
  loading: boolean = false;
  openStartGroup: boolean = false;
  openAddMembers: boolean = false;
  openRemoveMembers: boolean = false;
  showNotification: boolean = false;
  subscribeUserError: boolean = false;
  removeUserError: boolean = false;
  
  subscribeUserErrorMessage: string = ""
  removeUserErrorMessage: string = ""
  notificationMessage: string = ""

  userContact: boolean = false;
  userName: boolean = false;
  userToken: boolean = false;
  removeUserToken: boolean = false;

  date: Date = new Date();
  startDate: any;
  subscribedUsers: any;

  uploader:FileUploader;

  numMonths = [];
  selectedMonth = "Manage Payments";
  id: number;

  activeSubscribers: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private groupService: GroupService,
    private validationService: ValidationService
  ) { }

  ngOnInit() {
    this.groupInfo[0].chit_amount = this.groupInfo[0].chit_value.toLocaleString('en-IN', {useGrouping:true})
    for (var i = 1; i <= this.groupInfo[0].num_members; i++) {
      this.numMonths.push("Installment " + i);
    }
    this.route.params.subscribe(params => {
      this.id = +params['id']; // (+) converts string 'id' to a number.
    });
    this.loading = true;
    this.loading = true;
    this.groupService.getActiveSubscribers(this.id).subscribe(data => {
      if (data.status) {
        this.activeSubscribers = data.message;
        for(let i=0;i<this.activeSubscribers.length; i++) {
          this.activeSubscribers[i].amount = this.activeSubscribers[i].amount.toLocaleString('en-IN', {useGrouping:true})
          this.activeSubscribers[i].advance = this.activeSubscribers[i].advance.toLocaleString('en-IN', {useGrouping:true})
          this.activeSubscribers[i].pending = this.activeSubscribers[i].pending.toLocaleString('en-IN', {useGrouping:true})
        }
      } else {
        alert(data.message);
      }
      this.loading = false;
    })
    // this.groupService.getAllSubscribers(this.groupInfo[0].grp_id).subscribe(data => {
    //   if(data.status) {
    //     this.subscribedUsers = data.message
    //   } else {
    //     alert("Some error occurred. Please refresh the page and try again.")
    //   }
    //   this.loading = false;
    // })

    this.uploader = new FileUploader({url: this.groupService.url + "/v1/group/subscribeUsers", itemAlias: 'subscriberData', authToken: this.groupService.authToken});

    //override the onAfterAddingfile property of the uploader so it doesn't authenticate with //credentials.
    this.uploader.onAfterAddingFile = (file)=> { 
      // this.loading = true;
      file.withCredentials = false; 
    };
    //overide the onCompleteItem property of the uploader so we are 
    //able to deal with the server response.
    // this.loading = true;
    this.uploader.onCompleteItem = (item:any, response:any, status:any, headers:any) => {
      response = JSON.parse(response)
      if(!response.status) {
        alert(response.message)
        this.openAddMembers = true;
      } else {
        this.openAddMembers = false;
        this.notificationMessage = "You have successfully added users."
        this.groupService.getActiveSubscribers(this.id).subscribe(data => {
          if (data.status) {
            this.activeSubscribers = data.message;
            for(let i=0;i<this.activeSubscribers.length; i++) {
              this.activeSubscribers[i].amount = this.activeSubscribers[i].amount.toLocaleString('en-IN', {useGrouping:true})
              this.activeSubscribers[i].advance = this.activeSubscribers[i].advance.toLocaleString('en-IN', {useGrouping:true})
              this.activeSubscribers[i].pending = this.activeSubscribers[i].pending.toLocaleString('en-IN', {useGrouping:true})
            }
          } else {
            alert(data.message);
          }
          this.loading = false;
        })
      }
    }
  }

  changeSelectedMonth(event) {
    var value = event.value;
    value = value.split(':')[1].trim();
    value = value.split(' ')[1];
    this.router.navigate(['/v1/erpGroup/' + this.id + '/payments']);
  }

  // function called when on start date is selected
  onStartDateSelect(startDate) {
    this.startDate = new Date(startDate.value).getTime()
    var confirm = window.confirm("Are you sure you want to submit the selected dates?");
    if (confirm == true) {
        this.openStartGroup = true
        this.submitDate()
    } else {
        this.openStartGroup = false;
    }
  }

  // function called when done button is clicked in the date dialog
  submitDate() {
    if(!this.startDate) {
      alert("Please select Start date and time.")
    } else {
      this.openStartGroup = false;
      let date = {}
      date["id"] = this.groupInfo[0].grp_id
      date["start"] = this.startDate
      this.loading = true;
      this.groupService.setStartDate(date).subscribe(data => {
        if(data.status) {

        } else {
          alert(data.message)
        }
        this.loading = false;
      })
    }
  }

  // function called to subscribe users to the group
  subscribeUsers(userInfo: any):void {
    if(this.validationService.isNumberEmpty(userInfo.contact)) {
      this.userContact = true
    } else {
      this.userContact = false
    }

    if(this.validationService.isNumberEmpty(userInfo.token)) {
      this.userToken = true
    } else {
      this.userToken = false
    }

    if(this.validationService.isNameEmpty(userInfo.name)) {
      this.userName = true
    } else {
      this.userName = false
    }

    if(!this.userContact && !this.userName && !this.userToken) {
      this.loading = true;
      userInfo["groupId"] = this.groupInfo[0].grp_id;
      userInfo["groupName"] = this.groupInfo[0].grp_name;
      this.groupService.subscribeUser(userInfo).subscribe(data => {
        if(data.status) {
          this.subscribeUserError = false;
          this.openAddMembers = false;
          this.showNotification = true;
          this.notificationMessage = "Successfully subscribed a user."
          setTimeout(() => {
            this.showNotification = false;
          },5000);
          this.groupService.getActiveSubscribers(this.id).subscribe(data => {
            if (data.status) {
              this.activeSubscribers = data.message;
              for(let i=0;i<this.activeSubscribers.length; i++) {
                this.activeSubscribers[i].amount = this.activeSubscribers[i].amount.toLocaleString('en-IN', {useGrouping:true})
                this.activeSubscribers[i].advance = this.activeSubscribers[i].advance.toLocaleString('en-IN', {useGrouping:true})
                this.activeSubscribers[i].pending = this.activeSubscribers[i].pending.toLocaleString('en-IN', {useGrouping:true})
              }
            } else {
              alert(data.message);
            }
            this.loading = false;
          })
        } else {
          this.subscribeUserError = true;
          this.subscribeUserErrorMessage = data.message
        } 
        this.loading = false;
      })
    }
  }

  //function called to remove subscribed user
  removeUsers(tokenInfo): void {
    if(this.validationService.isNumberEmpty(tokenInfo.token)) {
      this.removeUserToken = true
    } else {
      this.removeUserToken = false
    }
    if(!this.removeUserToken) {
      this.loading = true;
      tokenInfo["groupId"] = this.groupInfo[0].grp_id;
      tokenInfo["groupName"] = this.groupInfo[0].grp_name;
      this.groupService.removeUser(tokenInfo).subscribe(data => {
        if(data.status) {
          this.removeUserError = false;
          this.openRemoveMembers = false;
          this.showNotification = true;
          this.notificationMessage = "Successfully removed a user."
          setTimeout(() => {
            this.showNotification = false;
          },5000);
          this.groupService.getActiveSubscribers(this.id).subscribe(data => {
            if (data.status) {
              this.activeSubscribers = data.message;
              for(let i=0;i<this.activeSubscribers.length; i++) {
                this.activeSubscribers[i].amount = this.activeSubscribers[i].amount.toLocaleString('en-IN', {useGrouping:true})
                this.activeSubscribers[i].advance = this.activeSubscribers[i].advance.toLocaleString('en-IN', {useGrouping:true})
                this.activeSubscribers[i].pending = this.activeSubscribers[i].pending.toLocaleString('en-IN', {useGrouping:true})
              }
            } else {
              alert(data.message);
            }
            this.loading = false;
          })
        } else {
          this.removeUserError = true;
          this.removeUserErrorMessage = data.message
        } 
        this.loading = false;
      })
    }
  }

  startGroup() {
    var confirm = window.confirm("Are you sure you want to start the group?")
    if(confirm) {
      this.loading = true;
      this.groupService.startGroup(this.id).subscribe(data => {
        if(data.status) {
          alert(data.message);
        } else {
          alert(data.message);
        }
        this.loading = false;
      })
    }
  }

  selectDate() {
    this.openStartGroup = true;
  }

  closeStartGroup() {
    this.openStartGroup = false;
  }

  addMembers() {
    this.openAddMembers = true;
  }

  removeMembers() {
    this.openRemoveMembers = true;
  }

  closeAddMembers() {
    this.openAddMembers = false;
  }

  closeRemoveMembers() {
    this.openRemoveMembers = false;
  }

  // function called when cancel button is clicked in the date dialog
  cancelDate() {
    this.openStartGroup = false;
  }

  goToHome() {
    this.router.navigate(['/v1/erpHome/']);
  }

}
