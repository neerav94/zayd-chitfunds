import { ModuleWithProviders, NgModule }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './guards/auth.guard';

import { LoginComponent } from './components/login/login.component';
import { ErrorComponent } from './components/error/error.component';
import { UserHomeComponent } from './components/user/user-home/user-home.component';
import { AdminHomeComponent } from './components/admin/admin-home/admin-home.component';

export const routes: Routes = [
    { path: '', redirectTo: 'v1/login', pathMatch: 'full'},
    { path: 'v1/login', component: LoginComponent},
    { path: 'v1/home', component: UserHomeComponent, canActivate: [AuthGuard] },
    { path: 'v1/erpHome', component: AdminHomeComponent, canActivate: [AuthGuard] },
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
export const routingComponents = [LoginComponent, ErrorComponent, UserHomeComponent, AdminHomeComponent]