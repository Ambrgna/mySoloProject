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
  private _pdf:any="";
  
  private _client:Client=new Client();
  private _projects: Project[] = [];
  private _routeid:string|null;
  private _canAdd:boolean = false;
  private _canView:boolean = false;
  private _accountUser:boolean = true;
  private userid:number;
 
  constructor(private service: RestapiService, private route:ActivatedRoute,private sanitizer: DomSanitizer){
    // Gets current logged in user id
    const uid = sessionStorage.getItem("userid");
    this.getUser(uid);
    this.userid=(uid!=null) ? parseInt(uid):-1;
    // Gets client id for page
    this._routeid = this.route.snapshot.paramMap.get('clientid');
    // Gets Projects from the Client
    this.getProjects(this._routeid);
    // Get Client info
    this.getClient(this._routeid);
  }

  public get pdf() : any {
    return this._pdf;
  }
  public get client() : Client {
    return this._client;
  }  
  public get projects() : Project[] {
    return this._projects;
  }  
  public get routeid() : string|null {
    return this._routeid;
  }
  public get canAdd() : boolean {
    return this._canAdd;
  }
  public get canView() : boolean {
    return this._canView;
  }
  public get accountUser() : boolean {
    return this._accountUser;
  }
  
  public ngOnInit(): void {} 

  // Refreshes Projects list
  public updateProjects(){
    this._projects=[];
    this.getProjects(this._routeid);
  }

  // Get Client info to fill page
  public getClient(id:string|null): void {
    this.service.getClientById(id).subscribe({
      next: (response: Client) => {
        console.log(response);
        this._canView = (
          response.visibility||response.canView?.includes(this.userid)
          )?true:false;
        console.log("canView",this._canView);
        this._client=response;
        if(this._client.agreementPath!==undefined){
          console.log(this._client.agreementPath);
          this._pdf = this.sanitizer.bypassSecurityTrustResourceUrl(this._client.agreementPath);
        }
      },
    });
  }

  // Get User info to limit actions
  public getUser(id:string|null): void {
    if(id!=null){
      this.service.getUserById(id).subscribe({
        next: (response: User) => {
          console.log(response);
          if(response.role=="ROLE_LEAD"){
            this._canAdd=true;
          }
        },
      });
    }
    // Limit actions if no user logged in
    else{
      this._accountUser = false;
    }
  }

  // Get list of enabled Projects
  public getProjects(id:string|null): void {
    this.service.getProjectsByClientId(id).subscribe({
      next: (response: Project[]) => {
        console.log(response);
        for(const project of response)
        {
          if(project.disabled == false)
          {
            this._projects.push(project);
          }
        }
        console.log(this._projects);
      },
    });
  }

}
