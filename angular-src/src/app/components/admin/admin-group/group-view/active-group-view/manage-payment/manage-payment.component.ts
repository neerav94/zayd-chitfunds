import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { GroupService } from '../../../../../../services/group.service';

@Component({
  selector: 'app-manage-payment',
  templateUrl: './manage-payment.component.html',
  styleUrls: ['./manage-payment.component.css', '../../../../../../css/typography.css']
})
export class ManagePaymentComponent implements OnInit {

  loading: boolean = false;
  id: number;

  managePayment: Array<Object> = [];
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private groupService: GroupService
  ) { }

  ngOnInit() {
    this.getMembers().then(data => {
      for(var i in data) {
        this.createData(data[i]);
      }
    })
    .catch(err => {
      alert(err);
    })
  }

  getMembers() {
    // var managePayment: any
    return new Promise((resolve, reject) => {
      this.route.params.subscribe(params => {
        this.id = +params['id']; // (+) converts string 'id' to a number.
      });
      this.loading = true;
      this.groupService.getAllSubscribers(this.id).subscribe(data => {
        if(data.status) {
          resolve(data.message);
        } else {
          reject(data.message);
        }
        this.loading = false;
      })
    })
  }

  createData(item) {
    let obj = {};
    obj["token"] = item.token;
    obj["group_id"] = this.id;
    obj["amount"] = 0;
    obj["payment_mode"] = "Cash";
    obj["payment_comment"] = "";
    obj["payment_date"] = new Date().getTime();
    this.managePayment.push(obj);
  }

  saveData(e) {
    let tempData = [];
    for(var i=0; i<this.managePayment.length; i++) {
      if(this.managePayment[i]["amount"] !== 0) {
        tempData.push(this.managePayment[i])
      }
    }
    this.groupService.recordPayment(tempData).subscribe(data => {
      if(data.status) {
        this.router.navigate(['/v1/erpGroup/' + this.id]);
      } else {
        alert(data.message);
      }
    })
  }
}
