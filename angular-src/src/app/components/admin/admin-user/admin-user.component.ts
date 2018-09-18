import { Component, OnInit } from '@angular/core';
import { ValidationService } from '../../../services/validation.service'
import { UserService } from '../../../services/user.service'

import { FileUploader } from 'ng2-file-upload';

@Component({
  selector: 'app-admin-user',
  templateUrl: './admin-user.component.html',
  styleUrls: ['./admin-user.component.css', '../../../css/typography.css']
})
export class AdminUserComponent implements OnInit {

  loading: boolean = false;

  addUserStatus: boolean = false;
  addUserError: boolean= false;
  showNotification: boolean = false;

  usercontact: boolean = false;
  userName: boolean = false;

  addUserErrorMessage: string = ""
  notificationMessage: string = ""

  allUsers: any;

  uploader:FileUploader;

  constructor(
    private validationService: ValidationService,
    private userService: UserService
  ) { }

  ngOnInit() {
    document.getElementById("homeView").classList.remove("current");
    document.getElementById("userView").classList.add("current");
    document.getElementById("groupView").classList.remove("current");
    document.getElementById("profileView").classList.remove("current");

    this.loading = true;
    this.userService.getAllUsers().subscribe(data => {
      if(data.status) {
        this.allUsers = data.message;
        this.allUsers.sort(function(a,b) {
          if ( a.name < b.name )
              return -1;
          if ( a.name > b.name )
              return 1;
          return 0;
        });
      } else {
        alert(data.message)
      }
      this.loading = false;
    })

    this.uploader = new FileUploader({url: this.userService.url + "/v1/user/addMultipleUsers", itemAlias: 'photo', authToken: this.userService.authToken});

    //override the onAfterAddingfile property of the uploader so it doesn't authenticate with //credentials.
    this.uploader.onAfterAddingFile = (file)=> { 
      // this.loading = true;
      file.withCredentials = false; 
    };
    //overide the onCompleteItem property of the uploader so we are 
    //able to deal with the server response.
    
    this.uploader.onCompleteItem = (item:any, response:any, status:any, headers:any) => {
      response = JSON.parse(response)
      if(!response.status) {
        alert(response.message)
        this.addUserStatus = true;
      } else {
        this.addUserStatus = false;
        this.notificationMessage = "You have successfully added users."
        this.userService.getAllUsers().subscribe(data => {
          if(data.status) {
            this.allUsers = data.message;
            this.allUsers.sort(function(a,b) {
              if ( a.name < b.name )
                  return -1;
              if ( a.name > b.name )
                  return 1;
              return 0;
            });
          } else {
            alert(data.message)
          }
        })
      }
      this.loading = false;
    }
  }

  // function called when a user clicks on submit user info button
  submitUserInfo(userInfo: any):void {
    if(this.validationService.isNumberEmpty(userInfo.contact)) {
      this.usercontact = true
    } else {
      this.usercontact = false
    }

    if(this.validationService.isNameEmpty(userInfo.name)) {
      this.userName = true
    } else {
      this.userName = false
    }

    if(!this.usercontact && !this.userName) {
      this.loading = true;
      this.userService.addUser(userInfo).subscribe(data => {
        if(data.status) {
          this.loading = false;
          this.addUserStatus = false;
          this.addUserError = false;  
          this.showNotification = true;
          this.notificationMessage = "You have successfully created a new user."
          setTimeout(() => {
            this.showNotification = false;
          },5000);
          this.userService.getAllUsers().subscribe(data => {
            if(data.status) {
              this.allUsers = data.message;
              this.allUsers.sort(function(a,b) {
                if ( a.name < b.name )
                    return -1;
                if ( a.name > b.name )
                    return 1;
                return 0;
              });
            } else {
              alert(data.message)
            }
          })
        } else {
          this.loading = false;
          this.addUserError = true;
          this.addUserErrorMessage = data.message
        }
      })
    }
  }

  // function called to add/update user in the database
  //function called to open the dialog to create a group
  addUser():void {
    if(this.addUserStatus) {
      this.addUserStatus = false;
      this.addUserError = false;
    } else {
      this.addUserStatus = true;
    }
  }
  
  closeAddUsers() {
    this.addUserStatus = false;
  }

}
