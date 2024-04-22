export class OpenRequest {
    /**
     * @param {any} raw 
     */
    constructor(raw) {
        this.id     = raw.id;
        this.rfid   = raw.rfid;
        this.viewed = raw.viewed;
        /**
         * @type {'DENIED' | 'ALLOWED'}
         */
        this.status = raw.status;
    }
}