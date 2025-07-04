export interface Move {
    from?: string;
    to: string;
    promotion?: "q" | "r" | "n" | "b" | "k" | "p";
    drop?: "q" | "r" | "n" | "b" | "k" | "p";
}

export function decodeTCN(tcnString: string): Move[];

export function encodeTCN(moves: Move | Move[]): string;

export function tcnToPgn(tcnString: string): string;

export function pgnToTcn(pgnString: string): string;
