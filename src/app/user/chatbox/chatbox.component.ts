import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-chatbox',
  templateUrl: './chatbox.component.html',
  styleUrls: ['./chatbox.component.css']
})
export class ChatboxComponent {

  roomId: any;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    // Access the route parameters
    this.route.params.subscribe(params => {
      this.roomId = params['roomId']; // Get the roomId parameter from the route
      // You can now use this.roomId to fetch data or perform any other actions based on the roomId
      console.log('Room ID:', this.roomId);
    });
  }

}
