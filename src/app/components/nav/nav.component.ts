import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UsersapiService } from 'src/app/services/usersapi.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent {
  private headers!: string|null;
  private _userid: string|null;
  private _loggedin: boolean|undefined;
  private _leadUser: boolean=false;
  
  constructor(private service: UsersapiService, private router: Router){
    
    // Gets current user info
    this.headers = sessionStorage.getItem("headers");
    this._userid = sessionStorage.getItem("userid");
    
    if(this._userid!=null){
      this.service.getUserById(this._userid).subscribe({
        next: (r) => {
          // Sees if a user is logged in with ROLE_LEAD
          console.log("role",r.role);
          if(r.role=="ROLE_LEAD"){
            this._leadUser =true;
          }
        },
        error: (e) => console.log(e)
      });
    }
  
    // Sees if a user is logged in
    if(this.headers != null){
      this._loggedin=true;
    }
  }
  
  public get userid() : string|null {
    return this._userid;
  }
  public get loggedin() : boolean|undefined {
    return this._loggedin;
  }
  public get leadUser() : boolean {
    return this._leadUser;
  }
  

  // Logs User out
  public logout() {
    this._loggedin=false;
    // Logs out using UsersapiService
    this.service.logout();
    this.router.navigate(["/login"]);
  }

}
