import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Branding {
  logo: 'blue' | 'white' | null;
  background: 'blue' | 'white' | 'red' | null;
  font: 'blue' | 'white' | 'red';
}

export interface Speaker {
  name: string;
  title: string;
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

export interface CardImg {
  src: string | null;
}

export interface Card {
  id: number | null;
  branding: Branding;
  speaker: Speaker;
  quote: Quote;
  speakerImg: SpeakerImg;
  cardImg: CardImg;
}

const initialBranding: Branding = {
  logo: null,
  background: null,
  font: 'blue',
};

const initialSpeaker = {
  name: '',
  title: '',
};

const initialQuote = {
  content: '',
};

const initialSpeakerImg = {
  src: null,
  width: 0,
  height: 0,
  imageX: 0,
  imageY: 0,
  imageWidth: 0,
  imageHeight: 0,
};

const initialCardImg = {
  src: null,
};

@Injectable({
  providedIn: 'root',
})
export class CardProvider {
  // Holds the cards id. A new card only gets an id once it's been saved
  public id: number | null = null;

  // Holds the branding options
  private brandingSrc = new BehaviorSubject<Branding>(initialBranding);
  public branding = this.brandingSrc.asObservable();

  //

  // Holds the speaker info
  private speakerSrc = new BehaviorSubject<Speaker>(initialSpeaker);
  public speaker = this.speakerSrc.asObservable();

  // Holds the quote text
  private quoteSrc = new BehaviorSubject<Quote>(initialQuote);
  public quote = this.quoteSrc.asObservable();

  // Holds the speaker image values
  private speakerImgSrc = new BehaviorSubject<SpeakerImg>(initialSpeakerImg);
  public speakerImg = this.speakerImgSrc.asObservable();

  // Holds the saved value of the card image
  private cardImgSrc = new BehaviorSubject<CardImg>(initialCardImg);
  public cardImg = this.cardImgSrc.asObservable();

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

  // Updates the card image
  updateCardImg(update: {}) {
    const cardImg = this.cardImgSrc.getValue();
    this.cardImgSrc.next({ ...cardImg, ...update });
  }

  // Returns all the properties of the current card
  getCard(): Card {
    return {
      id: this.id,
      branding: this.brandingSrc.getValue(),
      speaker: this.speakerSrc.getValue(),
      quote: this.quoteSrc.getValue(),
      speakerImg: this.speakerImgSrc.getValue(),
      cardImg: this.cardImgSrc.getValue(),
    };
  }

  // Initializes a card with initial values or new ones from the cache
  initialize(card?: Card) {
    const id = card?.id;
    const branding = card?.branding ?? initialBranding;
    const speaker = card?.speaker ?? initialSpeaker;
    const quote = card?.quote ?? initialQuote;
    const speakerImg = card?.speakerImg ?? initialSpeakerImg;
    // If no id property, assume this is a new card
    if (id) {
      this.id = id;
    }

    this.brandingSrc.next(branding);
    this.speakerSrc.next(speaker);
    this.quoteSrc.next(quote);
    this.speakerImgSrc.next(speakerImg);
  }

  // Creates a new card without an id
  createCard() {
    this.id = null;
    this.initialize();
  }
}
