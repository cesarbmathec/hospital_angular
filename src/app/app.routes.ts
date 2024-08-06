import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { LogoutComponent } from './components/logout/logout.component';
import { RegisterComponent } from './components/register/register.component';
import { PacienteListComponent } from './components/paciente-list/paciente-list.component';
import { PacienteAddComponent } from './components/paciente-add/paciente-add.component';
import { NotFoundComponent } from './components/not-found/not-found.component';

export const routes: Routes = [
  // Public Urls
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  // Private Urls
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  {
    path: 'pacienteList',
    component: PacienteListComponent,
    canActivate: [AuthGuard],
  },
  { path: 'logout', component: LogoutComponent, canActivate: [AuthGuard] },
  {
    path: 'pacienteAdd',
    component: PacienteAddComponent,
    canActivate: [AuthGuard],
  },
  { path: '**', component: NotFoundComponent },
];
