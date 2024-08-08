import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { LogoutComponent } from './components/logout/logout.component';
import { RegisterComponent } from './components/register/register.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { PacienteListComponent } from './components/paciente/paciente-list/paciente-list.component';
import { PacienteAddComponent } from './components/paciente/paciente-add/paciente-add.component';
import { PacienteComponent } from './components/paciente/paciente.component';

export const routes: Routes = [
  // Public Urls
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  // Private Urls
  {
    path: '',
    component: HomeComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'paciente',
        component: PacienteComponent,
        canActivate: [AuthGuard],
        children: [
          {
            path: 'pacienteList',
            component: PacienteListComponent,
            canActivate: [AuthGuard],
          },
          {
            path: 'pacienteAdd',
            component: PacienteAddComponent,
            canActivate: [AuthGuard],
          },
        ],
      },
    ],
  },
  { path: 'logout', component: LogoutComponent },
  { path: '**', component: NotFoundComponent },
];
