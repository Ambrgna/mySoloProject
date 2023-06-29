import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainComponent } from './components/main/main.component';
import { NavComponent } from './components/nav/nav.component';
import { FooterComponent } from './components/footer/footer.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { ClientsComponent } from './components/clients/clients.component';
import { ClientCardComponent } from './components/clients/client-card/client-card.component';

import { UsersapiService } from './services/usersapi.service';
import { RestapiService } from './services/restapi.service';
import { AddClientsComponent } from './components/add-clients/add-clients.component';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    NavComponent,
    FooterComponent,
    LoginComponent,
    SignupComponent,
    ClientsComponent,
    ClientCardComponent,
    AddClientsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule, 
    FormsModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatRadioModule,
    MatSelectModule
  ],
  providers: [UsersapiService,RestapiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
