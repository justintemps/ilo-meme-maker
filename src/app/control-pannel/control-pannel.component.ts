import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import {
  MemeProvider,
  Branding,
  Speaker,
  Quote,
} from '../meme-provider.service';

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

  constructor(private memeProvider: MemeProvider) {}

  handleCheckBox(event: Event) {
    // Cast the target as an Input
    const element = event.currentTarget as HTMLInputElement;
    // Get the branding option from the input value
    const option = element.value;
    // See if the input is checked
    const checked = element.checked;
    // Update the branding property
    return this.memeProvider.updateBranding({
      [option]: checked,
    });
  }

  handleUpdateSpeaker(event: Event) {
    const element = event?.currentTarget as HTMLInputElement;
    const { name, value } = element;
    this.memeProvider.updateSpeaker({ [name]: value });
  }

  handleUpdateQuote(event: Event) {
    const element = event?.currentTarget as HTMLInputElement;
    this.memeProvider.updateQuote({ content: element.value });
  }

  ngOnInit(): void {
    this.brandingSub = this.memeProvider.branding.subscribe((branding) => {
      this.branding = branding;
    });
    this.speakerSub = this.memeProvider.speaker.subscribe((speaker) => {
      this.speaker = speaker;
    });
    this.quoteSub = this.memeProvider.quote.subscribe((quote) => {
      this.quote = quote;
    });
  }

  ngOnDestroy() {
    this.brandingSub.unsubscribe();
    this.speakerSub.unsubscribe();
    this.quoteSub.unsubscribe();
  }
}
