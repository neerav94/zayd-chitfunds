import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ValidationService } from '../../../services/validation.service'

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css', '../../../css/typography.css']
})
export class UserProfileComponent implements OnInit {

  loading: boolean = false;

  userOldPassword: boolean = false;
  userNewPassword: boolean = false;
  userPasswordError: boolean = false;

  number: number = -1;

  constructor(public authService : AuthService, private router: Router, public validationService: ValidationService) { }

  ngOnInit() {
    document.getElementById("userHomeView").classList.remove("current");
    document.getElementById("userProfileView").classList.add("current");

    const user = JSON.parse(localStorage.getItem('user'));
    this.number = user.number;
  }

  updateUserPassword(passwordObj) {
    if(this.validationService.isPasswordEmpty(passwordObj.oldPassword)) {
      this.userOldPassword = true;
    } else {
      this.userOldPassword = false;
    }

    if(this.validationService.isPasswordEmpty(passwordObj.newPassword)) {
      this.userNewPassword = true;
    } else {
      this.userNewPassword = false;
    }

    if(this.validationService.validatePassword(passwordObj.newPassword)) {
      this.userPasswordError = false;
    } else {
      this.userPasswordError = true;
    }

    if(!this.userNewPassword && !this.userOldPassword && !this.userPasswordError) {
      passwordObj["number"] = this.number;
      this.loading = true;
      this.authService.updatePassword(passwordObj).subscribe(data => {
        if(data.status) {
          alert("Password Updated successfully!");
        } else {
          alert(data.message);
        }
        this.loading = false;
      })
    }
  }

  logOut() {
    this.authService.logOut();
    this.router.navigate(['/v1/login'], { replaceUrl: true });
  }

}
