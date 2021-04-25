import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface Branding {
  logo: boolean;
  conference: boolean;
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

  // Holds the speaker info
  private speakerSrc = new BehaviorSubject({
    name: '',
    title: '',
  });
  speaker: Observable<Speaker> = this.speakerSrc.asObservable();

  // Holds the quote text
  private quoteSrc = new BehaviorSubject({ content: '' });
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
}
