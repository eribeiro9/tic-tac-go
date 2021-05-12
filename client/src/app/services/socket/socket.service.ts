import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  private connection?: WebSocket;

  public onConnect = new Subject<void>();
  public onDisconnect = new Subject<void>();

  constructor() { }

  public startConnection(): Observable<void> {
    this.connection = new WebSocket(environment.websocketURL);
    this.connection.onopen = () => this.onConnect.next();
    this.connection.onclose = () => this.onDisconnect.next();
    return this.onConnect;
  }
}
