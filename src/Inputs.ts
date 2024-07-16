
export let leftpressed: boolean, rightpressed: boolean, zpressed: boolean, xpressed: boolean = false;

export function noleft() { leftpressed = false; }
export function noright() { rightpressed = false; }
export function noz() { zpressed = false; }
export function nox() { xpressed = false; }

document.addEventListener('keydown', function (event) {
    if (event.key == "ArrowLeft") leftpressed = true;
    if (event.key == "ArrowRight") rightpressed = true;
    if (event.key == "x") xpressed = true;
    if (event.key == "z") zpressed = true;
});

document.addEventListener('keyup', function (event) {
    if (event.key == "ArrowLeft") leftpressed = false;
    if (event.key == "ArrowRight") rightpressed = false;
    if (event.key == "x") xpressed = false;
    if (event.key == "z") zpressed = false;
});
