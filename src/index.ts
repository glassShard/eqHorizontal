import {Options} from "./Models/options";
import {InitedContainer} from "./Models/initedContainer";

function eqHorizontal(options: Options): void {
    const defaultHeight = options.defaultHeight;
    const spacing = options.spacing ? options.spacing : 0;
    const containers = document.querySelectorAll('.eqHorizontal') as NodeListOf<HTMLDivElement>;    

    // save original data from every container with this class

    const initializedContainers: Array<InitedContainer> = Array.from(containers)
        .map((container: HTMLDivElement): InitedContainer => {
            container.style.display = 'flex';
            container.style.flexWrap = 'wrap';

            const elements = Array.from(container.children);

            const widths: Array<number> = elements.map((element: any) => {
                element.height = defaultHeight;
                return element.clientWidth;
            });

            return new InitedContainer(container, widths, elements);
        });
    console.log(initializedContainers);

    initializedContainers.forEach((container: InitedContainer): void => {
        const containerWidth = container.container.offsetWidth;
        const rawContainerWidth = +window.getComputedStyle(container.container).width.slice(0, -2);
        const elements = container.elements;
        console.log(containerWidth, rawContainerWidth);

        const groupedElements = elements.reduce((acc: Array<any>, curr: any, index) => {
            if (index === 0) {
                acc[index].push(curr);

                return acc;
            }

            const accLength = acc.length;
            const lastGroupWidth = getWidth(acc[accLength - 1]);
            const lastGroupLength = acc[accLength - 1].length;

            if (lastGroupWidth + curr.clientWidth + lastGroupLength * spacing > containerWidth) {
                acc.push([curr]);
            } else {
                acc[accLength - 1].push(curr);
            }

            return acc;
        }, [[]]);
        console.log(groupedElements);

        groupedElements.map((group: Array<HTMLElement>, index) => {
            const groupLength = group.length;
            const groupWidth = getWidth(group);
/*            console.log('groupWidth: ', groupWidth);
            console.log('1stElement.width: ', group[0].clientWidth);
            console.log('1stElement.width / groupWidth: ', group[0].clientWidth / groupWidth);
            console.log('containerWidth: ', containerWidth);
            console.log('groupLength: ', groupLength);
            console.log('containerWidth - spacing: ', containerWidth - ((groupLength - 1) * spacing));*/
            const firstWidth = (group[0].clientWidth / groupWidth) * (containerWidth - ((groupLength - 1) * spacing));
            const ratio = firstWidth / group[0].clientWidth;
            const height = Math.floor(defaultHeight * ratio);
/*            console.log('groupLength:', groupLength);
            console.log('firstWidth: ', firstWidth);
            console.log('ratio: ', ratio);
            console.log('height: ', height);*/

            if (options.leaveLastRow && index === groupedElements.length - 1 && groupWidth < containerWidth / 2) {
                group.map((element: any) => {
                    setElementSize(element, element.origWidth, defaultHeight);
                    element.style.marginBottom = spacing + 'px';
                    element.style.marginRight = spacing + 'px';
                });
            } else {
                group.map((element: any, index, array) => {
                    if (index === array.length - 1) {
                        const groupWidthWithoutLast = array.reduce((acc: number, curr: any, index) => {
                            if (index === array.length - 1) {
                                return acc;
                            }
                            return acc + curr.clientWidth;
                        }, 0);
                        console.log('groupWidthWithoutLast: ', groupWidthWithoutLast);
                        setElementSize(
                            element,
                            rawContainerWidth - groupWidthWithoutLast - (groupLength - 1) * spacing,
                            Math.round(height));
                        element.style.marginBottom = spacing + 'px';
                        element.style.marginRight = 0 + 'px';
                        console.log('element width: ', window.getComputedStyle(element).width);
                        return;
                    }
                    setElementSize(element, Math.round(element.origWidth * ratio), Math.round(height));
                    element.style.marginBottom = spacing + 'px';
                    element.style.marginRight = spacing + 'px';
                    console.log('element width: ', window.getComputedStyle(element).width);
                });
            }
        });
    });
}

eqHorizontal({defaultHeight: 150, leaveLastRow: true, spacing: 2});

function setElementSize(element: any, width: number, height: number) {
    element.width = width;
    element.height = height;
}

function getWidth(array: Array<HTMLElement>) {
    return array.reduce((acc: number, curr: any, index, array) => {

        return acc + curr.clientWidth;
    }, 0);
}
