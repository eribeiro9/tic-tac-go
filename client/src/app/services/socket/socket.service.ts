import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  private socket?: WebSocketSubject<any>;

  public onMessage = new Subject<any>();
  public onDisconnect = new Subject<void>();

  constructor() { }

  public connect(settings: any): Observable<any> {
    this.socket = webSocket(environment.websocketURL);
    this.socket.pipe(
      tap(message => this.onMessage.next(message)),
    ).subscribe();
    this.socket.next({ message: 'sendMessage', type: 'settings', ...settings });
    return this.onMessage;
  }

  public send(type: string, body: any = {}) {
    if (this.socket) {
      this.socket.next({ message: 'sendMessage', type, ...body });
    }
  }

  public disconnect() {
    if (this.socket) {
      this.socket.complete();
      delete this.socket;
    }
  }
}
