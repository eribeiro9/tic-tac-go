import { Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';

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

}
