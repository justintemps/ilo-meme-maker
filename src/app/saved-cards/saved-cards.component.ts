import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Card, CardProvider } from '../card-provider.service';
import { StorageProvider, MaybeCards } from '../storage-provider.service';

@Component({
  selector: 'app-saved-cards',
  templateUrl: './saved-cards.component.html',
  styleUrls: ['./saved-cards.component.scss'],
})
export class SavedCardsComponent implements OnInit, OnDestroy {
  constructor(
    private storageService: StorageProvider,
    private cardService: CardProvider
  ) {}

  cards: MaybeCards;
  cardsSub: Subscription;

  handleCardClick(id: number | null) {
    if (id && this.cards) {
      const card = this.cards.find((card) => id === card.id);
      this.cardService.initialize(card);
    }
  }

  handleDeleteCard(id: number | null) {
    if (id) {
      this.storageService.deleteCard(id);
    }
  }

  ngOnInit(): void {
    this.cardsSub = this.storageService.cards.subscribe((cards) => {
      this.cards = cards;
    });
  }

  ngOnDestroy() {
    this.cardsSub.unsubscribe();
  }
}
