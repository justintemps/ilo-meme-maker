import { Injectable } from '@angular/core';
import { Card, CardProvider } from './card-provider.service';

@Injectable({
  providedIn: 'root',
})
export class StorageProvider {
  constructor(private cardService: CardProvider) {}

  // Gets cards in local storage and returns as an array of cards
  getCachedCards(): Card[] | null {
    const cachedCards = window.localStorage.getItem('cards');
    if (cachedCards) {
      const cards = JSON.parse(cachedCards) as Card[];
      return cards;
    }
    return null;
  }

  // Adds a collection of cards to local storage
  setCachedCards(cards: Card[]): void {
    window.localStorage.setItem('cards', JSON.stringify(cards));
  }

  // Saves or updates a card in local storage
  saveCard() {
    const card = this.cardService.getCard();
    const cards = this.getCachedCards();
    // If this is the first card, set an id and put it in localStorage
    if (!cards) {
      card.id = 1;
      // Update the current card with its new id
      this.cardService.initialize(card);
      this.setCachedCards([card]);
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
      this.setCachedCards(cards);
      return;
    }

    // If we're updating a card then, then find and update
    const cardIndex = cards.findIndex(({ id }) => id === card.id);
    cards[cardIndex] = card;
    this.setCachedCards(cards);
  }
}
