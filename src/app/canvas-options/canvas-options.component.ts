import {
  Component,
  ElementRef,
  Input,
  Output,
  OnInit,
  EventEmitter,
  OnDestroy,
} from '@angular/core';
import * as download from 'downloadjs';
import { StorageProvider } from '../storage-provider.service';
import {
  CardProvider,
  Speaker,
  Quote,
  SpeakerImg,
  Card,
} from '../card-provider.service';
import { merge, Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-canvas-options',
  templateUrl: './canvas-options.component.html',
  styleUrls: ['./canvas-options.component.scss'],
})
export class CanvasOptionsComponent implements OnInit, OnDestroy {
  // Get a reference to the Canvas element
  // We're only going to use this to export the image
  // Other canvas operations shoud stay in the <app-canvas> component
  @Input() canvas: ElementRef<HTMLCanvasElement>;

  @Output() clearCanvasEvent: EventEmitter<string> = new EventEmitter();

  @Output()
  addImageEvent: EventEmitter<Event> = new EventEmitter();

  // Handle subscription to the current card
  cardSrc: Observable<Quote | Speaker | SpeakerImg>;
  cardSub: Subscription;
  card: Card;

  // Flags for disabling buttons
  canvasHasImage: boolean;
  cardHasID: boolean;
  cardHasReqFields: boolean;

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

  handleNew() {
    this.cardService.createCard();
    this.clearCanvasEvent.emit('clearCanvas');
  }

  ngOnInit(): void {
    this.cardSrc = merge(
      this.cardService.speaker,
      this.cardService.speakerImg,
      this.cardService.quote
    );
    this.cardSub = this.cardSrc.subscribe(() => {
      this.card = this.cardService.getCard();
      this.canvasHasImage = !!this.card.speakerImg.src;
      this.cardHasID = !!this.card.id;
      this.cardHasReqFields =
        !!this.card.speakerImg.src && !!this.card.speaker.name;
    });
  }

  ngOnDestroy(): void {
    this.cardSub.unsubscribe();
  }
}
