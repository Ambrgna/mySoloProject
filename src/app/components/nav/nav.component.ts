import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UsersapiService } from 'src/app/services/usersapi.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent {
  headers!: string | null;
  userid: string | null;
  loggedin: boolean | undefined;
  // iSOwner:boolean=false;
  
  constructor(private service: UsersapiService, private router: Router){
    this.headers = localStorage.getItem("headers");
    this.userid = localStorage.getItem("userid");
    // if(this.userid!=null){
    //   this.service.getUserById(this.userid).subscribe({
    //     next: (r) => {
    //       if(r.role=="ROLE_OWNER"){
    //         this.iSOwner =true;
    //       }
    //     },
    //     error: (e) => console.log(e)
    //   });
    // }
  
    if(this.headers != null){
      this.loggedin=true;
    }
  }
  
  // myRestaurants(){
  //   this.router.navigate(["/main"]);
  // }

  logout() {
    this.loggedin=false;
    this.service.logout();
    this.router.navigate(["/login"]);
  }

}
