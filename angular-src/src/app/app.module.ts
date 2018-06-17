import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Routes,RouterModule }  from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { DataTableModule } from "angular2-datatable";

import { DlDateTimePickerDateModule } from 'angular-bootstrap-datetimepicker';
import { FileSelectDirective } from 'ng2-file-upload';

import { AppComponent } from './app.component';
import { AppRoutingModule, routingComponents } from './app.routes';

import { ValidationService } from './services/validation.service';
import { GroupService } from './services/group.service';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';
import { AuthGuard } from './guards/auth.guard';

import { UserNavbarComponent } from './components/user/user-navbar/user-navbar.component';
import { AdminNavbarComponent } from './components/admin/admin-navbar/admin-navbar.component';
import { LoadingComponent } from './components/loading/loading.component';
import { GroupViewComponent } from './components/admin/admin-group/group-view/group-view.component';
import { ActiveGroupViewComponent } from './components/admin/admin-group/group-view/active-group-view/active-group-view.component';
import { FutureGroupViewComponent } from './components/admin/admin-group/group-view/future-group-view/future-group-view.component';
import { AdminUserViewComponent } from './components/admin/admin-user/admin-user-view/admin-user-view.component';
import { ManagePaymentComponent } from './components/admin/admin-group/group-view/active-group-view/manage-payment/manage-payment.component';
import { UserPaymentComponent } from './components/admin/admin-group/group-view/active-group-view/user-payment/user-payment.component';

@NgModule({
  declarations: [
    AppComponent,
    routingComponents,
    UserNavbarComponent,
    AdminNavbarComponent,
    LoadingComponent,
    GroupViewComponent,
    ActiveGroupViewComponent,
    FutureGroupViewComponent,
    AdminUserViewComponent,
    FileSelectDirective,
    ManagePaymentComponent,
    UserPaymentComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpModule,
    DlDateTimePickerDateModule,
    DataTableModule
  ],
  providers: [ValidationService, AuthService, GroupService, UserService, AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
