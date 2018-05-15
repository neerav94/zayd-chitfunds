import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { GroupService } from '../../../../../services/group.service';

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

  numMonths = [];
  selectedMonth = "Manage Payment";
  selectedCycle = "Select Cycle";
  
  constructor(private router: Router, private route: ActivatedRoute, private groupService: GroupService) { }

  ngOnInit() {
    for(var i=1; i<=this.groupInfo[0].num_members; i++) {
      this.numMonths.push("Cycle " + i);
    }
    this.route.params.subscribe(params => {
      this.id = +params['id']; // (+) converts string 'id' to a number.
    });
  }

  changeSelectedMonth(event) {
    var value = event.value;
    value = value.split(':')[1].trim();
    value = value.split(' ')[1];
    this.router.navigate(['/v1/erpGroup/' + this.id + '/payments']);
  }

  changeSelectedCycle(event) {
    var value = event.value;
    value = value.split(':')[1].trim();
    this.prizedCycle = value;
  }

  submitSubscriberInfo() {
    var tokenNumber = document.getElementById("tokenNumber").value;
    if(this.prizedCycle == "") {
      alert("Please select cycle.");
    } 
    if(!tokenNumber) {
      alert("Please fill in the token number.");
    }
    var obj = {};
    obj["token"] = parseInt(tokenNumber);
    obj["cycle"] = this.prizedCycle;
    obj["group_id"] = this.id;
    this.loading = true;
    this.groupService.recordPrizedSubscriber(obj).subscribe(data => {
      if(data.status) {
        this.prizeCustomerStatus = false;
        // TODO: Make request for get all subscribers
      } else {
        alert(data.message);
      }
      this.loading = false;
    })
  }

  selectPrizeCustomer() {
    if(this.prizeCustomerStatus) {
      this.prizeCustomerStatus = false;
    } else {
      this.prizeCustomerStatus = true;
    }
  }

}
