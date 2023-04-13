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

const assert = require("assert");
const base58 = require("../src/base58");

// Test vector
const TEST_VECTOR = [
    {
        raw: "",
        encode: "",
    },
    {
        raw: "61",
        encode: "2g",
    },
    {
        raw: "626262",
        encode: "1a3gV",
    },
    {
        raw: "636363",
        encode: "1aPEr",
    },
    {
        raw: "73696d706c792061206c6f6e6720737472696e67",
        encode: "LJe5Z59G5Zz6RYrqDjxxeX3vd16N",
    },
    {
        raw: "00eb15231dfceb60925886b67d065299925915aeb172c06647",
        encode: "19uhT2BqLZuRUjnQGCByg4RUm1bZ2jT3j2E",
    },
    {
        raw: "516b6fcd0f",
        encode: "ABnLTmg",
    },
    {
        raw: "bf4f89001e670274dd",
        encode: "YzxHqptA9nj4p",
    },
    {
        raw: "572e4794",
        encode: "3EFU7m",
    },
    {
        raw: "ecac89cad93923c02321",
        encode: "gb2yYxwXgzj3g4",
    },
    {
        raw: "10c8511e",
        encode: "1Rt5zm",
    },
    {
        raw: "00000000000000000000",
        encode: "11111111111111",
    },
    {
        raw: "000111d38e5fc9071ffcd20b4a763cc9ae4f252bb4e48fd66a835e252ada93ff480d6dd43dc62a641155a5",
        encode: "113MMjnNqJN6MKY7uez1h2WA1ztnozdosJpK3JiBzMSWD3zwwYxy5pX16phr",
    },
    {
        raw: "000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f202122232425262728292a2b2c2d2e2f303132333435363738393a3b3c3d3e3f404142434445464748494a4b4c4d4e4f505152535455565758595a5b5c5d5e5f606162636465666768696a6b6c6d6e6f707172737475767778797a7b7c7d7e7f808182838485868788898a8b8c8d8e8f909192939495969798999a9b9c9d9e9fa0a1a2a3a4a5a6a7a8a9aaabacadaeafb0b1b2b3b4b5b6b7b8b9babbbcbdbebfc0c1c2c3c4c5c6c7c8c9cacbcccdcecfd0d1d2d3d4d5d6d7d8d9dadbdcdddedfe0e1e2e3e4e5e6e7e8e9eaebecedeeeff0f1f2f3f4f5f6f7f8f9fafbfcfdfeff",
        encode: "113DUyZY2dc2LxFSMtsQ5k3gsHPkECmXt52nKM8ZY8z26NhMJWtsWSA7icPFuECstJ94XRDHZYFLSAQSTAftscnaBkMV84ECzEiD6GX5SZYMgrESBZ2ptsj8zFn6azDED6b8H81cwbZYU3GJTvetytsqVQKoqgrNEDCwYM9kiokZYaPgNVfkm8tswqpPqaniXEDKHxRBVpfuZYgk6SXQrdHtt4CETsKtagEDReNVDEvY4ZYo6WWZ9xVSttAYeXu4zSqEDXznZEz2QDZYuSvaau4MbttGu4bvp6JzEDeMCdGj8GNZZ1oLeceADkttPFUfxZCB9EDkhchJUE8XZZ89kiePG5uttVbt",
    },
];

// Encoding
describe("Base58-XMR encoding", () => {
    describe("encode", () => {
        it("should encode bytes correctly to base58-xmr", () => {
            for (const test of TEST_VECTOR) {
                const encode = base58.encode(Buffer.from(test.raw, "hex"));
                assert.equal(test.encode, encode);
            }
        });
    });
});
