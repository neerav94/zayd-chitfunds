import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css', '../../../css/typography.css']
})
export class UserProfileComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    document.getElementById("userHomeView").classList.remove("current");
    document.getElementById("userProfileView").classList.add("current");
  }

}
