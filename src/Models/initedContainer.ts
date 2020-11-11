export class InitedContainer {
    container: HTMLDivElement;
    containerWidth: number;
    widths: Array<number>;
    elements: Array<any>;

    constructor(container: HTMLDivElement, containerWidth: number, widths: Array<number>, elements: Array<any> ) {
        this.container = container;
        this.containerWidth = containerWidth;
        this.widths = widths;
        this.elements = elements;

        this.elements.map((element, index) => {
            element.origWidth = widths[index];
        }, widths);
    }
}

