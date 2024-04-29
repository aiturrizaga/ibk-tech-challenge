import { Component } from '@angular/core';

@Component({
  selector: 'ibk-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.component.html',
  styles: ``
})
export class FooterComponent {
  year: number = new Date().getFullYear();
}
