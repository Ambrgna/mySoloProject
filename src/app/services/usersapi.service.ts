import { Injectable } from '@angular/core';
import { User } from '../entities/user';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RestapiService } from './restapi.service';

@Injectable({
  providedIn: 'root'
})
export class UsersapiService {
  apiUrl: string = "http://localhost:9080/";
  headers:any;
  user?:User;

  constructor(private http: HttpClient, private service: RestapiService) { }

  public login(auth: any){
    const authURL:string = this.apiUrl+"authentication";
    const username = auth.username;
    const password = auth.password;
    this.headers = new HttpHeaders({Authorization: 'Basic '+btoa(username+":"+password)});
    
    const headers = this.headers;
    console.log(username);
    
    sessionStorage.setItem("headers", btoa(username+":"+password));
    this.service.getHeader(this.headers);

    return this.http.get(authURL, {headers, responseType: 'text' as 'json'});
  }

  public logout(){
    const url:string = this.apiUrl+"logout";
    
    const headers = this.headers;
    
    sessionStorage.removeItem("userid")
    sessionStorage.removeItem("headers");
    
    this.service.removeHeader();

    return this.http.get(url, {headers, responseType: 'text' as 'json'});
  }

  public async userid(username:string):Promise<string>{
    var uid! :string;
    const usernameURL:string = this.apiUrl+"users/";
    const u:any = await this.http.get<User>(usernameURL+username, { headers: this.headers}).toPromise();
    uid = u.userId.toString();
    return uid;
  }
  public getUserById(id:string){
    return this.http.get<User>(this.apiUrl+"users/id/"+id, { headers: this.headers});
  }

  public getUser(user: string){
    return this.http.get<User>(this.apiUrl+"users/"+user);
  }
  
  public addUser(user:User){    
    return this.http.post(this.apiUrl+"users", user);
  }
}
