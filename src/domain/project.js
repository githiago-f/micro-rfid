export class Project {
    constructor(raw) {
        this.id = raw.project_id;
        this.name = raw.project_name;
        if(raw.project_due_date) {
            this.dueDate = raw.project_due_date;
        }
    }

    /**
     * @param {Date | string} dueDate 
     */
    set dueDate(dueDate) {
        if(typeof dueDate === 'string') {
            this._dueDate = new Date(dueDate);
        } else {
            this._dueDate = dueDate;
        }
    }

    get dueDate() {
        return this._dueDate;
    }
}