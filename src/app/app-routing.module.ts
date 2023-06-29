import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './components/main/main.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { ClientsComponent } from './components/clients/clients.component';
import { AddClientsComponent } from './components/add-clients/add-clients.component';

const routes: Routes = [
  {path: '' , redirectTo: 'main/clients', pathMatch: 'full'},
  {path: 'login', component:LoginComponent},
  {path: 'signup', component: SignupComponent},
  {path: 'main', redirectTo: 'main/clients'},
  {
    path: 'main', component:MainComponent,
    children: [
      {
        path: 'clients',
        component: ClientsComponent,
      },
      {
        path: 'add',
        component: AddClientsComponent,
      },
      {
        path: 'main/:id/c/edit',
        component: AddClientsComponent,
      }
    ],
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
