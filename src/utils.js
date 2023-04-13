// Copyright (c) 2023 Emanuele Bellocchia
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

//
// External functions
//

function toUint(val) {
    return val >>> 0;
}

function mod(val, n) {
    return ((val % n) + n) % n;
}

function bufferPad(buf, pad_len) {
    const padded_buf = Buffer.alloc(pad_len, 0);
    buf.copy(padded_buf);
    return padded_buf;
}

function instanceOfNumber(n) {
    return typeof(n) === "number" || n instanceof Number;
}

function instanceOfString(s) {
    return typeof(s) === "string" || s instanceof String;
}

//
// Exports
//
exports.toUint = toUint;
exports.mod = mod;
exports.bufferPad = bufferPad;
exports.instanceOfNumber = instanceOfNumber;
exports.instanceOfString = instanceOfString;
