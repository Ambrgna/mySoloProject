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
  private username: string = "";
  private password: string = "";

  private _loginForm!: FormGroup;
  private _failed: boolean = false;

  constructor(private service: UsersapiService, private router: Router, private formBuilder: FormBuilder){
    
    // Define Login FormGroup
    this._loginForm = new FormGroup({
      username: new FormControl(this.username, [
        Validators.required
      ]),
      password: new FormControl(this.password, [
        Validators.required
      ])
    });
  }

  public get loginForm() : FormGroup {
    return this._loginForm;
  }
  public get failed() : boolean {
    return this._failed;
  }
  
  public get u(): any { return this._loginForm.get('username');}
  public get p(): any { return this._loginForm.get('password');}
  
  public async login(){
    this.service.login(this._loginForm.value).subscribe({
      next: async () => {
        var userid = await this.service.userid(this._loginForm.value.username);

        // Sets current user for later use
        sessionStorage.setItem("userid", userid);

        this.router.navigate(["/main"]);
      },
      error: (error) =>  this._failed = true
    });
  }
}
