import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.css', '../../../css/typography.css']
})
export class AdminHomeComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    document.getElementById("homeView").classList.add("current");
    document.getElementById("userView").classList.remove("current");
    document.getElementById("groupView").classList.remove("current");
    document.getElementById("profileView").classList.remove("current");
  }

}
