// Copyright (c) 2025 Emanuele Bellocchia
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

"use-strict";

const { Buffer } = require("buffer");

// Convert buffer (Little Endian) to BigInt
function toBigIntLE(buffer) {
    const reversed = Buffer.from(buffer).reverse();
    const hex = reversed.toString("hex");
    if (hex.length === 0) {
        return BigInt(0);
    }
    return BigInt("0x" + hex);
}

// Convert buffer (Big Endian) to BigInt
function toBigIntBE(buffer) {
    const hex = buffer.toString("hex");
    if (hex.length === 0) {
        return BigInt(0);
    }
    return BigInt("0x" + hex);
}

// Convert BigInt to buffer (Little Endian)
function toBufferLE(value, width) {
    let hex = value.toString(16);
    if (hex.length % 2 !== 0) {
        hex = "0" + hex;
    }

    const buffer = Buffer.from(hex, "hex");
    const reversed = buffer.reverse();

    if (width) {
        if (reversed.length < width) {
            const padding = Buffer.alloc(width - reversed.length, 0);
            return Buffer.concat([reversed, padding]);
        } else if (reversed.length > width) {
            return reversed.subarray(0, width);
        }
    }

    return reversed;
}

// Convert BigInt to buffer (Big Endian)
function toBufferBE(value, width) {
    let hex = value.toString(16);
    if (hex.length % 2 !== 0) {
        hex = "0" + hex;
    }

    const buffer = Buffer.from(hex, "hex");

    if (width) {
        if (buffer.length < width) {
            const padding = Buffer.alloc(width - buffer.length, 0);
            return Buffer.concat([padding, buffer]);
        } else if (buffer.length > width) {
            return buffer.subarray(buffer.length - width);
        }
    }
    return buffer;
}

//
// Exports
//
exports.toBigIntLE = toBigIntLE;
exports.toBigIntBE = toBigIntBE;
exports.toBufferLE = toBufferLE;
exports.toBufferBE = toBufferBE;
