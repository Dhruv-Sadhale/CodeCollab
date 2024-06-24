import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appAutoExpand]'
})
export class AutoExpandDirective {

  constructor(private elementRef: ElementRef, private renderer: Renderer2) {}

  @HostListener('input', ['$event.target'])
  onInput(textArea: HTMLTextAreaElement): void {
    this.adjustTextAreaHeight(textArea);
  }

  adjustTextAreaHeight(textArea: HTMLTextAreaElement): void {
    textArea.style.height = 'auto';
    textArea.style.height = `${textArea.scrollHeight}px`;
  }
}
