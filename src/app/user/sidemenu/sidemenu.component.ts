import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidemenu',
  templateUrl: './sidemenu.component.html',
  styleUrls: ['./sidemenu.component.css']
})
export class SidemenuComponent {

  constructor(private router: Router) { }

  isActive(route: string): boolean {
    return this.router.isActive(route, true);
  }

}
