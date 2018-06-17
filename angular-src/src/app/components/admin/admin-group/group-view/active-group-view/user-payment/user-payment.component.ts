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
    });

    this.loading = true;
    this.groupService.getUserPaymentDetails(this.tokenId, this.groupId).subscribe(data => {
      if(data.status) {
        this.userPaymentDetails = data.message;
      } else {
        alert(data.message);
      }
      this.loading = false;
    })
  }

}
