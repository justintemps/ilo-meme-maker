import { Component, ElementRef, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-canvas-options',
  templateUrl: './canvas-options.component.html',
  styleUrls: ['./canvas-options.component.scss'],
})
export class CanvasOptionsComponent implements OnInit {
  // Get a reference to the Canvas element
  @Input() canvas: ElementRef<HTMLCanvasElement>;

  downloadCard() {
    const img = this.canvas.nativeElement.toDataURL('image/png');
    document.write('<img src="' + img + '"/>');
  }

  constructor() {}

  ngOnInit(): void {}
}
