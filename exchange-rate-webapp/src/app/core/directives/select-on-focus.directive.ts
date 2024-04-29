import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appSelectOnFocus]',
  standalone: true
})
export class SelectOnFocusDirective {

  constructor(private el: ElementRef) { }

  @HostListener('focus', ['$event.target'])
  onFocus(target: HTMLInputElement): void {
    target.select();
  }

  @HostListener('click', ['$event.target'])
  onClick(target: HTMLInputElement): void {
    target.select();
  }

}
