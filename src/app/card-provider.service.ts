import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Branding {
  logo: boolean;
  background: boolean;
  website: boolean;
}

export interface Speaker {
  name: string;
  title: string;
}

export interface ProfileImg {
  src: string;
  alt: string;
}

export interface Quote {
  content: string;
}

export interface SpeakerImg {
  src: string | null;
  width: number;
  height: number;
  imageX: number;
  imageY: number;
  imageWidth: number;
  imageHeight: number;
}

const initialBranding = {
  logo: false,
  background: false,
  website: false,
};

const initialSpeaker = {
  name: '',
  title: '',
};

const initialQuote = {
  content: '',
};

@Injectable({
  providedIn: 'root',
})
export class CardProvider {
  // Holds the branding options
  private brandingSrc = new BehaviorSubject(initialBranding);
  branding: Observable<Branding> = this.brandingSrc.asObservable();

  // Holds the speaker info
  private speakerSrc = new BehaviorSubject(initialSpeaker);
  speaker: Observable<Speaker> = this.speakerSrc.asObservable();

  // Holds the quote text
  private quoteSrc = new BehaviorSubject(initialQuote);
  quote: Observable<Quote> = this.quoteSrc.asObservable();

  // Holds the speaker image values
  private speakerImgSrc = new BehaviorSubject({
    src: null,
    width: 0,
    height: 0,
    imageX: 0,
    imageY: 0,
    imageWidth: 0,
    imageHeight: 0,
  });
  speakerImg: Observable<SpeakerImg> = this.speakerImgSrc.asObservable();

  constructor() {}

  // Updates the branding properties
  updateBranding(update: {}) {
    const branding = this.brandingSrc.getValue();
    this.brandingSrc.next({ ...branding, ...update });
  }

  // Updates the speaker details
  updateSpeaker(update: {}) {
    const speaker = this.speakerSrc.getValue();
    this.speakerSrc.next({ ...speaker, ...update });
  }

  // Updates the quote
  updateQuote(update: {}) {
    const quote = this.quoteSrc.getValue();
    this.quoteSrc.next({ ...quote, ...update });
  }

  // Updates the speaker image values
  updateSpeakerImg(update: {}) {
    const speakerImg = this.speakerImgSrc.getValue();
    this.speakerImgSrc.next({ ...speakerImg, ...update });
  }

  // Resets card data
  initialize() {
    this.brandingSrc.next(initialBranding);
    this.speakerSrc.next(initialSpeaker);
    this.quoteSrc.next(initialQuote);
  }
}
