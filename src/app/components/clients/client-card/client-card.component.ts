import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Client } from 'src/app/entities/client';
import { RestapiService } from 'src/app/services/restapi.service';

@Component({
  selector: 'app-client-card',
  templateUrl: './client-card.component.html',
  styleUrls: ['./client-card.component.css']
})
export class ClientCardComponent implements OnInit {
  @Input() client!: Client;
  userid!: number;
  isOwner:boolean=false;
  logo:string|undefined;
  date:number= Date.now();
  @Output("updateClients") updateClients: EventEmitter<any> = new EventEmitter();


  constructor(private service: RestapiService, private router: Router, public snackBar: MatSnackBar){
    const uid = localStorage.getItem("userid");
    if(uid!=null){
      this.userid=parseInt(uid);
    }
  }
  ngOnInit(): void {
    if(this.client.name!==undefined){
      this.logo=this.client.name.toUpperCase().split("")[0];
    }    
    if(this.client.userId==this.userid){
      this.isOwner=true;
    }
  }

  editClient(id : number) {
    const link = "main/"+id+"/c/edit"
    this.router.navigate([link]);
  }

  public deleteClient(id: number): void {
    this.service.deleteClient(id);
  }

  public deleteConfirm(name : string, id : number) {
    if(confirm("Are you sure you want to delete " + name))
    {
      this.service.deleteClient(id).subscribe({
        next: (response) => {
          console.log(response);
          this.updateClients.emit();
          this.openSnackBar(name+" deleted successfully");
        },
        error: (error) => {
          console.log(error);
          this.openSnackBar(name+" deleted failed");
        }
      });
    }
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, "OK", {
      duration: 2000,
      });
  }
}
