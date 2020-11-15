import {Options} from "./Models/options";
import {InitedContainer} from "./Models/initedContainer";

const initializedContainers: Array<InitedContainer> = [];

export function renderEqHorizontal(options: Options, timeouts: Array<any>, checkContainerWidths: boolean): void {

    let renderAgain = false;
    const defaultHeight = options.defaultHeight ? options.defaultHeight : 120;
    const spacing = options.spacing ? options.spacing : 0;
    const animation = options.animation ? options.animation : null;


    const containers = document.querySelectorAll('.eqHorizontal') as NodeListOf<HTMLDivElement>;

    /** save original data from every container with this class and set needed styles **/

    initializeContainers(containers, defaultHeight, animation);
    // console.log(initializedContainers);

    /** if call the function because of resizing window, change containerWidth to the correct
     * width after resizing
     **/

    if (checkContainerWidths) {
        initializedContainers.map(container => {
            container.containerWidth = container.container.clientWidth;
        })
    }

    /** function for rendering images **/

    const renderImages = () => {
        timeouts.map((timeout) => {
            clearTimeout(timeout)
        });
        timeouts = [];

        initializedContainers.forEach((container: InitedContainer): void => {
            const containerWidth = container.containerWidth;
            const rawContainerWidth = container.container.getBoundingClientRect().width;
            console.log('*****************');
            console.log('rawContainerWidth: ', rawContainerWidth);
            const elements = container.elements;

    //         elements.map(element => {
    //             element.style.transition = 'all 0s ease 0s';
    //             // element.style.transform = 'scale(1)';
    // //            console.log(element);
    //         });

            /** create rows inside the containers with the suitable amount of images in each row **/

            const groupedElements = elements.reduce((acc: Array<Array<HTMLElement>>, curr: any, index) => {
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

            groupedElements.map((group: Array<any>, index) => {
                const groupLength = group.length;
                const groupWidth = getWidth(group);
                const firstWidth = (group[0].origWidth / groupWidth) * (containerWidth - ((groupLength - 1) * spacing));
                const ratio = firstWidth / group[0].origWidth;
                const height = Math.floor(defaultHeight * ratio);
                console.log('height: ', height);

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

                                return acc + (+curr.style.width.slice(0, -2));
                            }, 0);
                            console.log('groupWidthWithoutLast: ', groupWidthWithoutLast);
                            console.log('lastElementWidth: ', rawContainerWidth - groupWidthWithoutLast - (groupLength - 1) * spacing);

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
    console.log('oldClientWidth: ', initializedContainers[0].containerWidth);
    initializedContainers.map((container: InitedContainer): void => {
        const newWidth = container.container.clientWidth;
        if (newWidth !== container.containerWidth) {
            renderAgain = true;
            container.containerWidth = newWidth;
        }
    });
    console.log('newClientWidth: ', initializedContainers[0].container.clientWidth);

    console.log('renderAgain: ', renderAgain);

    /** if not, render images again **/

    if (renderAgain) {
        renderAgain = false;
        console.log('///////////renderAgain ran');
        renderImages();
    }

    if (animation) {
        //const transform = animation.transform ? animation.transform

        initializedContainers.forEach((container) => {
            const elements = container.elements;

            for (let i = 0; i < elements.length; i++) {
                const timeout = (i) * 50;
                elements[i].style.transform = 'scale(0)';
                timeouts.push(setTimeout(() => {
                    elements[i].style.opacity = '1';
                    elements[i].style.transform = 'scale(1)';
                    elements[i].style.transition = 'all .3s';
                }, timeout));
            }
        })
    }
}

export function setFade() {
    initializedContainers.forEach((container) => {
        const elements = container.elements;

        elements.map(element => {
            element.style.opacity = '1';
            element.style.transition = 'all 0s ease 0s';
            element.style.transform = 'scale(1)';
        });
    })
}

/** initialize containers and save orig data **/

function initializeContainers(containers: NodeListOf<HTMLDivElement>, defaultHeight: number, animation: any) {

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

                if (animation && animation.opacity) {
                    element.style.opacity = '0';
                }

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

function
getWidth(array: Array<HTMLElement>): number {
    return array.reduce((acc: number, curr: any) => {
        return acc + curr.origWidth;
    }, 0);
}
