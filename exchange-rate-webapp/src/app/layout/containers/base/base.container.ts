import { Component } from '@angular/core';
import { FooterComponent, HeaderComponent } from "@ibk/layout/components";
import { RouterOutlet } from "@angular/router";

@Component({
  selector: 'ibk-base-container',
  standalone: true,
  imports: [
    FooterComponent,
    HeaderComponent,
    RouterOutlet
  ],
  templateUrl: './base.container.html',
  styles: ``
})
export class BaseContainer {

}
