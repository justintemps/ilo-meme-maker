import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Card, CardProvider } from './card-provider.service';

export type MaybeCards = Card[] | null;

@Injectable({
  providedIn: 'root',
})
export class StorageProvider {
  constructor(private cardService: CardProvider) {
    // Load cards from local storage into memory
    this.getCachedCards();
  }

  // The in-memory version of our cards collection
  private cardsSrc = new BehaviorSubject<MaybeCards>(null);
  cards = this.cardsSrc.asObservable();

  // Loads cards from local storage into memory
  getCachedCards(): void {
    const cachedCards = window.localStorage.getItem('cards');
    if (cachedCards) {
      const cards = JSON.parse(cachedCards) as Card[];
      this.cardsSrc.next(cards);
      return;
    }
    this.cardsSrc.next(null);
  }

  // Adds a collection of cards to local storage and syncs the model we have in memory
  updateCache(cards: Card[]): void {
    window.localStorage.setItem('cards', JSON.stringify(cards));
    this.getCachedCards();
  }

  // Saves or updates a card in memory and in local storage
  saveCard() {
    // Get the card that's currently being worked on
    const card = this.cardService.getCard();
    // Get the collection of the cards from memory
    const cards = this.cardsSrc.getValue();
    // If this is the first card, set an id and put it in localStorage
    if (!cards) {
      card.id = 1;
      // Update the current card with its new id
      this.cardService.initialize(card);
      this.updateCache([card]);
      return;
    }

    // If this is a new card, it won't have an id. Find the id and assign it
    if (!card.id) {
      const lastID = cards.reduce((acc, current) => {
        if (current.id && current.id > acc) {
          acc = current.id;
        }
        return acc;
      }, 0);
      card.id = lastID + 1;
      // Update the current card with its new id
      this.cardService.initialize(card);
      cards.push(card);
      this.updateCache(cards);
      return;
    }

    // If we're updating a card then, then find and update
    const cardIndex = cards.findIndex(({ id }) => id === card.id);
    cards[cardIndex] = card;
    this.updateCache(cards);
  }
}
