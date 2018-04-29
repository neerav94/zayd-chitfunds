import { ModuleWithProviders, NgModule }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './guards/auth.guard';

import { LoginComponent } from './components/login/login.component';
import { ErrorComponent } from './components/error/error.component';
import { UserHomeComponent } from './components/user/user-home/user-home.component';
import { AdminHomeComponent } from './components/admin/admin-home/admin-home.component';
import { AdminUserComponent } from './components/admin/admin-user/admin-user.component';
import { AdminGroupComponent } from './components/admin/admin-group/admin-group.component';
import { GroupViewComponent } from './components/admin/admin-group/group-view/group-view.component';
import { AdminUserViewComponent } from './components/admin/admin-user/admin-user-view/admin-user-view.component';
import { AdminProfileComponent } from './components/admin/admin-profile/admin-profile.component';

export const routes: Routes = [
    { path: '', redirectTo: 'v1/login', pathMatch: 'full'},
    { path: 'v1/login', component: LoginComponent},
    { path: 'v1/home', component: UserHomeComponent, canActivate: [AuthGuard] },
    { path: 'v1/erpHome', component: AdminHomeComponent, canActivate: [AuthGuard] },
    { path: 'v1/erpGroup', component: AdminGroupComponent, canActivate: [AuthGuard] },
    { path: 'v1/erpGroup/:id', component: GroupViewComponent, canActivate: [AuthGuard] },
    { path: 'v1/erpUser/:id', component: AdminUserViewComponent, canActivate: [AuthGuard]},
    { path: 'v1/erpUser', component: AdminUserComponent, canActivate: [AuthGuard] },
    { path: 'v1/erpProfile', component: AdminProfileComponent, canActivate: [AuthGuard] },
    { path: '**', component: ErrorComponent}
]

@NgModule({
    imports: [
        RouterModule.forRoot(routes)
    ],
    exports: [
        RouterModule
    ]
})

export class AppRoutingModule {}
export const routingComponents = [LoginComponent, ErrorComponent, UserHomeComponent, AdminHomeComponent, AdminUserComponent, AdminGroupComponent, AdminProfileComponent]