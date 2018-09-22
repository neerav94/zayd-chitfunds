import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { GroupService } from '../../../../../services/group.service';
import { ValidationService } from '../../../../../services/validation.service';

@Component({
  selector: 'app-active-group-view',
  templateUrl: './active-group-view.component.html',
  styleUrls: ['./active-group-view.component.css', '../../../../../css/typography.css']
})
export class ActiveGroupViewComponent implements OnInit {

  @Input() groupInfo;
  loading: boolean = false;
  prizeCustomerStatus: boolean = false;
  prizedCycle: string = "";

  id: number;
  paymentCollected: number;

  numMonths = [];
  numDraws = [];
  selectedMonth = "Manage Payments";
  selectedCycle = "Select Draw";

  activeSubscribers: any;

  showSubstitueForm: boolean = false;
  substituteSubscriberToken: boolean = false;
  substituteSubscriberNumber: boolean = false;
  substituteSubscriberName: boolean = false;
  substituteSubscriberMonths1: boolean = false;
  substituteSubscriberMonths2: boolean = false;

  constructor(private router: Router, private route: ActivatedRoute, private groupService: GroupService, private validationService: ValidationService) {}

  ngOnInit() {
    this.groupInfo[0].chit_amount = this.groupInfo[0].chit_value.toLocaleString('en', {useGrouping:true})
    if(this.groupInfo[0].months > this.groupInfo[0].num_members) {
      this.groupInfo[0].months = this.groupInfo[0].num_members;
      this.groupInfo[0]["installments"] = 0;
    } else {
      this.groupInfo[0]["installments"] = this.groupInfo[0].num_members - this.groupInfo[0].months
    }
    for (var i = 1; i <= this.groupInfo[0].num_members; i++) {
      this.numMonths.push("Installment " + i);
    }
    for (var i = 1; i <= this.groupInfo[0].num_members; i++) {
      this.numDraws.push("Draw " + i);
    }
    this.route.params.subscribe(params => {
      this.id = +params['id']; // (+) converts string 'id' to a number.
    });
    this.loading = true;
    this.groupService.paymentCollected(this.id).subscribe(data => {
      if (data.status) {
        if(data.message) {
          this.paymentCollected = parseInt(data.message);
        } else {
          this.paymentCollected = 0;
        }
      } else {
        alert(data.message);
      }
      this.loading = false;
    })
    this.loading = true;
    this.groupService.getActiveSubscribers(this.id).subscribe(data => {
      if (data.status) {
        this.activeSubscribers = data.message;
        for(let i=0;i<this.activeSubscribers.length; i++) {
          this.activeSubscribers[i].amount = this.activeSubscribers[i].amount.toLocaleString('en', {useGrouping:true})
          this.activeSubscribers[i].advance = this.activeSubscribers[i].advance.toLocaleString('en', {useGrouping:true})
          this.activeSubscribers[i].pending = this.activeSubscribers[i].pending.toLocaleString('en', {useGrouping:true})
        }
      } else {
        alert(data.message);
      }
      this.loading = false;
    })
  }

  changeSelectedMonth(event) {
    var value = event.value;
    value = value.split(':')[1].trim();
    value = value.split(' ')[1];
    console.log(value);
    this.router.navigate(['/v1/erpGroup/' + this.id + '/payments', {num: value}]);
  }

  changeSelectedCycle(event) {
    var value = event.value;
    value = value.split(':')[1].trim();
    this.prizedCycle = value;
  }

  submitSubscriberInfo() {
    var tokenNumber = (<HTMLInputElement>document.getElementById("tokenNumber")).value;
    if (this.prizedCycle == "") {
      alert("Please select cycle.");
    }
    if (!tokenNumber) {
      alert("Please fill in the token number.");
    }
    var obj = {};
    obj["token"] = parseInt(tokenNumber);
    obj["cycle"] = this.prizedCycle;
    obj["group_id"] = this.id;
    this.loading = true;
    this.groupService.recordPrizedSubscriber(obj).subscribe(data => {
      if (data.status) {
        this.prizeCustomerStatus = false;
        this.loading = true;
        this.groupService.getActiveSubscribers(this.id).subscribe(data => {
          if (data.status) {
            this.activeSubscribers = data.message;
            for(let i=0;i<this.activeSubscribers.length; i++) {
              this.activeSubscribers[i].amount = this.activeSubscribers[i].amount.toLocaleString('en', {useGrouping:true})
              this.activeSubscribers[i].advance = this.activeSubscribers[i].advance.toLocaleString('en', {useGrouping:true})
              this.activeSubscribers[i].pending = this.activeSubscribers[i].pending.toLocaleString('en', {useGrouping:true})
            }
          } else {
            alert(data.message);
          }
          this.loading = false;
        })
      } else {
        alert(data.message);
      }
      this.loading = false;
    })
  }

  selectPrizeCustomer() {
    if (this.prizeCustomerStatus) {
      this.prizeCustomerStatus = false;
    } else {
      this.prizeCustomerStatus = true;
    }
  }

  substituteSubscribers(userInfo) {
    if(this.validationService.isNumberEmpty(userInfo.number)) {
      this.substituteSubscriberNumber = true
    } else {
      this.substituteSubscriberNumber = false
    }
    if(this.validationService.isNumberEmpty(userInfo.token)) {
      this.substituteSubscriberToken = true;
    } else {
      this.substituteSubscriberToken = false;
    }
    if(this.validationService.isNameEmpty(userInfo.name)) {
      this.substituteSubscriberName = true;
    } else {
      this.substituteSubscriberName = false;
    }
    if(this.validationService.isNameEmpty(userInfo.monthsOver)) {
      this.substituteSubscriberMonths1 = true;
    } else {
      this.substituteSubscriberMonths1 = false;
    }
    if(this.validationService.isNameEmpty(userInfo.monthsRemaining)) {
      this.substituteSubscriberMonths2 = true;
    } else {
      this.substituteSubscriberMonths2 = false;
    }

    if(!this.substituteSubscriberToken && !this.substituteSubscriberNumber && !this.substituteSubscriberName && !this.substituteSubscriberMonths1 && !this.substituteSubscriberMonths2) {
      userInfo["groupId"] = this.id
      userInfo["groupName"] = this.groupInfo[0].grp_name
      this.loading = true;
      this.groupService.substituteSubscriber(userInfo).subscribe(data => {
        if(data.status) {
          this.loading = true;
          this.groupService.getActiveSubscribers(this.id).subscribe(data => {
            if (data.status) {
              this.activeSubscribers = data.message;
              for(let i=0;i<this.activeSubscribers.length; i++) {
                this.activeSubscribers[i].amount = this.activeSubscribers[i].amount.toLocaleString('en', {useGrouping:true})
                this.activeSubscribers[i].advance = this.activeSubscribers[i].advance.toLocaleString('en', {useGrouping:true})
                this.activeSubscribers[i].pending = this.activeSubscribers[i].pending.toLocaleString('en', {useGrouping:true})
              }
            } else {
              alert(data.message);
            }
            this.loading = false;
          })
        } else {
          alert(data.message)
        }
        this.loading = false;
        this.closeSubstituteSubscriber();
      })
    }
  }

  substituteSubscriber() {
    this.showSubstitueForm = true;
  }

  closeSubstituteSubscriber() {
    this.showSubstitueForm = false;
  }

  goToHome() {
    this.router.navigate(['/v1/erpHome/']);
  }

}
