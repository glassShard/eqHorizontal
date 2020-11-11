import {Options} from "./Models/options";
import {InitedContainer} from "./Models/initedContainer";
import {rerenderOnResize} from "./rerenderOnResize";

const initializedContainers: Array<InitedContainer> = [];

export function renderEqHorizontal(options: Options): void {
    let renderAgain = false;
    const defaultHeight = options.defaultHeight;
    const spacing = options.spacing ? options.spacing : 0;
    const containers = document.querySelectorAll('.eqHorizontal') as NodeListOf<HTMLDivElement>;

    /** save original data from every container with this class and set needed styles **/

    initializeContainers(containers, defaultHeight);

    /** function for rendering images **/

    const renderImages = () => {
        initializedContainers.forEach((container: InitedContainer): void => {
            const containerWidth = container.containerWidth;
            const rawContainerWidth = container.container.getBoundingClientRect().width;
            const elements = container.elements;

            /** create rows inside the containers with the suitable amount of images in each row **/

            const groupedElements = elements.reduce((acc: Array<any>, curr: any, index) => {
                if (index === 0) {
                    acc[index].push(curr);
                    return acc;
                }

                const accLength = acc.length;
                const lastGroupWidth = getWidth(acc[accLength - 1]);
                const lastGroupLength = acc[accLength - 1].length;

                if (lastGroupWidth + curr.origWidth + lastGroupLength * spacing > containerWidth) {
                    acc.push([curr]);
                } else {
                    acc[accLength - 1].push(curr);
                }

                return acc;
            }, [[]]);
            console.log('groupedElements: ', groupedElements);

            /** set images width and height to be exactly the container size **/

            groupedElements.map((group: Array<HTMLElement>, index) => {
                const groupLength = group.length;
                const groupWidth = getWidth(group);
                const firstWidth = (group[0].clientWidth / groupWidth) * (containerWidth - ((groupLength - 1) * spacing));
                const ratio = firstWidth / group[0].clientWidth;
                const height = Math.floor(defaultHeight * ratio);

                if (options.leaveLastRow && index === groupedElements.length - 1 && groupWidth < containerWidth / 2) {
                    group.map((element: any) => {
                        setElementSize(element, element.origWidth, defaultHeight);
                        element.style.marginBottom = spacing + 'px';
                        element.style.marginRight = spacing + 'px';
                    });
                } else {
                    group.map((element: any, index, array) => {
                        if (index === array.length - 1) {
                            const groupWidthWithoutLast = array.reduce((acc: number, curr: any, innerIndex) => {

                                if (innerIndex === array.length - 1) {
                                    return acc;
                                }

                                return acc + curr.getBoundingClientRect().width;
                            }, 0);

                            setElementSize(
                                element,
                                rawContainerWidth - groupWidthWithoutLast - (groupLength - 1) * spacing,
                                Math.round(height));
                            element.style.marginBottom = spacing + 'px';
                            element.style.marginRight = 0 + 'px';

                            return;
                        }
                        setElementSize(element, Math.round(element.origWidth * ratio), Math.round(height));
                        element.style.marginBottom = spacing + 'px';
                        element.style.marginRight = spacing + 'px';

                    });
                }
            });
        });
    };

    /** render images for the first time **/

    renderImages();

    /** check if the size of containers remain unchanged after rendering (if scrollbar needed or
     *  removed **/

    initializedContainers.map((container: InitedContainer): void => {
        const newWidth = container.container.clientWidth;
        if (newWidth !== container.containerWidth) {
            renderAgain = true;
            container.containerWidth = newWidth;
        }
    });

    /** if not, render images again **/

    if (renderAgain) {
        renderAgain = false;
        renderImages();
    }

    // initializedContainers.forEach((container) => {
    //     const elements = container.elements;
    //     elements.map(element => {
    //         element.style.opacity = 1;
    //     })
    // })
}

/** initialize containers and save orig data **/

function initializeContainers(containers: NodeListOf<HTMLDivElement>, defaultHeight: number) {

    if (initializedContainers.length !== 0) {
        return;
    }

    Array.from(containers)
        .map((container: HTMLDivElement): void => {
            container.style.display = 'flex';
            container.style.flexWrap = 'wrap';

            const elements = Array.from(container.children);

            const widths: Array<number> = elements.map((element: any) => {
                element.height = defaultHeight;
                // element.style.opacity = 0;
                // element.style.transition = 'all .3s';
                return element.clientWidth;
            });

            const containerWidth = container.clientWidth;

            initializedContainers.push (new InitedContainer(container, containerWidth, widths, elements));
        });
}

/** helper functions **/

function setElementSize(element: any, width: number, height: number) {
    element.style.width = width + 'px';
    element.height = height;
}

function getWidth(array: Array<HTMLElement>): number {
    return array.reduce((acc: number, curr: any) => {
        return acc + curr.origWidth;
    }, 0);
}
