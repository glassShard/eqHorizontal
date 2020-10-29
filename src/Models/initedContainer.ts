export class InitedContainer {
    container: HTMLDivElement;
    widths: Array<number>;

    constructor(container: HTMLDivElement, widths: Array<number> ) {
        this.container = container;
        this.widths = widths;
    }
}
