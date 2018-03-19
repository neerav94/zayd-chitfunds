import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Routes,RouterModule }  from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { AppRoutingModule, routingComponents } from './app.routes';

import { ValidationService } from './services/validation.service';
import { AuthService } from './services/auth.service';
import { AuthGuard } from './guards/auth.guard';

import { UserNavbarComponent } from './components/user/user-navbar/user-navbar.component';
import { AdminNavbarComponent } from './components/admin/admin-navbar/admin-navbar.component';
// import { LoginComponent } from './components/login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    routingComponents,
    UserNavbarComponent,
    AdminNavbarComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpModule 
  ],
  providers: [ValidationService, AuthService, AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
