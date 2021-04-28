import {
  Component,
  AfterViewInit,
  ViewChild,
  ElementRef,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { CanvasTextWrapper } from 'canvas-text-wrapper';

import {
  CardProvider,
  Branding,
  Quote,
  Speaker,
} from '../card-provider.service';

// Set up a few constants
const LOGO = '/assets/ilo-logo-white-en-gb.svg';
const RESIZER_RADIUS = 3;
const RR = RESIZER_RADIUS * RESIZER_RADIUS;

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss'],
})
export class CanvasComponent implements AfterViewInit, OnInit, OnDestroy {
  // Gets a reference to the canvas element
  @ViewChild('memeCanvas') canvas: ElementRef<HTMLCanvasElement>;
  context: CanvasRenderingContext2D;

  // Speaker Image Properties
  speakerImg = new Image();
  speakerImgLoaded = false;
  imageX = 50;
  imageY = 50;
  imageWidth: number;
  imageHeight: number;

  // Values we'll use for dragging and resizing operations on the Speaker Image
  offsetX: number;
  offsetY: number;
  startX: number;
  startY: number;
  mouseX: number;
  mouseY: number;
  imageRight: number;
  imageBottom: number;
  draggingResizer = -1;
  draggingImage = false;

  // Logo image
  logoImg = new Image();

  // Data that comes from the service
  brandingSub: Subscription;
  quoteSub: Subscription;
  speakerSub: Subscription;
  speakerImgSub: Subscription;
  branding: Branding;
  quote: Quote;
  speaker: Speaker;

  constructor(
    private cardProvider: CardProvider,
    private cd: ChangeDetectorRef
  ) {}

  // @TODO: handle window resize handlers to fire this so the coord system won't break
  updateOffsets() {
    const boundingBox = this.canvas.nativeElement.getBoundingClientRect();
    this.offsetX = boundingBox.left;
    this.offsetY = boundingBox.top;
  }

  // Handles addImage events from canvas-options
  handleAddImage(inputEvent: Event) {
    const reader = new FileReader();
    const input = inputEvent.target as HTMLInputElement;
    reader.onload = (readerEvent: Event) => {
      const readerTarget = readerEvent.target as FileReader;
      this.cardProvider.updateSpeakerImg({ src: readerTarget.result });
      // this.speakerImg.src = readerTarget.result as string;
    };
    if (input.files) {
      reader.readAsDataURL(input.files[0]);
    }
  }

  // Main draw function renders the card with data from the service
  draw(withAnchors: boolean, withBorders: boolean) {
    // clear the canvas
    this.clearCanvas();

    // draw the image
    this.context.drawImage(
      this.speakerImg,
      0,
      0,
      this.speakerImg.width,
      this.speakerImg.height,
      this.imageX,
      this.imageY,
      this.imageWidth,
      this.imageHeight
    );

    // Draw the background
    if (this.branding.background) {
      this.drawBackground();
    }

    // Draw the logo
    if (this.branding.logo) {
      this.drawLogo();
    }

    // Write the Quote text
    this.drawQuote();

    // Write the Speaker text
    this.drawSpeaker();

    // Write the speaker's title
    this.drawTitle();

    // optionally draw the draggable anchors
    // but only if a speakerImg has been loaded
    if (withAnchors && this.speakerImgLoaded) {
      this.drawDragAnchor(this.imageX, this.imageY);
      this.drawDragAnchor(this.imageRight, this.imageY);
      this.drawDragAnchor(this.imageRight, this.imageBottom);
      this.drawDragAnchor(this.imageX, this.imageBottom);
    }

    // optionally draw the connecting anchor lines
    if (withBorders) {
      this.context.beginPath();
      this.context.moveTo(this.imageX, this.imageY);
      this.context.lineTo(this.imageRight, this.imageY);
      this.context.lineTo(this.imageRight, this.imageBottom);
      this.context.lineTo(this.imageX, this.imageBottom);
      this.context.closePath();
      this.context.stroke();
    }
  }

  clearCanvas() {
    this.context.clearRect(
      0,
      0,
      this.canvas.nativeElement.width,
      this.canvas.nativeElement.height
    );
  }

  // Draws the background
  drawBackground() {
    this.context.beginPath();
    this.context.moveTo(0, 0);
    this.context.lineTo(0, 335);
    this.context.lineTo(430, 335);
    this.context.lineTo(280, 0);
    this.context.closePath();
    this.context.fillStyle = '#1e2dbe';
    this.context.fill();
  }

  // Draws the quote
  drawQuote() {
    this.context.fillStyle = '#fff';
    CanvasTextWrapper(this.canvas.nativeElement, this.quote.content, {
      offsetY: 100,
      offsetX: 50,
      maxWidth: 265,
    });
  }

  // Draws the speaker
  drawSpeaker() {
    this.context.fillStyle = '#fff';
    CanvasTextWrapper(this.canvas.nativeElement, this.speaker.name, {
      offsetY: 260,
      offsetX: 50,
      maxWidth: 300,
    });
  }

  // Draws the title
  drawTitle() {
    this.context.fillStyle = '#fff';
    CanvasTextWrapper(this.canvas.nativeElement, this.speaker.title, {
      offsetY: 280,
      offsetX: 50,
      maxWidth: 300,
    });
  }

  // Draws the logo
  drawLogo() {
    this.context.drawImage(this.logoImg, 10, 10, 114, 46);
  }

  // Draws anchors for resizing
  drawDragAnchor(x: number, y: number) {
    this.context.beginPath();
    this.context.arc(x, y, RR, 0, Math.PI * 2, false);
    this.context.closePath();
    this.context.fillStyle = '#fa3c4b';
    this.context.fill();
  }

  // See if we clicked on an anchor
  anchorHitTest(x: number, y: number) {
    let dx, dy;

    // top-left
    dx = x - this.imageX;
    dy = y - this.imageY;
    if (dx * dx + dy * dy <= RR) {
      return 0;
    }
    // top-right
    dx = x - this.imageRight;
    dy = y - this.imageY;
    if (dx * dx + dy * dy <= RR) {
      return 1;
    }
    // bottom-right
    dx = x - this.imageRight;
    dy = y - this.imageBottom;
    if (dx * dx + dy * dy <= RR) {
      return 2;
    }
    // bottom-left
    dx = x - this.imageX;
    dy = y - this.imageBottom;
    if (dx * dx + dy * dy <= RR) {
      return 3;
    }
    return -1;
  }

  // See if we clicked on the draggable image
  hitImage(x: number, y: number) {
    return (
      x > this.imageX &&
      x < this.imageX + this.imageWidth &&
      y > this.imageY &&
      y < this.imageY + this.imageHeight
    );
  }

  handleMouseDown(e: MouseEvent) {
    this.startX = e.clientX - this.offsetX;
    this.startY = e.clientY - this.offsetY;
    this.draggingResizer = this.anchorHitTest(this.startX, this.startY);
    this.draggingImage =
      this.draggingResizer < 0 && this.hitImage(this.startX, this.startY);
  }

  handleMouseUp() {
    this.draggingResizer = -1;
    this.draggingImage = false;
    this.draw(true, false);
  }

  handleMouseOut() {
    this.handleMouseUp();
  }

  handleMouseMove(e: MouseEvent) {
    if (this.draggingResizer > -1) {
      this.mouseX = e.clientX - this.offsetX;
      this.mouseY = e.clientY - this.offsetY;
      // resize the image
      switch (this.draggingResizer) {
        case 0:
          //top-left
          this.cardProvider.updateSpeakerImg({
            imageX: this.mouseX,
            imageWidth: this.imageRight - this.mouseX,
            imageY: this.mouseY,
            imageHeight: this.imageBottom - this.mouseY,
          });
          break;
        case 1:
          //top-right
          this.cardProvider.updateSpeakerImg({
            imageY: this.mouseY,
            imageWidth: this.mouseX - this.imageX,
            imageHeight: this.imageBottom - this.mouseY,
          });
          break;
        case 2:
          //bottom-right
          this.cardProvider.updateSpeakerImg({
            imageWidth: this.mouseX - this.imageX,
            imageHeight: this.mouseY - this.imageY,
          });
          break;
        case 3:
          //bottom-left
          this.cardProvider.updateSpeakerImg({
            imageX: this.mouseX,
            imageWidth: this.imageRight - this.mouseX,
            imageHeight: this.mouseY - this.imageY,
          });
          break;
      }

      if (this.imageWidth < 25) {
        this.cardProvider.updateSpeakerImg({ imageWidth: 25 });
        // this.imageWidth = 25;
      }
      if (this.imageHeight < 25) {
        // this.imageHeight = 25;
        this.cardProvider.updateSpeakerImg({ imageHeight: 25 });
      }

      // set the image right and bottom
      this.imageRight = this.imageX + this.imageWidth;
      this.imageBottom = this.imageY + this.imageHeight;

      // redraw the image with resizing anchors
      this.draw(true, true);
    } else if (this.draggingImage) {
      this.mouseX = e.clientX - this.offsetX;
      this.mouseY = e.clientY - this.offsetY;

      // move the image by the amount of the latest drag
      let dx = this.mouseX - this.startX;
      let dy = this.mouseY - this.startY;

      this.cardProvider.updateSpeakerImg({
        imageX: this.imageX + dx,
        imageY: this.imageY + dy,
      });

      this.imageRight += dx;
      this.imageBottom += dy;

      // reset the startXY for next time
      this.startX = this.mouseX;
      this.startY = this.mouseY;

      // redraw the image with border
      this.draw(false, true);
    }
  }

  ngAfterViewInit(): void {
    // Set the canvas context when the window is ready
    this.context = this.canvas.nativeElement.getContext(
      '2d'
    ) as CanvasRenderingContext2D;

    this.updateOffsets();

    this.canvas.nativeElement.addEventListener('mousedown', (e) => {
      this.handleMouseDown(e);
    });

    this.canvas.nativeElement.addEventListener('mousemove', (e) => {
      this.handleMouseMove(e);
    });

    this.canvas.nativeElement.addEventListener('mouseup', (e) => {
      this.handleMouseUp();
    });

    this.canvas.nativeElement.addEventListener('mouseout', (e) => {
      this.handleMouseOut();
    });

    // We need this to make sure that the reference to the ViewChild
    // stays current when we pass it to child components. More info here:
    // https://angular.io/errors/NG0100
    this.cd.detectChanges();
  }

  count = 0;

  ngOnInit(): void {
    // Instantiate our images
    this.speakerImg.onload = () => {
      this.speakerImgLoaded = true;
      this.cardProvider.updateSpeakerImg({
        imageWidth: this.speakerImg.width,
        imageHeight: this.speakerImg.height,
      });

      this.imageRight = this.imageX + this.imageWidth;
      this.imageBottom = this.imageY + this.imageHeight;
      this.draw(true, false);
    };
    this.logoImg.src = LOGO;

    // Set up branding subscription
    this.brandingSub = this.cardProvider.branding.subscribe((branding) => {
      this.branding = branding;
      if (this.canvas && this.context) {
        this.draw(false, false);
      }
    });

    // Set up speaker info subscription
    this.speakerSub = this.cardProvider.speaker.subscribe((speaker) => {
      this.speaker = speaker;
      if (this.canvas && this.context) {
        this.draw(false, false);
      }
    });

    // Set up quote subscription
    this.quoteSub = this.cardProvider.quote.subscribe((quote) => {
      this.quote = quote;
      if (this.canvas && this.context) {
        this.draw(false, false);
      }
    });

    // Set up Speaker Image subscription
    this.speakerImgSub = this.cardProvider.speakerImg.subscribe(
      ({ src, imageX, imageY, imageWidth, imageHeight }) => {
        // Do an equality check on our src to see if it needs to be updated
        // If it doesn't, then don't update it or we'll cause an infinite loop.
        if (src && this.speakerImg.src !== src) {
          this.speakerImg.src = src;
        }

        // If we have an src, set values on the image
        if (src) {
          this.imageX = imageX;
          this.imageY = imageY;
          this.imageWidth = imageWidth;
          this.imageHeight = imageHeight;
          return;
        }

        // If we don't have an src, initialize values
        this.speakerImg.src = '';
        this.imageX = 50;
        this.imageY = 50;
        this.imageWidth = 0;
        this.imageHeight = 0;
      }
    );
  }

  ngOnDestroy(): void {
    this.brandingSub.unsubscribe();
    this.speakerSub.unsubscribe();
    this.quoteSub.unsubscribe();
    this.speakerImgSub.unsubscribe();
  }
}
