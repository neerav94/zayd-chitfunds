import { Component, OnInit } from '@angular/core';
import { ValidationService } from '../../services/validation.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css', '../../css/typography.css']
})
export class LoginComponent implements OnInit {

  passwordEmpty: boolean = false;
  numberEmpty: boolean = false;
  incorrectPassword: boolean = false;
  logInError: boolean = false;

  logInErrorMessage: string = ""

  login: boolean = true; // show login form

  loading = false;

  constructor( 
    private validationService: ValidationService, 
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    if(!localStorage.getItem("user")) {
      this.router.navigate(['/v1/login'], { replaceUrl: true });
    } else {
      var user = localStorage.getItem("user")
      user = JSON.parse(user)
      var role: number = user["role"]
      if(role == 0) {
        this.router.navigate(['/v1/home'], { replaceUrl: true });
      } else if(role == 1 || role == 2) {
        this.router.navigate(['/v1/erpHome'], { replaceUrl: true });
      }
    }
  }

  // function called when login header is clicked
  showLogIn(): void {
    this.login = true;
    // this.signup = false;
  }

  // function called when submit button is pressed in the login form 
  onLogin(user: any): void {
    if(this.validationService.isNumberEmpty(user.number)) {
      this.numberEmpty = true
    } else {
      this.numberEmpty = false
    }
    if(this.validationService.isPasswordEmpty(user.password)) {
      this.passwordEmpty = true;
    } else {
      this.passwordEmpty = false;
    }

    if(!this.numberEmpty && !this.passwordEmpty) {
      this.loading = true;
      this.authService.login(user).subscribe(data => {
        if(data.status) {
          this.authService.storeUserData(data.token, data.user)
          if(data.user.role == 0) {
            this.router.navigate(['/v1/home'], { replaceUrl: true });
          } else {
            this.router.navigate(['/v1/erpHome'], { replaceUrl: true });
          }
        } else {
          this.logInError = true;
          this.logInErrorMessage = data.message
          this.router.navigate(['/v1/login'], { replaceUrl: true });
        }
        this.loading = false;
      })
    }
  }
}
