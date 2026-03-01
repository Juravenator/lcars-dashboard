import { context } from "./canvas";

export const unit_height = 70;
export const unit_width = unit_height * 2.5;
export const unit_gap = 4;

const colors = {
    'blue': [
        "#cdddff",
        "#5599fe",
        "#3366ff",
        "#0111ed",
        // "#010088",
        "#0000c4",
    ],
    'brown': [
        "#ffeccd",
        "#fddda7",
        "#d59b30",
        "#ba9755",
        "#6d5c41",
    ],
    'tng-1': [
        "#fcefb1",
        // "#d59b30",
        "#ffce99",
        "#c0754e",
        "#d17428",
        "#aa6051",
    ],
    'tng-2': [ // https://www.deviantart.com/cmdrkerner/art/PADD-Display-158694285
        "#c8b4ef",
        "#ff9a66",
        "#fe9900",
        "#cc6566",
        "#97577c",
    ],
    'cern': [ // https://design-guidelines.web.cern.ch/guidelines/colours
        "rgb(205, 214, 237)",
        "rgb(155, 174, 219)",
        "rgb(107, 132, 197)",
        "rgb(56, 92, 180)",
        "rgb(0, 51, 160)",
    ],
    'gray-1': [
        "hsl(223, 0%, 87%)",
        "hsl(223, 0%, 73%)",
        "hsl(223, 0%, 60%)",
        "hsl(223, 0%, 46%)",
        "hsl(223, 0%, 31%)",
    ],
    // 'picard-1': (
    //     0: #,
    //     1: #,
    //     2: #a1cec6,
    //     3: #68d0c4,
    //     4: #123d50,
    // ),
    // 'picard-1': (
    //     0: #,
    //     1: #,
    //     2: #,
    //     3: #,
    //     4: #,
    // ),
};

let currentTheme = 'blue' as keyof typeof colors;
export const setTheme = (name: keyof typeof colors) => {
    currentTheme = name;
}


const biasedColorPool = [1, 2, 2, 3, 3, 3, 3, 4, 4, 4];
export const randColorNr = () => biasedColorPool[Math.floor(Math.random() * biasedColorPool.length)]!
export const getColor = (n: number, theme = currentTheme) => {
    const pool = colors[theme];
    return pool[n] || pool[0]!;
}