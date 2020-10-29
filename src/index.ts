import {Options} from "./Models/options";
import {InitedContainer} from "./Models/initedContainer";

function eqHorizontal(options: Options) {
    const defaultHeight = options.defaultHeight;
    const padding = 0;

    const containers = document.querySelectorAll('.eqHorizontal') as NodeListOf<HTMLDivElement>;

    const initializedContainers: Array<InitedContainer> = Array.from(containers)
        .map((container: HTMLDivElement): InitedContainer => {
            container.style.display = 'flex';
            container.style.flexWrap = 'wrap';

            const elements = Array.from(container.children);

            const widths: Array<number> = elements.map((element: any) => {
                element.height = defaultHeight;
                return element.offsetWidth;
            });

            return new InitedContainer(container, widths);
        });
    console.log(initializedContainers);

    initializedContainers.forEach((container: InitedContainer): void => {
        const containerWidth = container.container.offsetWidth;

        const elements = Array.from(container.container.children);

        const reducedContainer = elements.reduce((acc: Array<any>, curr: any, index) => {
            if (index === 0) {
                acc[index].push(curr);

                return acc;
            }

            const accLength = acc.length;

            const lastInnerWidth = acc[accLength - 1].reduce((accInner: number, currInner: any) => {

                return accInner + currInner.offsetWidth;
            }, 0);

            if (lastInnerWidth + curr.offsetWidth > containerWidth) {
                acc.push([curr]);
            } else {
                acc[accLength - 1].push(curr);
            }

            return acc;
        }, [[]]);
        console.log(reducedContainer);
    });
}

eqHorizontal({defaultHeight: 200, padding: 0});
