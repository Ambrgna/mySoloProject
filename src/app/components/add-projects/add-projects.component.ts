import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Client } from 'src/app/entities/client';
import { Project } from 'src/app/entities/project';
import { User } from 'src/app/entities/user';
import { RestapiService } from 'src/app/services/restapi.service';
import { UsersapiService } from 'src/app/services/usersapi.service';

@Component({
  selector: 'app-add-projects',
  templateUrl: './add-projects.component.html',
  styleUrls: ['./add-projects.component.css']
})
export class AddProjectsComponent {
  private _client!: Client;
  private _leads: User[] = [];
  private _members: User[] = [];
  private _hasAccess:boolean = false;

  private _owner!:User;

  private _isOwner:boolean=false;

  private _project: Project=new Project();

  private _editing: boolean = false;
  private _action:string="Add";
  private _projectForm!: FormGroup;

  private editid:any;
  private userid!:any;
  private routeid:string|null;

  constructor(private userService: UsersapiService,private service: RestapiService, public snackBar: MatSnackBar, private route: ActivatedRoute, private router: Router) {
    this._project=new Project();    
    this._client=new Client();
    
    // Gets current user headers for restful api
    const headers = sessionStorage.getItem("headers");
    this.userid = sessionStorage.getItem("userid");
    this.userid=parseInt(this.userid)
    
    this.routeid = this.route.snapshot.paramMap.get('clientid');
    
    // Gets Users for leads and members dropdowns
    this.getUsers();

    // Gets Client info add page so it is clear what client it being added to
    this.getClient(this.routeid);
    
    // Navigates to login if user is not logged in
    if(headers == null){
      this.router.navigate(["/login"]);
    }

    // Define Project FormGroup
    this._projectForm = new FormGroup({
      name: new FormControl(this._project?.name, [
        Validators.required
      ]),
      teamLeads: new FormControl({value: this._project?.teamLeads, disabled: true}, [
        Validators.required
      ]),
      teamMembers: new FormControl(this._project?.teamMembers),
      description: new FormControl(this._project?.description)
    });

    // Checks to see if client is being edited
    this.editid = this.route.snapshot.paramMap.get('projectid');
    console.log(this.editid);
    
    if(this.editid!==undefined&&this.editid!==null){
      this._editing =true;
      this.edit();
    }
    // Changes form is a new project is being added
    else{
      this._isOwner=true;
      this._projectForm.controls['teamLeads'].enable();
      this._project=this._projectForm.value;
    }
  }

  public get client() : Client {
    return this._client;
  }
  public get leads() : User[] {
    return this._leads;
  }
  public get members() : User[] {
    return this._members;
  }
  public get hasAccess() : boolean {
    return this._hasAccess;
  }
  public get owner() : User {
    return this._owner;
  }
  public get isOwner() : boolean {
    return this._isOwner;
  }
  public get project() : Project {
    return this._project;
  }
  public get editing() : boolean {
    return this._editing;
  }
  public get action() : string {
    return this._action;
  }
  public get projectForm() : FormGroup {
    return this._projectForm;
  }

  public get name(): any { return this._projectForm.get('name');}
  public get teamLeads(): any { return this._projectForm.get('teamLeads');}
  public get teamMembers(): any { return this._projectForm.get('teamMembers');}
  public get description(): any { return this._projectForm.get('description');}
  
  public getClient(routeid: string | null) {
    this.service.getClientById(routeid).subscribe({
      next: (response) => this._client=response,
      error: (error) => console.log(error),
    });
  }
  
  public getUsers(): void {          
    this._leads = [];
    this._members =[];
    this.service.getUsers().subscribe({
      next: (response: User[]) => {
        for(const user of response){
          if(this._isOwner){
            console.log("test");
            if(user.userId==this.userid){
              
              this._owner=user;
            }
            if(user.role == "ROLE_LEAD"&&user.userId!=this.userid){
              this._leads.push(user);
            } else if(user.role != "ROLE_LEAD") {
              this._members.push(user);
            }
          } else {
            if(user.role == "ROLE_LEAD"){
              this._leads.push(user);
            } else {
              this._members.push(user);
            }
          }
        }
        console.log(this._leads);
        console.log(this._members);
        if(this._isOwner&&!this._editing){          
          this._projectForm.patchValue({
            teamLeads:[this._owner.userId]
          });
          console.log("value",this._projectForm.value);
        }
      },
    });
    
  }

  public edit():void{    
    // Change action so it is clear to the user what is happening
    this._action = "Edit";

    // Populate form with project info from database 
    this.service.getProjectById(this.editid).subscribe({
      next: (response) => {
        if(response.teamLeads?.includes(this.userid)){
          this.getUsers();
          this._hasAccess=true;
          console.log(this._hasAccess);
          console.log(response);
          this._projectForm.patchValue({
            name: response.name,
            teamLeads: response.teamLeads,
            teamMembers: response.teamMembers,
            description: response.description,
          });
          this._project=this._projectForm.value;
          console.log("teamLeads",response.teamLeads);
          if(response.teamLeads[0]==this.userid){
            this._isOwner=true;
            this._projectForm.controls['teamLeads'].enable();
          }
          console.log("_isOwner",this._isOwner);
          
        } 
      },
        error: (error) => console.log(error),
      });
  }
  // Submit Form
  public onSubmit() { 
    const link:string = "/main/"+this.routeid+"/projects";

    // Prepare objects for post 
    this._projectForm.controls['teamLeads'].enable();
    console.log("project",this._project.teamLeads);
    this._project=this._projectForm.value;
    console.log("value",this._projectForm.value);
    
    console.log(this.routeid);
    if(this.routeid!==null){
      this._project.clientId = parseInt(this.routeid);
    }
    
    console.log(this._project);
    // Updates item in database if editing 
    if(this._editing){ 
      this._project.projectId=parseInt(this.editid);
      console.log(this._project);
      this.service.updateProject(this._project).subscribe({
        next: (response) => {
          this.openSnackBar("Project edit successfully");
          this.router.navigate([link]);
      },
        error: (error) => this.openSnackBar("Project edit failed"),
      });
    } 
    // Adds item in database if adding 
    else {
      this.service.postProject(this._project).subscribe({
        next: (response) =>
        { 
          console.log(response);
          this.openSnackBar("Project posted successfully");
          this.router.navigate([link]);
        },
        error: (error) => {
          console.log(error);
          this.openSnackBar("Project posted failed");
        },
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