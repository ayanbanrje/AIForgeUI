import { Component, OnInit } from '@angular/core';
import { SessionService } from '../../services/session.service';
import * as CryptoJS from "crypto-js";
import { Router } from '@angular/router';
import { LoadingService } from '../../services/loading.service';
import { AuthService } from '../../services/auth/auth.service';
import { FakeSessionServiceService } from '../../services/fake-session-service.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  rememberMe = false
  pin;
  newusername;
  newpassword;
  CodeDeliveryDetails;
  termsconditionData;
  emailValidation;
  username;
  usernameterms;
  forgotconformationMessage;
  termsconditionObject;
  forgotPopup: boolean = false;
  getCodePopup: boolean = false;
  setCodePopup: boolean = false;
  termscondition: boolean = false;
  forgotconformation: boolean = false;
  password;
  constructor(
    public session: SessionService,
    private router: Router,
    private loading: LoadingService,
    private auth: AuthService,
    private fakesessionService: FakeSessionServiceService
  ) { }

  ngOnInit() {
    if (this.auth.isAuthenticated()) {
      this.session.resetSession();
      this.loading.resetDataHolder();
    } else {
      this.router.navigate(['/dashboard']);
    }
  }


  async login() {
    this.session.authError = null;
    if (this.username && this.password) {
      this.fakesessionService.login(this.username, this.password).subscribe(
        response => {
          console.log("respinse->>>>>>>>>>", response)
          this.router.navigate(['/'])
        },
        error => {
          console.log("error", error)
        }
      );
      
      // const session = await this.session.login({ username: this.username, password: this.password });
      // console.log("session",session)
      // if(session){
      //   this.router.navigate(['/'])
      // }

    }
  }


}