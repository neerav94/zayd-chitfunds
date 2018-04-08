import { Injectable } from '@angular/core';

@Injectable()
export class ValidationService {

  constructor() {}

  // check if email is empty
  isEmailEmpty(email: string): boolean {
    if (email == "") {
      return true;
    }
    return false;
  }

  // check if name is empty
  isNameEmpty(name: string): boolean {
    if (name == "") {
      return true;
    }
    return false;
  }

  // check if number is empty
  isNumberEmpty(contact: string): boolean {
    if (contact == "") {
      return true;
    }
    return false;
  }

  // check if password is empty
  isPasswordEmpty(password: String): boolean {
    if (password == "") {
      return true;
    }
    return false;
  }

  // check for email validation
  validateEmail(email: String): boolean {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }
}
