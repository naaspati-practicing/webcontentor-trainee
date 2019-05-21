import { Directive, OnInit, Input, ElementRef } from '@angular/core';

@Directive({
  selector: '[cardType]'
})
export class CardTypeDirective implements OnInit {
  @Input() cardType;
  @Input() increaseClass = 'increase';
  @Input() decreaseClass = 'decrease';

  constructor(
    private el: ElementRef
  ) { }

  ngOnInit(): void {
    if(this.cardType || this.cardType === 0) {
      const el = this.el.nativeElement.classList;
      if(this.cardType > 0) {
        el.add(this.increaseClass);
        el.remove(this.decreaseClass);
      } else if(this.cardType < 0) {
        el.remove(this.increaseClass);
        el.add(this.decreaseClass); 
      } else {
        el.remove(this.increaseClass);
        el.remove(this.decreaseClass);
      }
    }
  }

}
