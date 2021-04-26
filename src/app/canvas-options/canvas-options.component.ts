import { Component, ElementRef, Input, OnInit } from '@angular/core';
import * as download from 'downloadjs';

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
    download(img, 'quote_card', 'image/png');
  }

  constructor() {}

  ngOnInit(): void {}
}
