import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  model: any = {};

  constructor(private authService: AuthService, private alertify: AlertifyService, private router: Router) { }

  ngOnInit() {
  }

  login() {
    this.authService.login(this.model).subscribe(data => {
      // Here we invoke onNext method.
      console.log('logged in succesfully');
      this.alertify.success('logged in succesfully');

    }, error => {
      console.log('failed to log in');
      console.log(error);
      // this.alertify.error(error);
      this.alertify.error('Failed to log in!');
      // Here we invoke onCompleted method. It is invoked after it has called onNext.
    }, () => {
      this.router.navigate(['/members']);

    });
    console.log(this.model);
  }

  logout() {
    this.authService.userToken = null;
    localStorage.removeItem('token');
    console.log('logged out');
    this.alertify.message('logged out');
    this.router.navigate(['/home']);
  }

  loggedIn() {
    return this.authService.loggedIn();
  }

}
