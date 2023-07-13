import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UsersapiService } from 'src/app/services/usersapi.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {

  private username: string = "";
  private password: string = "";
  private confirmPassword: string = "";
  private role: string = "";

  private _signupForm!: FormGroup;
  private _failed: boolean = false;
  private _passwordMatch: boolean = true;

  constructor(private service: UsersapiService, private router: Router, private formBuilder: FormBuilder,public snackBar: MatSnackBar){
    this._signupForm = new FormGroup({
        username: new FormControl(this.username, [Validators.required]),
        password: new FormControl(this.password, [Validators.required]),
        confirmPassword: new FormControl(this.confirmPassword, [Validators.required]),
        role: new FormControl(this.role, [Validators.required])
      });
  }

  public get signupForm() : FormGroup {
    return this._signupForm;
  }
  public get failed() : boolean {
    return this._failed;
  }
  public get passwordMatch() : boolean {
    return this._passwordMatch;
  }
  
  public get u(): any { return this._signupForm.get('username');}
  public get p(): any { return this._signupForm.get('password');}
  public get cp(): any { return this._signupForm.get('confirmPassword');}
  public get r(): any { return this._signupForm.get('role');}
  
  public checkUsername(){
    console.log(this._signupForm.value.username);
    
    this.service.getUser(this._signupForm.value.username).subscribe(u =>{
      if(u.username === this._signupForm.value.username){
        this._failed=true;
        console.log("Already Exists");
      }else{
        this._failed=false;
      }
    });
  }
  
  public checkPassword(){
    this._passwordMatch = this._signupForm.value.password===this._signupForm.value.confirmPassword;
  }

  public addUser(){
    const roles = ["ROLE_LEAD","ROLE_MEMBER"];
    this._signupForm.value.role= roles[parseInt(this._signupForm.value.role)];
    
    this.service.addUser(this._signupForm.value).subscribe({
      next: (response) => {
        console.log(response);
        this.openSnackBar("User added successfully");
        
        this.router.navigate(["/login"]);
    },
      error: (error) => this.openSnackBar("User added failed"),
    });
  }

  public openSnackBar(message: string) {
    this.snackBar.open(message, "OK", {
      duration: 2000,
    });
  }

}

