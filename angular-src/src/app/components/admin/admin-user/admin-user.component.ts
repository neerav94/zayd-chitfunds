import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-user',
  templateUrl: './admin-user.component.html',
  styleUrls: ['./admin-user.component.css', '../../../css/typography.css']
})
export class AdminUserComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    document.getElementById("homeView").classList.remove("current");
    document.getElementById("userView").classList.add("current");
    document.getElementById("groupView").classList.remove("current");
    document.getElementById("profileView").classList.remove("current");
  }

}
