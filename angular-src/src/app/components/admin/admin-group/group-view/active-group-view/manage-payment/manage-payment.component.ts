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
  installmentNum: number;
  checkedStatus: boolean = false;

  managePayment: Array<Object> = [];
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private groupService: GroupService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.installmentNum = params['num']; // (+) converts string 'id' to a number.
    });

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
    obj["name"] = item.name;
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
        let obj = {};
        obj["token"] = this.managePayment[i]["token"];
        obj["group_id"] = this.managePayment[i]["group_id"];
        obj["amount"] = this.managePayment[i]["amount"];
        obj["payment_mode"] = this.managePayment[i]["payment_mode"];
        obj["payment_comment"] = this.managePayment[i]["payment_comment"];
        obj["payment_date"] = this.managePayment[i]["payment_date"];
        tempData.push(obj)
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

  _checkBoxChanged() {
    if(this.checkedStatus) {
      let tempAmount = this.managePayment[0]["amount"];
      for(let i in this.managePayment) {
        this.managePayment[i]["amount"] = tempAmount;
      }
    } else {
      for(let i in this.managePayment) {
        this.managePayment[i]["amount"] = 0;
      }
    }
  }

  goToHome() {
    this.router.navigate(['/v1/erpHome/']);
  }
}
