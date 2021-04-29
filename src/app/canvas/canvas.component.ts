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
const RESIZER_RADIUS = 3;
const RR = RESIZER_RADIUS * RESIZER_RADIUS;

const COLOR = {
  blue: '#1e2dbe',
  white: '#fff',
  red: '#fa3c4b',
};

const LOGO = {
  blue: '/assets/blue_logo.png',
  white: '/assets/white_logo.png',
};

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
  hoverCanvas = false;

  // Logos image
  logo = {
    white: new Image(),
    blue: new Image(),
  };

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

  // This is an event handler on window, arrow function prevents change of scope
  updateOffsets = () => {
    const boundingBox = this.canvas.nativeElement.getBoundingClientRect();
    this.offsetX = boundingBox.left;
    this.offsetY = boundingBox.top;
  };

  // Handles addImage events from canvas-options
  handleAddImage(inputEvent: Event) {
    const reader = new FileReader();
    const input = inputEvent.target as HTMLInputElement;
    reader.onload = (readerEvent: Event) => {
      const readerTarget = readerEvent.target as FileReader;
      this.cardProvider.updateSpeakerImg({ src: readerTarget.result });
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
    // but only if a speakerImg has been loaded and the mouse
    // is over the canvas
    if (withAnchors && this.speakerImgLoaded && this.hoverCanvas) {
      this.drawDragAnchor(this.imageX, this.imageY);
      this.drawDragAnchor(this.imageRight, this.imageY);
      this.drawDragAnchor(this.imageRight, this.imageBottom);
      this.drawDragAnchor(this.imageX, this.imageBottom);
    }

    // optionally draw the connecting anchor lines
    if (withBorders) {
      this.context.beginPath();
      this.context.setLineDash([18, 5]);
      this.context.lineWidth = 3;
      this.context.strokeStyle = '#fa3c4b';
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
    if (this.branding.background) {
      this.context.beginPath();
      this.context.moveTo(0, 0);
      this.context.lineTo(0, 335);
      this.context.lineTo(430, 335);
      this.context.lineTo(280, 0);
      this.context.closePath();
      this.context.fillStyle = COLOR[this.branding.background];
      this.context.fill();
    }
  }

  // Draws the quote
  drawQuote() {
    this.context.fillStyle = COLOR[this.branding.font];
    CanvasTextWrapper(this.canvas.nativeElement, this.quote.content, {
      offsetY: 100,
      offsetX: 50,
      maxWidth: 265,
    });
  }

  // Draws the speaker
  drawSpeaker() {
    this.context.fillStyle = COLOR[this.branding.font];
    CanvasTextWrapper(this.canvas.nativeElement, this.speaker.name, {
      offsetY: 260,
      offsetX: 50,
      maxWidth: 300,
    });
  }

  // Draws the title
  drawTitle() {
    this.context.fillStyle = COLOR[this.branding.font];
    CanvasTextWrapper(this.canvas.nativeElement, this.speaker.title, {
      offsetY: 280,
      offsetX: 50,
      maxWidth: 300,
    });
  }

  // Draws the logo
  drawLogo() {
    if (this.branding.logo) {
      this.context.drawImage(this.logo[this.branding.logo], 10, 10, 114, 46);
    }
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
    if (dx * dx + dy * dy <= RR * 2) {
      return 0;
    }
    // top-right
    dx = x - this.imageRight;
    dy = y - this.imageY;
    if (dx * dx + dy * dy <= RR * 2) {
      return 1;
    }
    // bottom-right
    dx = x - this.imageRight;
    dy = y - this.imageBottom;
    if (dx * dx + dy * dy <= RR * 2) {
      return 2;
    }
    // bottom-left
    dx = x - this.imageX;
    dy = y - this.imageBottom;
    if (dx * dx + dy * dy <= RR * 2) {
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
    this.updateOffsets();
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

  handleMouseEnter() {
    this.hoverCanvas = true;
    this.draw(true, false);
  }

  handleMouseOut() {
    this.hoverCanvas = false;
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
      this.draw(false, false);
    }
  }

  ngAfterViewInit(): void {
    // Set the canvas context when the window is ready
    this.context = this.canvas.nativeElement.getContext(
      '2d'
    ) as CanvasRenderingContext2D;

    // Make sure changes to the size of the window
    // or canvas don't throw off our coord system
    this.updateOffsets();
    window.addEventListener('resize', this.updateOffsets);
    this.canvas.nativeElement.addEventListener('resize', this.updateOffsets);

    this.canvas.nativeElement.addEventListener('mousedown', (e) => {
      this.handleMouseDown(e);
    });

    this.canvas.nativeElement.addEventListener('mousemove', (e) => {
      this.handleMouseMove(e);
    });

    this.canvas.nativeElement.addEventListener('mouseup', (e) => {
      this.handleMouseUp();
    });

    this.canvas.nativeElement.addEventListener('mouseenter', (e) => {
      this.handleMouseEnter();
    });

    this.canvas.nativeElement.addEventListener('mouseout', (e) => {
      this.handleMouseOut();
    });

    // We need this to make sure that the reference to the ViewChild
    // stays current when we pass it to child components. More info here:
    // https://angular.io/errors/NG0100
    this.cd.detectChanges();
  }

  ngOnInit(): void {
    // Instantiate our images
    this.speakerImg.onload = () => {
      // If the card doesn't have an id then it hasn't been saved and the user
      // hasn't been able to make any modifications do it. In that case, get the
      // width and height from the image itself. Do the same thing if we know the
      // canvas is blank because it's already been cleared by a use
      const cardIsNew = !this.cardProvider.id;
      const canvasIsBlank = !this.cardProvider.getCard().speakerImg.src;
      if (cardIsNew || canvasIsBlank) {
        this.cardProvider.updateSpeakerImg({
          imageWidth: this.speakerImg.width,
          imageHeight: this.speakerImg.height,
        });
      }
      this.speakerImgLoaded = true;
      this.imageRight = this.imageX + this.imageWidth;
      this.imageBottom = this.imageY + this.imageHeight;
      this.draw(true, false);
    };

    // Initialize logos
    this.logo.white.src = LOGO.white;
    this.logo.blue.src = LOGO.blue;

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
        // If we have an src that's different from the last one
        // then set it, otherwise don't or we get an infinite loop
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
        this.speakerImgLoaded = false;
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
