import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { GroupService } from '../../../../../../services/group.service';

@Component({
  selector: 'app-user-payment',
  templateUrl: './user-payment.component.html',
  styleUrls: ['./user-payment.component.css', '../../../../../../css/typography.css']
})
export class UserPaymentComponent implements OnInit {

  loading: boolean = false;
  id: number;
  groupId: number;
  tokenId: number;
  active: number;

  userRole: number;

  userPaymentDetails: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private groupService: GroupService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.groupId = +params['id']; // (+) converts string 'id' to a number.
      this.tokenId = +params['id1'];
      this.active = +params['id2'];
    });

    const token = JSON.parse(localStorage.getItem('user'))
    this.userRole = token["role"];

    this.loading = true;
    this.groupService.getUserPaymentDetails(this.tokenId, this.groupId, this.active).subscribe(data => {
      if(data.status) {
        this.userPaymentDetails = data.message;
        // for(let i=0;i<this.userPaymentDetails.length; i++) {
        //   this.userPaymentDetails[i].amount = this.userPaymentDetails[i].amount.toLocaleString('en-IN', {useGrouping:true})
        // }
      } else {
        alert(data.message);
      }
      this.loading = false;
    })
  }

  updatePayments() {
    this.loading = true;
    this.groupService.updateUserPayments(this.userPaymentDetails).subscribe(data => {
      if(data.status) {
        this.loading = true;
        this.groupService.getUserPaymentDetails(this.tokenId, this.groupId, this.active).subscribe(data => {
          if(data.status) {
            this.userPaymentDetails = data.message;
            // for(let i=0;i<this.userPaymentDetails.length; i++) {
            //   this.userPaymentDetails[i].amount = this.userPaymentDetails[i].amount.toLocaleString('en-IN', {useGrouping:true})
            // }
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

  goToHome() {
    this.router.navigate(['/v1/erpHome/']);
  }

}
