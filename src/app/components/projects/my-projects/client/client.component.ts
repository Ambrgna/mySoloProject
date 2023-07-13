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
  
  private _client!:Client;
  private _projects: Project[] = [];
  private clientid: string="";
  private _isOwner:boolean = false;
  private userid:number;
 
  constructor(private service: RestapiService){    
    // Gets current logged in user id
    const uid = sessionStorage.getItem("userid");
    this.userid=(uid!=null) ? parseInt(uid):-1;
  }
  
  public get client() : Client {
    return this._client;
  }
  @Input() public set client(client : Client) {
    this._client = client;
  }  
  public get projects() : Project[] {
    return this._projects;
  }  
  public get isOwner() : boolean {
    return this._isOwner;
  }
  
  public ngOnInit(): void {    
    console.log(this._client);

    // Finds if user creater of the client
    if(this._client.userId==this.userid){
      this._isOwner=true;
      console.log(this._isOwner);
    }
    
    if(this._client.clientId!==undefined){
      this.clientid=this._client.clientId.toString();
      
      // Gets list of client's project  
      this.getProjects(this.clientid);
    }
    console.log(this._projects.length);
    
  } 
  // Refreshes Projects list
  public updateProjects(){
    this._projects=[];
    this.getProjects(this.clientid);
  }
  // Gets list of Projects
  public getProjects(id:string|null): void {
    this.service.getProjectsByClientId(id).subscribe({
      next: (response: Project[]) => {
        console.log(response);
        for(const project of response)
        {
          // Limits list to project the user is part of 
          if(project.disabled == false&&(project.teamLeads?.includes(this.userid)||project.teamMembers?.includes(this.userid)))
          {
            this._projects.push(project);
          }
        }
        console.log(this._projects);
      },
    });
  }

}
