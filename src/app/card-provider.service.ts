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

  // Holds the image data
  private profileImgSrc = new BehaviorSubject({ src: '', alt: '' });
  profileImg: Observable<ProfileImg> = this.profileImgSrc.asObservable();

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

  // Updates the profile image
  updateProfileImg(update: {}) {
    const profileImg = this.profileImgSrc.getValue();
    this.profileImgSrc.next({ ...profileImg, ...update });
  }

  // Updates the quote
  updateQuote(update: {}) {
    const quote = this.quoteSrc.getValue();
    this.quoteSrc.next({ ...quote, ...update });
  }

  // Resets card data
  initialize() {
    this.brandingSrc.next(initialBranding);
    this.speakerSrc.next(initialSpeaker);
    this.quoteSrc.next(initialQuote);
  }
}
