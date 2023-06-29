import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Client } from 'src/app/entities/client';
import { Project } from 'src/app/entities/project';
import { RestapiService } from 'src/app/services/restapi.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent {
  title:string|undefined="";
  client!:Client;
  projects: Project[] = [];
  routeid:string|null;
  isOwner:boolean = false;
  userid:number | undefined;
 
  constructor(private service: RestapiService, private route:ActivatedRoute){
    // this.client.name="";
    this.routeid = this.route.snapshot.paramMap.get('clientid');
    this.getProjects(this.routeid);
    this.getClient(this.routeid);
    const uid = sessionStorage.getItem("userid");
    if(uid!=null){
      this.userid=parseInt(uid);
    }
  }
  
  public getClient(id:string|null): void {
    this.service.getClientById(id).subscribe({
      next: (response: Client) => {
        console.log(response);
        this.client=response;
        this.title=response.name;
        if(response.userId==this.userid){
          this.isOwner=true;
          console.log(this.isOwner);
        }
      },
    });
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
