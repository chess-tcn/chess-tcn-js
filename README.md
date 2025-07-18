# Chess TCN JavaScript

## Overview
**Chess TCN JavaScript** is a JavaScript package designed to encode and decode TCN, a move format used by **Chess.com**'s API. This package allows developers to integrate TCN functionality into their web applications seamlessly.

## What is TCN?
TCN is a format used by **Chess.com** to transmit move lists in its JSON API. A typical endpoint for retrieving a game’s move list is:
```
https://www.chess.com/callback/live/game/{gameId}
```
This endpoint returns a `moveList` field containing a TCN string.

## Features
- Decode TCN strings into PGN (Portable Game Notation).
- Encode PGN back into TCN format.

## Installation
To install the package, use `npm`:
```bash
npm install chess-tcn
```

## Usage
Here’s a quick example of how to use the package:

```javascript
import { decodeTCN, encodeTCN, tcnToPgn, pgnToTcn } from "chess-tcn";

const tcnString = "mC0Kgv7Tbq5Qlt9IqHT7cM1TMFWOHs2MFwZRfm6Eeg";

// Decode a raw TCN string into move objects
const moves = decodeTCN(tcnString);
console.log("Decoded moves:", moves);

// Encode those move objects back into TCN
const newTcn = encodeTCN(moves);
console.log("Re-encoded TCN:", newTcn);

// Convert a raw TCN string to PGN
const pgn = tcnToPgn(tcnString);
console.log("PGN:", pgn);

// Convert PGN back into a TCN string
const newTcnString = pgnToTcn(pgn);
console.log("New TCN string:", newTcnString);
```

## API Reference
For complete details on usage, check out the [documentation](https://chess-tcn.github.io/docs).

## License
This project is licensed under the MIT License. See below for full text.
```
MIT License

Copyright (c) 2021-2025 chess-tcn

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
