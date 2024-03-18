export class User {
    /**
     * @param {Object} raw 
     */
    constructor(raw) {
        this.permissions = raw.permissions.split(',');
        this.name = raw.name;
        this.email = raw.email;
        this.password = raw.password;
    }
}
