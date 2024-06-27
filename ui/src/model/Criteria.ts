export default class Criteria {
    formattedDescription: string;
    title: string;
    description: string;
    _id: string;
    
    constructor(formattedDescription: string, title: string, description: string, _id: string) {
        this.formattedDescription = formattedDescription;
        this.title = title;
        this.description = description;
        this._id = _id;
    }
}