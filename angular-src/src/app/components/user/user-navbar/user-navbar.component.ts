import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-navbar',
  templateUrl: './user-navbar.component.html',
  styleUrls: ['./user-navbar.component.css', '../../../css/typography.css']
})
export class UserNavbarComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

}
