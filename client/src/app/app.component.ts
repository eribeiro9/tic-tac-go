import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SocketService } from './services/socket/socket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {

  constructor(
    private readonly router: Router,
    private readonly socketService: SocketService,
  ) { }

  ngOnInit() {
    this.socketService.onDisconnect.subscribe(() => this.router.navigate(['']));
  }

}
