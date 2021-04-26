import {
  Component,
  ElementRef,
  Input,
  Output,
  OnInit,
  EventEmitter,
} from '@angular/core';
import * as download from 'downloadjs';
import { CardProvider } from '../card-provider.service';

@Component({
  selector: 'app-canvas-options',
  templateUrl: './canvas-options.component.html',
  styleUrls: ['./canvas-options.component.scss'],
})
export class CanvasOptionsComponent implements OnInit {
  // Get a reference to the Canvas element
  // We're only going to use this to export the image
  // Other canvas operations shoud stay in the <app-canvas> component
  @Input() canvas: ElementRef<HTMLCanvasElement>;

  @Output() clearCanvasEvent: EventEmitter<string> = new EventEmitter();

  @Output()
  addImageEvent: EventEmitter<Event> = new EventEmitter();

  constructor(private cardService: CardProvider) {}

  handleAddImage(event: Event) {
    this.addImageEvent.emit(event);
  }

  handleClearCanvas() {
    this.cardService.initialize();
    this.clearCanvasEvent.emit('clearCanvas');
  }

  handleDownload() {
    const img = this.canvas.nativeElement.toDataURL('image/png');
    download(img, 'quote_card', 'image/png');
  }

  ngOnInit(): void {}
}
