import { renderEqHorizontal } from "./renderImages";
import {Options} from "./Models/options";

export function rerenderOnResize(options: Options) {
    let resizeTimer = false;
    window.addEventListener('resize', () => {
        console.log('resized');
        if (!resizeTimer) {
            console.log('rendered');
            resizeTimer = true;
            renderEqHorizontal(options);
            setTimeout(() => {
                resizeTimer = false;
                console.log('rendered after 500ms');
                renderEqHorizontal(options);
            }, 500);
        }
    })
}
