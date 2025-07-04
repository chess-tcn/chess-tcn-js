import { Chess } from "chess.js";
import { decodeTCN, encodeTCN, tcnToPgn, pgnToTcn } from "../src/index.js";

describe("TCN encode/decode", () => {
    const sampleMove = { from: "e2", to: "e4" };
    const samplePromo = { from: "e7", to: "e8", promotion: "q" };
    const sampleDrop = { drop: "n", to: "e4" };

    test("encodeTCN + decodeTCN roundtrip for simple move", () => {
        const tcn = encodeTCN(sampleMove);
        const back = decodeTCN(tcn);
        expect(back).toEqual([sampleMove]);
    });

    test("encodeTCN + decodeTCN roundtrip for multiple moves", () => {
        const moves = [sampleMove, samplePromo];
        const tcn = encodeTCN(moves);
        const backArr = decodeTCN(tcn);
        expect(backArr).toEqual(moves);
    });

    test("encodeTCN + decodeTCN handles promotions", () => {
        const tcn = encodeTCN(samplePromo);
        const back = decodeTCN(tcn);
        expect(back).toEqual([samplePromo]);
    });

    test("encodeTCN + decodeTCN handles drops", () => {
        const tcn = encodeTCN(sampleDrop);
        const back = decodeTCN(tcn);
        expect(back).toEqual([sampleDrop]);
    });
});

describe("PGN TCN integration", () => {
    const pgn1 = "1. e4 e5 2. Nf3 Nc6";
    let tcn, roundPgn;

    test("pgnToTcn produces a valid TCN string", () => {
        tcn = pgnToTcn(pgn1);
        expect(typeof tcn).toBe("string");
        // length should be even and > 0
        expect(tcn.length).toBeGreaterThan(0);
        expect(tcn.length % 2).toBe(0);
    });

    test("tcnToPgn reproduces original PGN", () => {
        roundPgn = tcnToPgn(tcn);
        let chess = new Chess();
        chess.loadPgn(pgn1);
        // compare with PGN with headers
        expect(roundPgn).toBe(chess.pgn());
    });

    test("pgnToTcn throws on invalid PGN", () => {
        expect(() => pgnToTcn("invalid pgn")).toThrow();
    });

    test("tcnToPgn throws on illegal TCN sequence", () => {
        // create a bogus TCN: e.g. code for e2→e9 (illegal square)
        const badTcn = encodeTCN({ from: "e2", to: "e9" });
        expect(() => tcnToPgn(badTcn)).toThrow();
    });
});
