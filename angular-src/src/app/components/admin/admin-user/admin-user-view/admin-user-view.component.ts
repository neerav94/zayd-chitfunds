import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { UserService } from '../../../../services/user.service';

@Component({
  selector: 'app-admin-user-view',
  templateUrl: './admin-user-view.component.html',
  styleUrls: ['./admin-user-view.component.css', '../../../../css/typography.css']
})
export class AdminUserViewComponent implements OnInit {

  loading: boolean = false;
  activeView: boolean = false;
  id: number;

  userInfo: any;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = +params['id']; // (+) converts string 'id' to a number.
    });
    this.loading = true;
    this.userService.getUserById(this.id).subscribe(data => {
      if(data.status) {
        this.userInfo = data.message
        this.activeView = true;
      } else {
        this.activeView = false;
        alert("Some error occurred. Please try again.")
      }
      this.loading = false;
    }, err => {
      this.loading = false;
      alert("Some error occurred. Please try again.")
    })
  }

}
