import {
  Component,
  ElementRef,
  Input,
  Output,
  OnInit,
  EventEmitter,
} from '@angular/core';
import * as download from 'downloadjs';
import { StorageProvider } from '../storage-provider.service';
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

  constructor(
    private cardService: CardProvider,
    private storageService: StorageProvider
  ) {}

  handleAddImage(event: Event) {
    this.addImageEvent.emit(event);
  }

  handleClearCanvas() {
    this.cardService.initialize();
    this.clearCanvasEvent.emit('clearCanvas');
  }

  // Returns the canvas as a base64 string which can be rendered as an image
  snapshot(): string {
    const img = this.canvas.nativeElement.toDataURL('image/png');
    return img;
  }

  handleDownload() {
    const img = this.snapshot();
    download(img, 'quote_card', 'image/png');
  }

  handleSave() {
    const img = this.snapshot();
    this.cardService.updateCardImg({ src: img });
    this.storageService.saveCard();
  }

  ngOnInit(): void {}
}
