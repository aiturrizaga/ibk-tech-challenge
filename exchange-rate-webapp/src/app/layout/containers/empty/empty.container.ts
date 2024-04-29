import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from "@angular/router";
import { FooterComponent } from "@ibk/layout/components";

@Component({
  selector: 'ibk-empty-container',
  standalone: true,
  imports: [
    RouterOutlet,
    FooterComponent,
    RouterLink
  ],
  templateUrl: './empty.container.html',
  styles: ``
})
export class EmptyContainer {

}
