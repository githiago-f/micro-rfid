export class Project {
    constructor(raw) {
        this.id = raw.project_id;
        this.name = raw.project_name;
    }

    /**
     * @param {Date | string} dueDate 
     */
    set dueDate(dueDate) {
        if(typeof dueDate === 'string') {
            this.dueDate = new Date(dueDate);
        } else {
            this.dueDate = dueDate;
        }
    }
}