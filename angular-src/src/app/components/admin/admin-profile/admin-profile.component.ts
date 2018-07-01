import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { ValidationService } from '../../../services/validation.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-profile',
  templateUrl: './admin-profile.component.html',
  styleUrls: ['./admin-profile.component.css', '../../../css/typography.css']
})
export class AdminProfileComponent implements OnInit {

  loading: boolean = false;
  role: number = -1;
  number: number = -1;
  isSuperAdmin: boolean = false;
  currentAdmins;

  adminName: boolean = false;
  adminNumber: boolean = false;
  adminEmail: boolean = false;
  adminPassword: boolean = false;
  adminOldPassword: boolean = false;
  adminNewPassword: boolean = false;

  constructor(private authService: AuthService, private validationService: ValidationService, private router: Router) { }

  ngOnInit() {
    document.getElementById("homeView").classList.remove("current");
    document.getElementById("userView").classList.remove("current");
    document.getElementById("groupView").classList.remove("current");
    document.getElementById("profileView").classList.add("current");

    const user = JSON.parse(localStorage.getItem('user'));
    this.role = user.role;
    this.number = user.number;
    if(this.role == 2) {
      this.isSuperAdmin = true;
      this.loading = true;
      this.authService.getAdmins().subscribe(data => {
        if(data.status) {
          this.currentAdmins = data.message;
        } else {
          alert(data.message);
        }
        this.loading = false;
      })
    } else {
      this.isSuperAdmin = false;
    }
  }

  submitAdminInfo(adminInfo) {
    if(this.validationService.isEmailEmpty(adminInfo.email)) {
      this.adminEmail = true
    } else {
      this.adminEmail = false
    }
    if(this.validationService.isNameEmpty(adminInfo.name)) {
      this.adminName = true;
    } else {
      this.adminName = false;
    }
    if(this.validationService.isNumberEmpty(adminInfo.number)) {
      this.adminNumber = true
    } else {
      this.adminNumber = false
    }
    if(this.validationService.isPasswordEmpty(adminInfo.password)) {
      this.adminPassword = true;
    } else {
      this.adminPassword = false;
    }
    if(!this.adminEmail && !this.adminName && !this.adminNumber && !this.adminPassword) {
      this.loading = true;
      this.authService.registerAdmin(adminInfo).subscribe(data => {
        if(data.status) {
          this.authService.getAdmins().subscribe(admins => {
            if(admins.status) {
              this.currentAdmins = admins.message;
            } else {
              alert(admins.message);
            }
          })
        } else {
          alert(data.message);
        }
        this.loading = false;
      })
    }
  }

  updateAdminPassword(passwordObj) {
    if(this.validationService.isPasswordEmpty(passwordObj.oldPassword)) {
      this.adminOldPassword = true;
    } else {
      this.adminOldPassword = false;
    }

    if(this.validationService.isPasswordEmpty(passwordObj.newPassword)) {
      this.adminNewPassword = true;
    } else {
      this.adminNewPassword = false;
    }

    if(!this.adminNewPassword && !this.adminOldPassword) {
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

  deleteAdmin(adminId) {
    this.loading = true;
    this.authService.deleteAdmin(adminId).subscribe(data => {
      if(data.status) {
        this.currentAdmins = data.message;
      } else {
        alert(data.message);
      }
      this.loading = false;
    })
  }

  logOut() {
    this.authService.logOut();
    this.router.navigate(['/v1/login'], { replaceUrl: true });
  }

}
