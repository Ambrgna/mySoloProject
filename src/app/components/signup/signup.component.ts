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

  username: string = "";
  password: string = "";
  confirmPassword: string = "";
  role: string = "";

  signupForm!: FormGroup;

  message: any ="";
  failed: boolean = false;
  
  passwordMatch: boolean = true;

  constructor(private service: UsersapiService, private router: Router, private formBuilder: FormBuilder,public snackBar: MatSnackBar){
    this.signupForm = new FormGroup({
        username: new FormControl(this.username, [Validators.required]),
        password: new FormControl(this.password, [Validators.required]),
        confirmPassword: new FormControl(this.confirmPassword, [Validators.required]),
        role: new FormControl(this.role, [Validators.required])
      });
  }


  get u(): any { return this.signupForm.get('username');}
  get p(): any { return this.signupForm.get('password');}
  get cp(): any { return this.signupForm.get('confirmPassword');}
  get r(): any { return this.signupForm.get('role');}

  checkUsername(){
    console.log(this.signupForm.value.username);
    
    this.service.getUser(this.signupForm.value.username).subscribe(u =>{
      if(u.username === this.signupForm.value.username){
        this.failed=true;
        console.log("Already Exists");
      }else{
        this.failed=false;
      }
    });
  }
  
  checkPassword(){
    this.passwordMatch = this.signupForm.value.password===this.signupForm.value.confirmPassword;
  }

  addUser(){
    const roles = ["ROLE_LEAD","ROLE_MEMBER"];
    this.signupForm.value.role= roles[parseInt(this.signupForm.value.role)];
    
    this.service.addUser(this.signupForm.value).subscribe({
      next: (response) => {
        console.log(response);
        this.openSnackBar("User added successfully");
        
        this.router.navigate(["/login"]);
    },
      error: (error) => this.openSnackBar("User added failed"),
    });
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, "OK", {
      duration: 2000,
    });
  }

}

