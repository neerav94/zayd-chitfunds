import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { UserService } from '../../../../services/user.service'

@Component({
  selector: 'app-admin-user-transactions',
  templateUrl: './admin-user-transactions.component.html',
  styleUrls: ['./admin-user-transactions.component.css', '../../../../css/typography.css']
})
export class AdminUserTransactionsComponent implements OnInit {

  loading: boolean = false;
  phoneNumber: number;
  name: string = "";

  userPaymentDetails: any;

  constructor(private route: ActivatedRoute, private userService: UserService, private router: Router) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.phoneNumber = +params['id']; // (+) converts string 'id' to a number.
    });
    this.loading = true;
    this.userService.getUserTransactions(this.phoneNumber).subscribe(data => {
      if(data.status) {
        if(data.message.length > 0) {
          this.name = data.message[0]["name"]
        }
        this.userPaymentDetails = data.message;
        for(let i=0;i<this.userPaymentDetails.length; i++) {
          this.userPaymentDetails[i].amount = this.userPaymentDetails[i].amount.toLocaleString('en-IN', {useGrouping:true})
          var dateIST = new Date(this.userPaymentDetails[i].payment_date)
          // dateIST.setHours(dateIST.getHours() + 5); 
          // dateIST.setMinutes(dateIST.getMinutes() + 30);
          this.userPaymentDetails[i].payment_date = dateIST.getDate() + "/" + (dateIST.getMonth() + 1) + "/" + dateIST.getFullYear() + " " + dateIST.getHours() + ":" + dateIST.getMinutes()
        }
      } else {
        console.log("Some error occurred" + data.message);
      }
      this.loading = false;
    })
  }

  goToHome() {
    this.router.navigate(['/v1/erpHome/']);
  }

}
