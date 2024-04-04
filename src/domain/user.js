import { Card } from "./card.js";

export class User {
    /**
     * @param {Object} raw 
     */
    constructor(raw) {
        this.id = raw.id;
        this.permissions = raw.permissions.split(',');
        this.name = raw.name;
        this.email = raw.email;
        this.password = raw.password;
        this.isDefaultPassword = raw.default_password === 1;
    }

    get canAccessDashboard() {
        return this.permissions.includes('dashboard');
    }

    toJSON() {
        const obj = Object.assign({}, this);
        delete obj.password;
        return obj;
    }

    /**
     * 
     * @param {Card} card 
     */
    setCard(card) {
        this.card = card;
    }
}
