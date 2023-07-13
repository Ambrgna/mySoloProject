import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Project } from 'src/app/entities/project';
import { User } from 'src/app/entities/user';
import { RestapiService } from 'src/app/services/restapi.service';

@Component({
  selector: 'app-project-card',
  templateUrl: './project-card.component.html',
  styleUrls: ['./project-card.component.css']
})
export class ProjectCardComponent implements OnInit {
  private _project!: Project;
  private userid!: number;
  private _leads:string[] = [];
  private _members:string[] = [];
  private _isOwner:boolean=false;
  private _canEdit:boolean=false;
  private _canRemove:boolean=false;
  private _logo:string|undefined;
  private date:number= Date.now();
  @Output("updateProjects") private updateProjects: EventEmitter<any> = new EventEmitter();

  constructor(private service: RestapiService, private router: Router, public snackBar: MatSnackBar){
    // Gets current logged in user id
    const uid = sessionStorage.getItem("userid");
    if(uid!=null){
      this.userid=parseInt(uid);
    }
  }
  
  public get project() : Project {
    return this._project;
  }  
  public get leads() : string[] {
    return this._leads;
  }  
  public get members() : string[] {
    return this._members;
  }
  @Input() public set project(project : Project) {
    this._project = project;
  }    
  public get isOwner() : boolean {
    return this._isOwner;
  }
  @Input() public set isOwner(isOwner : boolean) {
    this._isOwner = isOwner;
  }    
  public get canEdit() : boolean {
    return this._canEdit;
  }  
  public get canRemove() : boolean {
    return this._canRemove;
  }  
  public get logo() : string|undefined {
    return this._logo;
  }

  public ngOnInit(): void {
    // Make card logo
    if(this._project.name!==undefined){
      this._logo=this._project.name.toUpperCase().split("")[0];
    }    
    // Get users that are part of this project
    this.getUsers(this._project.teamLeads,this._project.teamMembers);
    if(this._project.teamLeads!==undefined){
      this._canEdit=(this._project.teamLeads.includes(this.userid));
      console.log("canEdit",this._canEdit);
    }
    
    this._canRemove=(this._project.teamLeads[0]==this.userid);
  }

  public getUsers(l_ids:any,m_ids:any): void {
    // Find users that are leads
    for(var id of l_ids){
      id = id.toString();
      this.service.getUserById(id).subscribe({
        next: (response) => {
            if(response.username !== undefined){
              // Add leads' username to list
              this._leads.push(response.username);
            }
        },
      });
    }
    // Find users that are team members
    for(var id of m_ids){
      id = id.toString();
      this.service.getUserById(id).subscribe({
        next: (response) => {
            if(response.username !== undefined){
              // Add team members' username to list
              this._members.push(response.username);
            }
        },
      });
    }
  }

  // Router link for editing
  public editClient(pid : number,cid : number) {
    const link = "main/"+cid+"/"+pid+"/p/edit"
    this.router.navigate([link]);
  }

  // Call Delete service
  public deleteClient(id: number): void {
    this.service.deleteClient(id);
  }

  // Call Delete action
  public deleteConfirm(name : string, id : number) {
    if(confirm("Are you sure you want to delete " + name))
    {
      this.service.deleteProject(id).subscribe({
        next: (response) => {
          console.log(response);
          this.updateProjects.emit();
          this.openSnackBar(name+" deleted successfully");
        },
        error: (error) => {
          console.log(error);
          this.openSnackBar(name+" deleted failed");
        }
      });
    }
  }

  // Alert to confirm task to user 
  public openSnackBar(message: string) {
    this.snackBar.open(message, "OK", {
      duration: 2000,
      });
  }
}