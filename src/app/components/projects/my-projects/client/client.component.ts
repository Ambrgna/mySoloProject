import { Component, Input, OnInit } from '@angular/core';
import { Client } from 'src/app/entities/client';
import { Project } from 'src/app/entities/project';
import { RestapiService } from 'src/app/services/restapi.service';


@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css']
})
export class ClientComponent implements OnInit {
  
  @Input() client!:Client;
  projects: Project[] = [];
  clientid: string="";
  isOwner:boolean = false;
  userid:number;
 
  constructor(private service: RestapiService){
    const uid = sessionStorage.getItem("userid");
    this.userid=(uid!=null) ? parseInt(uid):-1;
  }
  ngOnInit(): void {    
    console.log(this.client);

    if(this.client.userId==this.userid){
      this.isOwner=true;
      console.log(this.isOwner);
    }
    
    if(this.client.clientId!==undefined){
      this.clientid=this.client.clientId.toString();
      this.getProjects(this.clientid);
    }
    console.log(this.projects.length);
    
  } 

  updateProjects(){
    this.projects=[];
    this.getProjects(this.clientid);
  }

  public getProjects(id:string|null): void {
    this.service.getProjectsByClientId(id).subscribe({
      next: (response: Project[]) => {
        console.log(response);
        for(const project of response)
        {
          if(project.disabled == false&&(project.teamLeads?.includes(this.userid)||project.teamMembers?.includes(this.userid)))
          {
            this.projects.push(project);
          }
        }
        console.log(this.projects);
      },
    });
  }

}
