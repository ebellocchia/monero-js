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

const crc32 = require("crc-32");
const randomBytes = require("randombytes");
const englishWordlist = require('./wordlists/english.json');
const utils = require('./utils');

//
// Constants
//

const CHECKSUM_WORDS_NUM = 25;
const ENTROPY_BYTE_LEN = 32;
const LANG_UNIQUE_PREFIX_LEN = 3;
const VALID_WORDS_NUM = [24, 25];
const WORDLIST_LEN = englishWordlist.length;

//
// Internal functions
//

// Convert a 4-byte chunk to 3 words
function _bytesChunkToWords(bytes_chunk) {
    const chunk_int = bytes_chunk.readUInt32LE();
    const n = WORDLIST_LEN;

    const word1_idx = chunk_int % n
    const word2_idx = (Math.floor(chunk_int / n) + word1_idx) % n
    const word3_idx = (Math.floor(Math.floor(chunk_int / n) / n) + word2_idx) % n

    return [englishWordlist[word1_idx], englishWordlist[word2_idx], englishWordlist[word3_idx]];
}

// Convert 3 words to a 4-byte chunk
function _wordsToBytesChunk(word1, word2, word3) {
    const n = WORDLIST_LEN;

    const word1_idx = englishWordlist.indexOf(word1);
    const word2_idx = englishWordlist.indexOf(word2) % n;
    const word3_idx = englishWordlist.indexOf(word3) % n;

    return word1_idx + (n * utils.mod(word2_idx - word1_idx, n)) + (n * n * utils.mod(word3_idx - word2_idx, n));
}

// Encode entropy bytes to a list of words
function _encodeToList(entropy_bytes) {
    if (entropy_bytes.length !== ENTROPY_BYTE_LEN) {
        throw Error("Invalid entropy length");
    }

    const mnemonic_list = [];
    for (let i = 0; i < entropy_bytes.length / 4; i++) {
        words = _bytesChunkToWords(entropy_bytes.slice(i * 4, (i * 4) + 4));
        mnemonic_list.push(...words);
    }

    return mnemonic_list;
}

// Compute mnemonic checksum word
function _computeChecksumWord(mnemonic_list) {
    const payload = mnemonic_list.map(w => w.slice(0, LANG_UNIQUE_PREFIX_LEN)).join("");
    return mnemonic_list[utils.toUint(crc32.str(payload)) % mnemonic_list.length];
}

// Validate mnemonic words
function _validateWords(mnemonic_list) {
    return VALID_WORDS_NUM.includes(mnemonic_list.length) && mnemonic_list.filter(w => englishWordlist.indexOf(w) === -1).length === 0;
}

// Validate mnemonic checksum
function _mnemonicValidateChecksum(mnemonic_list) {
    // No checksum to be validated
    if (mnemonic_list.length !== CHECKSUM_WORDS_NUM) {
        return true;
    }

    const checksum_exp = mnemonic_list[mnemonic_list.length - 1];
    const checksum_got = _computeChecksumWord(mnemonic_list.slice(0, CHECKSUM_WORDS_NUM - 1));

    return checksum_exp === checksum_got;
}

//
// External functions
//

// Generate a mnemonic phrase (no checksum)
function generate() {
    const entropy_bytes = randomBytes(ENTROPY_BYTE_LEN);
    return encode(entropy_bytes);
}

// Generate a mnemonic phrase (with checksum)
function generateWithChecksum() {
    const entropy_bytes = randomBytes(ENTROPY_BYTE_LEN);
    return encodeWithChecksum(entropy_bytes);
}

// Encode entropy byte to mnemonic phrase (no checksum)
function encode(entropy_bytes) {
    return _encodeToList(entropy_bytes).join(" ");
}

// Encode entropy byte to mnemonic phrase (with checksum)
function encodeWithChecksum(entropy_bytes) {
    const mnemonic_list = _encodeToList(entropy_bytes);
    mnemonic_list.push(_computeChecksumWord(mnemonic_list));
    
    return mnemonic_list.join(" ");
}

// Decode a mnemonic phrase to entropy bytes
function decode(mnemonic) {
    const mnemonic_list = mnemonic.split(" ");

    if (!_validateWords(mnemonic_list)) {
        throw new Error("Invalid mnemonic phrase (invalid length or some words are not existent)");
    }

    if (!_mnemonicValidateChecksum(mnemonic_list)) {
        throw new Error("Invalid mnemonic phrase (invalid checksum)");
    }

    const entropy_bytes = Buffer.alloc(ENTROPY_BYTE_LEN);
    for (let i = 0; i < Math.floor(mnemonic_list.length / 3); i++) {
        const word1 = mnemonic_list[i * 3];
        const word2 = mnemonic_list[(i * 3) + 1];
        const word3 = mnemonic_list[(i * 3) + 2];

        entropy_bytes.writeUInt32LE(
            _wordsToBytesChunk(word1, word2, word3), i * 4
        );
    }

    return entropy_bytes;
}

// Get if a mnemonic is valid
function isValid(mnemonic) {
    try {
        decode(mnemonic);
        return true;
    }
    catch {
        return false;
    }
}

// Get seed from a mnemonic (same of decoding for Monero)
function toSeed(mnemonic) {
    return decode(mnemonic);
}

//
// Exports
//
exports.ENTROPY_BYTE_LEN = ENTROPY_BYTE_LEN;
exports.generate = generate;
exports.generateWithChecksum = generateWithChecksum;
exports.encode = encode;
exports.encodeWithChecksum = encodeWithChecksum;
exports.decode = decode;
exports.isValid = isValid;
exports.toSeed = toSeed;
