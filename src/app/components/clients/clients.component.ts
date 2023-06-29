import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Client } from 'src/app/entities/client';
import { RestapiService } from 'src/app/services/restapi.service';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css']
})
export class ClientsComponent {
  clients: Client[] = [];
  constructor(private service: RestapiService, private route:ActivatedRoute){
    this.getClients();
    console.log(this.clients);
    
  }
  updateClients(){
    this.clients=[];
    this.getClients();
  }

  public getClients(): void {
    this.service.getClients().subscribe({

      next: (response: Client[]) => {
        console.log(response);
        for(const restaurant of response)
        {
          if(restaurant.disabled == false)
          {
            this.clients.push(restaurant)
          }
        }
      },
      error: (e) => alert(e.message)
    })
  }

}
