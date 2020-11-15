import {renderEqHorizontal, setFade} from "./renderImages";
import {Options} from "./Models/options";

export function rerenderOnResize(options: Options, timeouts: Array<number>) {
    let resizeTimer = false;
    window.addEventListener('resize', () => {
        if (!resizeTimer) {
            resizeTimer = true;

            /** when resizing begins, set elements opacity to 0 **/

            setFade();

            /** let resizing happen, after the last fired event let's run rendering function **/

            setTimeout(() => {
                resizeTimer = false;
                renderEqHorizontal(options, timeouts, true);
            }, 500);
        }
    })
}
