import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Card } from '../card-provider.service';
import { StorageProvider, MaybeCards } from '../storage-provider.service';

@Component({
  selector: 'app-saved-cards',
  templateUrl: './saved-cards.component.html',
  styleUrls: ['./saved-cards.component.scss'],
})
export class SavedCardsComponent implements OnInit, OnDestroy {
  constructor(private storageService: StorageProvider) {}

  cards: MaybeCards;
  cardsSub: Subscription;

  ngOnInit(): void {
    this.cardsSub = this.storageService.cards.subscribe((cards) => {
      this.cards = cards;
      console.log(this.cards);
    });
  }

  ngOnDestroy() {
    this.cardsSub.unsubscribe();
  }
}
