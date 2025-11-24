import { Routes } from '@angular/router';
import { Dashboard } from './dashboard/dashboard';
import { Login } from './login/login';
import { Summary } from './summary/summary';
import { Report } from './report/report';
import { Register } from './register/register';

export const routes: Routes = [

{
    path: '',
    component: Login
  },
  {
    path:'login',
    component: Login
  },

  {
    path: 'dashboard',
    component: Dashboard
  },

   {
    path: 'summary',
    component: Summary
  },

   {
    path: 'report',
    component:Report
  },



   {
    path: 'register',
    component:Register
  },

];

