import { Component, OnInit, OnDestroy } from '@angular/core';
import { MemeProvider, Branding } from '../meme-provider.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-control-pannel',
  templateUrl: './control-pannel.component.html',
  styleUrls: ['./control-pannel.component.scss'],
  providers: [MemeProvider],
})
export class ControlPannelComponent implements OnInit {
  branding: Branding;
  texts: string[];
  brandingSub: Subscription;
  textsSub: Subscription;

  constructor(private memeProvider: MemeProvider) {}

  handleCheckBox(event: Event) {
    // Cast the target as an Input
    const element = event.currentTarget as HTMLInputElement;
    // Get the branding property from the input value
    const prop = element.value;
    // See if the input is checked
    const checked = element.checked;
    // Update the branding property
    return this.memeProvider.updateBranding({
      ...this.branding,
      ...{ [prop]: checked },
    });
  }

  handleAddTextBtn() {
    this.memeProvider.addTextLine();
  }

  handleUpdateText(event: Event, index: number) {
    const element = event.currentTarget as HTMLInputElement;
    const content = element.value;
    console.log({ content, index });
    this.memeProvider.updateTextLine(content, index);
  }

  handleDeleteText(index: number) {
    this.memeProvider.removeTextLine(index);
  }

  ngOnInit(): void {
    this.brandingSub = this.memeProvider.branding.subscribe(
      (branding) => (this.branding = branding)
    );
    this.textsSub = this.memeProvider.texts.subscribe(
      (texts) => (this.texts = texts)
    );
  }

  ngOnDestroy() {
    this.brandingSub.unsubscribe();
  }
}
