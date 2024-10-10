import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  username: any="";
  password:any="";
  rememberMe=false

  login(){
    console.log("username",this.username)
    console.log("rememberMe",this.rememberMe)
    console.log("password",this.password)
  }
}
