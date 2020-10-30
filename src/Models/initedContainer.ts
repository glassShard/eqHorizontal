export class InitedContainer {
    container: HTMLDivElement;
    widths: Array<number>;
    elements: Array<any>;

    constructor(container: HTMLDivElement, widths: Array<number>, elements: Array<any> ) {
        this.container = container;
        this.widths = widths;
        this.elements = elements;

        this.elements.map((element, index) => {
            element.origWidth = widths[index];
        }, widths);
    }
}

