export class Card {
    constructor(raw) {
        this.id = raw.card_id;
        this.rfid = raw.card_rfid;
    }
}