import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Client } from 'src/app/entities/client';
import { Project } from 'src/app/entities/project';
import { RestapiService } from 'src/app/services/restapi.service';

@Component({
  selector: 'app-add-projects',
  templateUrl: './add-projects.component.html',
  styleUrls: ['./add-projects.component.css']
})
export class AddProjectsComponent {

  client!: Client;

  project!: Project;
  
  control = new FormControl();

  editing: boolean = false;
  editid:any;
  userid!:any;
  routeid:string|null;
  action:string="Add";

  projectForm!: FormGroup;

  constructor(private service: RestapiService, public snackBar: MatSnackBar, private route: ActivatedRoute, private router: Router) {
    this.project=new Project();    
    this.client=new Client();
    this.routeid = this.route.snapshot.paramMap.get('clientid');
    
    const headers = sessionStorage.getItem("headers");
    
    this.getClient(this.routeid);
    
    if(headers == null){
      this.router.navigate(["/login"]);
    }

    this.projectForm = new FormGroup({
      name: new FormControl(this.project?.name, [
        Validators.required
      ]),
      description: new FormControl(this.project?.description)
    });
    this.editid = this.route.snapshot.paramMap.get('projectid');
    console.log(this.editid);
    
    if(this.editid!==undefined&&this.editid!==null){
      this.editing =true;
      this.edit();
    }else{
      this.project=this.projectForm.value;
    }
    
  }


  get name(): any { return this.projectForm.get('name');}
  get price(): any { return this.projectForm.get('price');}
  get category(): any { return this.projectForm.get('category');}
  get description(): any { return this.projectForm.get('description');}
  
  getClient(routeid: string | null) {

    this.service.getClientById(routeid).subscribe({
      next: (response) => this.client=response,
      error: (error) => console.log(error),
    });
  }
  
  edit():void{
    this.action = "Edit";

    this.service.getProjectById(this.editid).subscribe({
      next: (response) => {
        console.log(response);
      this.projectForm.patchValue({
        name: response.name,
        description: response.description,
      });
      this.project=this.projectForm.value;
    },
      error: (error) => console.log(error),
    });
  }

  onSubmit() { 
    this.project=this.projectForm.value;
    
    if(this.routeid!==null){
      this.project.clientId = parseInt(this.routeid);
    }
    
    console.log(this.project);
      if(this.editing){ 
        this.project.projectId=parseInt(this.editid);
        console.log(this.project);
        this.service.updateProject(this.project).subscribe({
          next: (response) => {
            this.openSnackBar("Project edit successfully");
            this.router.navigate(["/main"]);
        },
          error: (error) => this.openSnackBar("Project edit failed"),
        });
      } else {
        this.service.postProject(this.project).subscribe({
          next: (response) =>
          { 
            console.log(response);
            this.openSnackBar("Project posted successfully");
            this.router.navigate(["/main"]);
          },
          error: (error) => {
            console.log(error);
            this.openSnackBar("Project posted failed");
          },
        });
      }        
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, "OK", {
      duration: 2000,
    });
  }

} 