import { Chess } from "chess.js";

const ALPHABET = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!?{~}(^)[_]@#$,./&-*++=";
const PROMO_PIECES = "qnrbkp";

/**
 * Convert a board square (e.g. "e4") into a 0–63 index.
 *
 * @param {string} square
 * @returns {number}
 */
function squareToIndex(square) {
    const file = square.charCodeAt(0) - "a".charCodeAt(0); // 0–7
    const rank = parseInt(square[1], 10) - 1;              // 0–7
    return file + rank * 8;
}

/**
 * Convert a 0–63 index into a board square (e.g. "e4").
 *
 * @param {number} index
 * @returns {string}
 */
function indexToSquare(index) {
    const file = index % 8;
    const rank = Math.floor(index / 8) + 1;
    const fileChar = ALPHABET[file];
    if (!fileChar) {
        return "";
    }
    return fileChar + rank;
}

/**
 * A single chess move.
 *
 * @typedef {Object} Move
 * @property {string} [from] - Origin square (e.g. "e2"). Omitted for drop moves.
 * @property {string} to - Destination square (e.g. "e4").
 * @property {"q"|"r"|"n"|"b"|"k"|"p"} [promotion] - Promotion piece.
 * @property {"q"|"r"|"n"|"b"|"k"|"p"} [drop] - Drop piece (for variants allowing drops).
 */

/**
 * Decode a TCN-encoded string into a move object.
 *
 * @param {string} tcnString
 * @returns {Move[]}
 */
export function decodeTCN(tcnString) {
    const moves = [];

    for (let i = 0; i < tcnString.length; i += 2) {
        const code1 = ALPHABET.indexOf(tcnString[i]);
        let code2 = ALPHABET.indexOf(tcnString[i + 1]);
        const move = {};

        // handle promotions (second code > 63)
        if (code2 > 63) {
            const promoIndex = Math.floor((code2 - 64) / 3);
            move.promotion = PROMO_PIECES[promoIndex];

            // recalc code2 to get actual destination square
            const offset = ((code2 - 1) % 3) - 1;
            code2 = code1 + (code1 < 16 ? -8 : 8) + offset;
        }

        // handle drops (first code > 75)
        if (code1 > 75) {
            const dropIndex = code1 - 79;
            move.drop = PROMO_PIECES[dropIndex];
        } else {
            // normal from-square
            move.from = indexToSquare(code1);
        }

        // always set the to-square
        move.to = indexToSquare(code2);
        moves.push(move);
    }

    return moves;
}

/**
 * Convert one or more move objects into a TCN-encoded string.
 *
 * @param {Move|Move[]} moves
 * @returns {string}
 */
export function encodeTCN(moves) {
    if (!Array.isArray(moves)) {
        moves = [moves];
    }
    let result = "";

    moves.forEach((move) => {
        // compute source index
        let fromIdx;
        if (move.drop) {
            // drop piece encoding starts at index 79
            fromIdx = 79 + PROMO_PIECES.indexOf(move.drop);
        } else {
            fromIdx = squareToIndex(move.from);
        }

        // compute destination index
        let toIdx = squareToIndex(move.to);

        // adjust for promotion, if any
        if (move.promotion) {
            const pIdx = PROMO_PIECES.indexOf(move.promotion);
            const diff = toIdx < fromIdx
                ? 9 + toIdx - fromIdx
                : toIdx - fromIdx - 7;
            toIdx = 3 * pIdx + 64 + diff;
        }

        result += ALPHABET[fromIdx] + ALPHABET[toIdx];
    });

    return result;
}

/**
 * Convert a full TCN string into a PGN move-text string.
 *
 * @param {string} tcnString
 * @throws {Error} If a decoded move is illegal.
 * @returns {string}
 */
export function tcnToPgn(tcnString) {
    const chess = new Chess();
    const moves = decodeTCN(tcnString);

    for (const mv of moves) {
        // chess.js move API accepts { from, to, promotion? }
        chess.move({
            from: mv.from,
            to: mv.to,
            promotion: mv.promotion,
        });
    }

    // returns SAN move-text, numbered, e.g. "1. e4 e5 2. Nf3 Nc6"
    return chess.pgn();
}

/**
 * Convert a PGN move-text string into a TCN-encoded string.
 *
 * @param {string} pgnString
 * @throws {Error} - If the PGN string is invalid or fails to load.
 * @returns {string}
 */
export function pgnToTcn(pgnString) {
    const chess = new Chess();
    chess.loadPgn(pgnString);

    // verbose history gives [{ from, to, promotion?, … }, …]
    const history = chess.history({ verbose: true });
    return encodeTCN(history);
}
