import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss'],
})
export class LogoutComponent implements OnInit {
  constructor(private router: Router, private GlobalService: GlobalService) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.GlobalService.access_token = null;
      this.router.navigateByUrl('/');
    }, 1000);
  }
}
