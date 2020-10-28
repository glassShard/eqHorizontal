export class Options {
    defaultHeight: number;
    padding?: number;

    constructor(data?: { defaultHeight: number, padding?: number }) {
        this.defaultHeight = 120;
        if (data) {
            (<any>Object).assign(this, data);
        }
    }
}



