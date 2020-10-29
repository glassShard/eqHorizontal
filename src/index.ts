import { Options } from "./Models/options";

function eqHorizontal(options: Options) {
    const defaultHeight = options.defaultHeight;
    const padding = 0;

    const containers = document.querySelectorAll('.eqHorizontal') as NodeListOf<HTMLDivElement>;
    containers.forEach((container: HTMLDivElement) => {
        container.style.display = 'flex';
        container.style.flexWrap = 'wrap';

    })
}

eqHorizontal({defaultHeight: 120, padding: 0});
