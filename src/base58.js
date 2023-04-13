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

const bs58 = require("bs58");

//
// Constants
//
const DEC_BLOCK_BYTE_LEN = 8;
const ENC_BLOCK_BYTE_LEN = 11;
const ENC_BLOCK_BYTE_LENS = [0, 2, 3, 5, 6, 7, 9, 10, 11];
const PAD_CHAR = "1";

//
// Internal functions
//

// Pad block
function _padBlock(s, pad_len) {
    if (s.length < pad_len) {
        let itr_num = pad_len - s.length;
        for (let i = 0; i < itr_num; i++) {
            s = PAD_CHAR + s;
        }
    }
    return s;
}

//
// External functions
//

// Encode buffer
function encode(buf) {
    let enc = "";

    const tot_block_cnt = Math.floor(buf.length / DEC_BLOCK_BYTE_LEN);
    const last_block_enc_len = buf.length % DEC_BLOCK_BYTE_LEN;

    for (let i = 0; i < tot_block_cnt; i++) {
        const block_enc = bs58.encode(
            buf.slice(i * DEC_BLOCK_BYTE_LEN, (i + 1) * DEC_BLOCK_BYTE_LEN)
        );
        enc += _padBlock(block_enc, ENC_BLOCK_BYTE_LEN);
    }

    if (last_block_enc_len > 0) {
        const block_enc = bs58.encode(
            buf.slice(tot_block_cnt * DEC_BLOCK_BYTE_LEN)
        );
        enc += _padBlock(block_enc, ENC_BLOCK_BYTE_LENS[last_block_enc_len]);
    }

    return enc;
}

//
// Exports
//
exports.encode = encode;
