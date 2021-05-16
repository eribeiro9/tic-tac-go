import { Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { fromEvent, merge, of } from 'rxjs';
import { mapTo } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PwaService {

  public updateAvailable: boolean = false;

  constructor(
    private swUpdate: SwUpdate,
  ) {
    this.swUpdate.available.subscribe(event => {
      this.updateAvailable = !!event;
    });
  }

  public watchNetwork() {
    return merge(
      fromEvent(window, 'offline').pipe(mapTo(false)),
      fromEvent(window, 'online').pipe(mapTo(true)),
      of(navigator.onLine),
    );
  }

}
