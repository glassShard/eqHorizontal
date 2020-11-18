export class Options {
    defaultHeight: number;
    leaveLastRow?: boolean;
    spacing?: number;
    animation?: {
        opacity: boolean;
        transform: string;
        reverseOrder: boolean;
        timing: number;
        transition: number;
    };

    constructor(data?: {
        defaultHeight: number,
        leaveLastRow?: boolean,
        padding?: number,
        animation?: {
            opacity: boolean;
            transform: string;
            reverseOrder: boolean;
            timing: number;
            transition: number;
        }
    }) {
        this.defaultHeight = 120;
        if (data) {
            (<any>Object).assign(this, data);
        }
    };
}



