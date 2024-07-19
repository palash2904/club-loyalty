import { Component } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent {

  isMenuActive = false;

  openMenu(isMenuActive: boolean) {
    this.isMenuActive = isMenuActive; // Update menu active state
  }

  closeMenu(isMenuActive: boolean) {
    this.isMenuActive = isMenuActive; // Update menu active state
  }



}
