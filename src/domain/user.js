import { Card } from "./card.js";
import { Project } from "./project.js";

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
        
        /**
         * @type {Project[]}
         */
        this.projects = [];
    }

    /**
     * Check if `dashboard` permission is set to user
     * @returns {boolean}
     */
    get canAccessDashboard() {
        return this.permissions.includes('dashboard');
    }

    /**
     * Check if `door-full` permission is set to user
     * @returns {boolean}
     */
    get hasFullDoorPermission() {
        return this.permissions.includes('door-full');
    }

    toJSON() {
        const obj = Object.assign({}, this);
        delete obj.password;
        return obj;
    }

    /**
     * @param {Card} card 
     */
    setCard(card) {
        this.card = card;
    }

    /**
     * @param {Project[]} projects 
     */
    setProjects(projects) {
        this.projects = this.projects ?? [];
        this.projects.push(...projects);
    }
}
