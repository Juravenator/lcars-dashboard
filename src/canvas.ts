export const canvas = document.querySelector("#main")! as HTMLCanvasElement;
export const context = canvas.getContext('2d')!;

const init = () => {
    const w = window.innerWidth * window.devicePixelRatio;
    const h = window.innerHeight * window.devicePixelRatio;
    canvas.width = w;
    canvas.height = h;
    context.lineWidth = 1;
    context.textRendering = 'optimizeLegibility';
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
