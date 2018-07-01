import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { GroupService } from '../../../services/group.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-home',
  templateUrl: './user-home.component.html',
  styleUrls: ['./user-home.component.css', '../../../css/typography.css']
})
export class UserHomeComponent implements OnInit {

  user: Object;
  userGroupIds;
  userGroups;
  loading: boolean = false;

  constructor(
    private authService: AuthService,
    private groupService: GroupService,
    private router: Router
  ) {}

  ngOnInit() {
    document.getElementById("userHomeView").classList.add("current");
    document.getElementById("userProfileView").classList.remove("current");
    this.loading = true;
    this.authService.usersHomePage().subscribe(home => {
      if(home.status) {
        this.user = home.user;
        this.groupService.getGroupByNumber(this.user[0].number).subscribe(data => {
          if(data.status) {
            this.userGroupIds = data.message
            this.groupService.getAllGroups().subscribe(groupData => {
              if(groupData.status) {
                this.userGroups = [];
                let tempGroups = groupData.message
                for(let i=0; i<tempGroups.length; i++) {
                  if(this.userGroupIds.indexOf(tempGroups[i].grp_id) > -1) {
                    this.userGroups.push(tempGroups[i])
                  }
                }
              } else {
                alert(data.message)
              }
            })
          } else {
            alert(data.message);
          }
          this.loading = false;
        });
      } else {
        this.router.navigate(['/v1/error']);
      }
    },
    err => {
      return false;
    })
  }

}
