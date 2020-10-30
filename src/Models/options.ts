export class Options {
    defaultHeight: number;
    leaveLastRow?: boolean;
    spacing?: number;

    constructor(data?: { defaultHeight: number, leaveLastRow?: boolean, padding?: number }) {
        this.defaultHeight = 120;
        if (data) {
            (<any>Object).assign(this, data);
        }
    }
}



