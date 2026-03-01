export const canvas = document.querySelector("#main")! as HTMLCanvasElement;
export const context = canvas.getContext('2d')!;

let screenColor = 0;

const init = () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width = w;
    canvas.height = h;
    context.lineWidth = 1;
}
init();
addEventListener('resize', () => init())

export const clearCanvas = () => {
    if (context.resetTransform) {
        context.resetTransform();
    } else {
        context.setTransform(1, 0, 0, 1, 0, 0); // identity matrix fallback
    }
    context.clearRect(0, 0, canvas.width, canvas.height);
}
