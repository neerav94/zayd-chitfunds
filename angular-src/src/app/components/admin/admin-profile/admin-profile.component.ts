import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-profile',
  templateUrl: './admin-profile.component.html',
  styleUrls: ['./admin-profile.component.css']
})
export class AdminProfileComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    document.getElementById("homeView").classList.remove("current");
    document.getElementById("userView").classList.remove("current");
    document.getElementById("groupView").classList.remove("current");
    document.getElementById("profileView").classList.add("current");
  }

}
