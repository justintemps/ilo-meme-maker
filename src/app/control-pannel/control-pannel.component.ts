import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import {
  CardProvider,
  Branding,
  Speaker,
  Quote,
} from '../card-provider.service';

@Component({
  selector: 'app-control-pannel',
  templateUrl: './control-pannel.component.html',
  styleUrls: ['./control-pannel.component.scss'],
})
export class ControlPannelComponent implements OnInit, OnDestroy {
  branding: Branding;
  speaker: Speaker;
  quote: Quote;
  brandingSub: Subscription;
  speakerSub: Subscription;
  quoteSub: Subscription;

  constructor(private cardProvider: CardProvider) {}

  handleRadiobutton(event: Event, type: string) {
    const element = event.currentTarget as HTMLInputElement;
    const value = element.value === 'hidden' ? null : element.value;
    const checked = element.checked;
    if (checked) {
      this.cardProvider.updateBranding({ [type]: value });
    }
  }

  handleUpdateSpeaker(event: Event) {
    const element = event?.currentTarget as HTMLInputElement;
    const { name, value } = element;
    this.cardProvider.updateSpeaker({ [name]: value });
  }

  handleUpdateQuote(event: Event) {
    const element = event?.currentTarget as HTMLInputElement;
    this.cardProvider.updateQuote({ content: element.value });
  }

  ngOnInit(): void {
    this.brandingSub = this.cardProvider.branding.subscribe((branding) => {
      this.branding = branding;
    });
    this.speakerSub = this.cardProvider.speaker.subscribe((speaker) => {
      this.speaker = speaker;
    });
    this.quoteSub = this.cardProvider.quote.subscribe((quote) => {
      this.quote = quote;
    });
  }

  ngOnDestroy() {
    this.brandingSub.unsubscribe();
    this.speakerSub.unsubscribe();
    this.quoteSub.unsubscribe();
  }
}
