import { Cell, CellInput } from "./cells/cell";

export interface MenuEntry {
    height: number;
    color: number;
    cell?: (input: CellInput) => Cell;
    name?: string;
}
