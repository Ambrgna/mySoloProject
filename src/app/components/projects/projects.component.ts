import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Client } from 'src/app/entities/client';
import { Project } from 'src/app/entities/project';
import { User } from 'src/app/entities/user';
import { RestapiService } from 'src/app/services/restapi.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {
  pdf:any="";
  
  client:Client=new Client();
  projects: Project[] = [];
  routeid:string|null;
  canAdd:boolean = false;
  canView:boolean = false;
  userid:number;
 
  constructor(private service: RestapiService, private route:ActivatedRoute,private sanitizer: DomSanitizer){
    this.routeid = this.route.snapshot.paramMap.get('clientid');
    this.getProjects(this.routeid);
    this.getClient(this.routeid);
    const uid = sessionStorage.getItem("userid");
    this.getUser(uid);
    this.userid=(uid!=null) ? parseInt(uid):-1;
  }
  ngOnInit(): void {} 
  
  public getClient(id:string|null): void {
    this.service.getClientById(id).subscribe({
      next: (response: Client) => {
        console.log(response);
        this.canView = (
          response.visibility||response.canView?.includes(this.userid)
          )?true:false;
        console.log("canView",this.canView);
        this.client=response;
        if(this.client.agreementPath!==undefined){
          console.log(this.client.agreementPath);
          this.pdf = this.sanitizer.bypassSecurityTrustResourceUrl(this.client.agreementPath);
        }
      },
    });
  }
  
  public getUser(id:string|null): void {
    if(id!=null){
      this.service.getUserById(id).subscribe({
        next: (response: User) => {
          console.log(response);
          if(response.role=="ROLE_LEAD"){
            this.canAdd=true;
            console.log(this.canAdd);
          }
        },
      });
    }
  }

  updateProjects(){
    this.projects=[];
    this.getProjects(this.routeid);
  }

  public getProjects(id:string|null): void {
    this.service.getProjectsByClientId(id).subscribe({
      next: (response: Project[]) => {
        console.log(response);
        for(const item of response)
        {
          if(item.disabled == false)
          {
            this.projects.push(item);
          }
        }
        console.log(this.projects);
      },
    });
  }

}
