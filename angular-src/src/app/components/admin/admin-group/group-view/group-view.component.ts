import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { GroupService } from '../../../../services/group.service';

@Component({
  selector: 'app-group-view',
  templateUrl: './group-view.component.html',
  styleUrls: ['./group-view.component.css', '../../../../css/typography.css']
})
export class GroupViewComponent implements OnInit {

  loading: boolean = false;
  activeView: boolean;

  id: number;

  groupInfo: any;
  paymentData: any;

  constructor(
    private route: ActivatedRoute,
    private groupService: GroupService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = +params['id']; // (+) converts string 'id' to a number.
    });
    this.loading = true;
    this.groupService.getGroupById(this.id).subscribe(data => {
      if(data.status) {
        this.groupInfo = data.message
        if(this.groupInfo[0].start_date) {
          this.groupService.getAllSubscribers(this.groupInfo[0].grp_id).subscribe(data => {
            if(data.message.length === this.groupInfo[0].num_members) {
              this.activeView = true;
            } else {
              this.activeView = false;
            }
          })
        } else {
          this.activeView = false;
        }
      } else {
        alert("Some error occurred. Please try again.")
      }
      this.loading = false;
    }, err => {
      this.loading = false;
      alert("Some error occurred. Please try again.")
    })
  }

}
