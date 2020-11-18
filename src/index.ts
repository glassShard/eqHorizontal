import { renderEqHorizontal } from "./renderImages";
import {rerenderOnResize} from "./rerenderOnResize";
import {Options} from "./Models/options";

function eqHorizontal(options: Options, timeouts: Array<any>) {
    renderEqHorizontal(options, timeouts, false);
    rerenderOnResize(options, timeouts);
}

const timeouts: Array<number> = [];

eqHorizontal({
    defaultHeight: 150,
    leaveLastRow: true,
    spacing: 12,
    animation: {
        opacity: true,
        transform: 'scale(0)',
        timing: 50,
        transition: 300,
        reverseOrder: false,
    }
}, timeouts);


