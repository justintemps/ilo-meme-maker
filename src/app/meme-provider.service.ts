import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface Branding {
  logo: boolean;
  conference: boolean;
  website: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class MemeProvider {
  // Holds the branding options
  private brandingSrc = new BehaviorSubject({
    logo: false,
    conference: false,
    website: false,
  });
  branding: Observable<Branding> = this.brandingSrc.asObservable();

  // Holds the texts
  private textsSrc = new BehaviorSubject(['']);
  texts: Observable<string[]> = this.textsSrc.asObservable();

  constructor() {}

  // Updates the branding properties
  updateBranding(branding: Branding) {
    this.brandingSrc.next(branding);
  }

  // Adds a line of text to the meme
  addTextLine() {
    this.textsSrc.next(this.textsSrc.getValue().concat(''));
  }

  // Updates a line of thext
  updateTextLine(content: string, index: number) {
    const texts = this.textsSrc.getValue();
    texts[index] = content;
    this.textsSrc.next(texts);
  }

  // Removes a line of text
  removeTextLine(index: number) {
    console.log(index);
    console.log(this.textsSrc.getValue());
    const texts = this.textsSrc.getValue().filter((txt, i) => i !== index);
    this.textsSrc.next(texts);
  }
}
