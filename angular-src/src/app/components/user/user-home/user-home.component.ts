import {
  Component,
  OnInit
} from '@angular/core';
import {
  AuthService
} from '../../../services/auth.service';
import {
  Router
} from '@angular/router';

@Component({
  selector: 'app-user-home',
  templateUrl: './user-home.component.html',
  styleUrls: ['./user-home.component.css']
})
export class UserHomeComponent implements OnInit {

  user: Object;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.usersHomePage().subscribe(home => {
      if(home.status) {
        this.user = home.user;
      } else {
        this.router.navigate(['/v1/error']);
      }
      },
      err => {
        return false;
      })
  }

}
