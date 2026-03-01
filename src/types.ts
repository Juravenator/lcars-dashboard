import { Cell } from "./cells/cell";

export interface MenuEntry {
    height: number;
    color: number;
    cell?: Cell;
    name?: string;
}
