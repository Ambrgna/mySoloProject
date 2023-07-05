import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UsersapiService } from 'src/app/services/usersapi.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = "";
  password: string = "";

  loginForm!: FormGroup;
  failed: boolean = false;

  constructor(private service: UsersapiService, private router: Router, private formBuilder: FormBuilder){
    this.loginForm = new FormGroup({
      username: new FormControl(this.username, [
        Validators.required
      ]),
      password: new FormControl(this.password, [
        Validators.required
      ])
    });
  }
  
  get u(): any { return this.loginForm.get('username');}
  get p(): any { return this.loginForm.get('password');}
  
  async login(){
    this.service.login(this.loginForm.value).subscribe({
      next: async () => {
        var userid = await this.service.userid(this.loginForm.value.username);

        localStorage.setItem("userid", userid);

        this.router.navigate(["/main"]);
      },
      error: (error) =>  this.failed = true
    });
  }
}
