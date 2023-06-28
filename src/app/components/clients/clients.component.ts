import { Component } from '@angular/core';
import { Client } from 'src/app/entities/client';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css']
})
export class ClientsComponent {
  clients: Client[] = [];
  constructor(){
    this.clients?.push(new Client("1")); 
    this.clients?.push(new Client("2")); 
    console.log(this.clients);
    
  }

}
