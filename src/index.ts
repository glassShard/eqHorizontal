import { renderEqHorizontal } from "./renderImages";
import {rerenderOnResize} from "./rerenderOnResize";
import {Options} from "./Models/options";

function eqHorizontal(options: Options) {
    renderEqHorizontal(options);
    rerenderOnResize(options);
};

eqHorizontal({defaultHeight: 150, leaveLastRow: true, spacing: 12});


