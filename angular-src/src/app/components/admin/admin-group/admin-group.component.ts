import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-group',
  templateUrl: './admin-group.component.html',
  styleUrls: ['./admin-group.component.css']
})
export class AdminGroupComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    document.getElementById("homeView").classList.remove("current");
    document.getElementById("userView").classList.remove("current");
    document.getElementById("groupView").classList.add("current");
    document.getElementById("profileView").classList.remove("current");
  }

}
