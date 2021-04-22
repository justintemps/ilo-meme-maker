// The code in this section is heavily influeced by this jsfiddle
// http://jsfiddle.net/m1erickson/LAS8L/

// Note to self, it may be necessary to update offsets with window or canvas changes

import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from '@angular/core';

const IMAGE =
  'http://de.spongepedia.org/images/thumb/47a_Clown.jpg/200px-47a_Clown.jpg';

const RESIZER_RADIUS = 3;
const RR = RESIZER_RADIUS * RESIZER_RADIUS;

@Component({
  selector: 'app-canvas',
  template: `<canvas
    class="meme_canvas"
    width="800"
    height="600"
    #memeCanvas
  ></canvas>`,
  styles: [
    '.meme_canvas { width: 800px; height: 600px; border: 2px solid red; }',
  ],
})
export class CanvasComponent implements AfterViewInit {
  @ViewChild('memeCanvas')
  canvas: ElementRef<HTMLCanvasElement>;
  context: CanvasRenderingContext2D;
  offsetX: number;
  offsetY: number;
  startX: number;
  startY: number;
  imageX = 50;
  imageY = 50;
  mouseX: number;
  mouseY: number;
  imageWidth: number;
  imageHeight: number;
  imageRight: number;
  imageBottom: number;
  draggingResizer = -1;
  draggingImage = false;
  img = new Image();

  updateOffsets() {
    const boundingBox = this.canvas.nativeElement.getBoundingClientRect();
    this.offsetX = boundingBox.left;
    this.offsetY = boundingBox.top;
  }

  draw(withAnchors: boolean, withBorders: boolean) {
    // clear the canvas
    this.context.clearRect(
      0,
      0,
      this.canvas.nativeElement.width,
      this.canvas.nativeElement.height
    );

    // draw the image
    this.context.drawImage(
      this.img,
      0,
      0,
      this.img.width,
      this.img.height,
      this.imageX,
      this.imageY,
      this.imageWidth,
      this.imageHeight
    );

    // optionally draw the draggable anchors
    if (withAnchors) {
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

  drawDragAnchor(x: number, y: number) {
    this.context.beginPath();
    this.context.arc(x, y, RR, 0, Math.PI * 2, false);
    this.context.closePath();
    this.context.fill();
  }

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
          this.imageX = this.mouseX;
          this.imageWidth = this.imageRight - this.mouseX;
          this.imageY = this.mouseY;
          this.imageHeight = this.imageBottom - this.mouseY;
          break;
        case 1:
          //top-right
          this.imageY = this.mouseY;
          this.imageWidth = this.mouseX - this.imageX;
          this.imageHeight = this.imageBottom - this.mouseY;
          break;
        case 2:
          //bottom-right
          this.imageWidth = this.mouseX - this.imageX;
          this.imageHeight = this.mouseY - this.imageY;
          break;
        case 3:
          //bottom-left
          this.imageX = this.mouseX;
          this.imageWidth = this.imageRight - this.mouseX;
          this.imageHeight = this.mouseY - this.imageY;
          break;
      }

      if (this.imageWidth < 25) {
        this.imageWidth = 25;
      }
      if (this.imageHeight < 25) {
        this.imageHeight = 25;
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
      this.imageX += dx;
      this.imageY += dy;
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

    this.img.src = IMAGE;
    this.img.onload = () => {
      this.imageWidth = this.img.width;
      this.imageHeight = this.img.height;
      this.imageRight = this.imageX + this.imageWidth;
      this.imageBottom = this.imageY + this.imageHeight;
      this.draw(true, false);
    };

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
  }
}
