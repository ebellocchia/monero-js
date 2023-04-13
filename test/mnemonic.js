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
const monero = require("../");

// Constants
const ENTROPY_BYTE_LEN = monero.mnemonic.ENTROPY_BYTE_LEN;
const MNEMONIC_INVALID_LEN_1 = "vials licks gulp people reorder tulips acquire cool lunar upwards recipe against ambush february shelter textbook annoyed veered getting swagger paradise total dawn";
const MNEMONIC_INVALID_LEN_2 = "vials licks gulp people reorder tulips acquire cool lunar upwards recipe against ambush february shelter textbook annoyed veered getting swagger paradise total dawn duets getting cool";
const MNEMONIC_INVALID_WORD = "vials licks gulp people reorder tulips acquire cool lunar upwards recipe against ambush february shelter textbook annoyed veered getting swagger paradise total notexistent duets getting";
const MNEMONIC_INVALID_CHECKSUM = "vials licks gulp people reorder tulips acquire cool lunar upwards recipe against ambush february shelter textbook annoyed veered getting swagger paradise total dawn duets cool";

// Test vector
const TEST_VECTOR = [
    {
        entropy: "56be20de94b0df2a2e506059d29a7051978b377c7cc361e167715ad13c95a909",
        mnemonic: "vials licks gulp people reorder tulips acquire cool lunar upwards recipe against ambush february shelter textbook annoyed veered getting swagger paradise total dawn duets",
        mnemonic_chksum: "vials licks gulp people reorder tulips acquire cool lunar upwards recipe against ambush february shelter textbook annoyed veered getting swagger paradise total dawn duets getting",
    },
    {
        entropy: "bd47836643eec5b11da9ef5458a990800d8e107d1699fd3eeec7a95599a6bd07",
        mnemonic: "mohawk apex jukebox rewind stacking lopped daily clue lesson eggs attire nightly ostrich elite rotate vacation pastry twofold seventh gutter quote mammal patio poker",
        mnemonic_chksum: "mohawk apex jukebox rewind stacking lopped daily clue lesson eggs attire nightly ostrich elite rotate vacation pastry twofold seventh gutter quote mammal patio poker lopped",
    },
    {
        entropy: "0858b6eb36900b3c853db4527acb607a4f995a19bcb334628e8e0ba424e58503",
        mnemonic: "shackles mayor jingle match mugged slackens aptitude tribal dexterity irritate zodiac laptop tossed scenic tiers awesome estate pelican rockets refer going utopia fading fever",
        mnemonic_chksum: "shackles mayor jingle match mugged slackens aptitude tribal dexterity irritate zodiac laptop tossed scenic tiers awesome estate pelican rockets refer going utopia fading fever pelican",
    },
    {
        entropy: "e1180e659a96b9ce9c7bc5b7d97f5703e302f60cb7b444d2d98129462085c608",
        mnemonic: "hire peculiar altitude ungainly refer lush dove haystack aztec violin cell coffee nuisance tanks tweezers friendly omission itches gang muffin swagger baby sickness spout",
        mnemonic_chksum: "hire peculiar altitude ungainly refer lush dove haystack aztec violin cell coffee nuisance tanks tweezers friendly omission itches gang muffin swagger baby sickness spout muffin",
    },
    {
        entropy: "905ea9e20ec5885fc1bb58d0a54a26a3db834bdd8e9f85d5a089dc3776522c02",
        mnemonic: "adapt gifts duke code hornet seismic gills jellyfish enhanced dating later blender scamper agenda tycoon avoid aggravate tipsy slackens espionage lectures nugget highway hockey",
        mnemonic_chksum: "adapt gifts duke code hornet seismic gills jellyfish enhanced dating later blender scamper agenda tycoon avoid aggravate tipsy slackens espionage lectures nugget highway hockey tipsy",
    },
];

// Mnemonic generation
describe("Mnemonic generation", () => {
    describe("generate", () => {
        it("should return a valid 24-word mnemonic phrase", () => {
            const mnemonic = monero.mnemonic.generate();
            assert.equal(mnemonic.split(" ").length, 24);
            assert.ok(monero.mnemonic.isValid(mnemonic));
        });
    });
    describe("generateWithChecksum", () => {
        it("should return a valid 25-word mnemonic phrase", () => {
            const mnemonic = monero.mnemonic.generateWithChecksum();
            assert.equal(mnemonic.split(" ").length, 25);
            assert.ok(monero.mnemonic.isValid(mnemonic));
        });
    });
});

// Mnemonic encoding
describe("Mnemonic encoding", () => {
    describe("encode", () => {
        it("should encode entropy correctly without checksum", () => {
            for (const test of TEST_VECTOR) {
                const mnemonic = monero.mnemonic.encode(Buffer.from(test.entropy, "hex"));
                assert.equal(mnemonic.split(" ").length, 24);
                assert.equal(test.mnemonic, mnemonic);
            }
        });
        it("should throw if entropy length is not valid", () => {
            assert.throws(() => {monero.mnemonic.encode(Buffer.alloc(ENTROPY_BYTE_LEN - 1))}, Error);
            assert.throws(() => {monero.mnemonic.encode(Buffer.alloc(ENTROPY_BYTE_LEN + 1))}, Error);
        });
    });
    describe("encodeWithChecksum", () => {
        it("should encode entropy correctly with checksum", () => {
            for (const test of TEST_VECTOR) {
                const mnemonic = monero.mnemonic.encodeWithChecksum(Buffer.from(test.entropy, "hex"));
                assert.equal(mnemonic.split(" ").length, 25);
                assert.equal(test.mnemonic_chksum, mnemonic);
            }
        });
        it("should throw if entropy length is not valid", () => {
            assert.throws(() => {monero.mnemonic.encodeWithChecksum(Buffer.alloc(ENTROPY_BYTE_LEN - 1))}, Error);
            assert.throws(() => {monero.mnemonic.encodeWithChecksum(Buffer.alloc(ENTROPY_BYTE_LEN + 1))}, Error);
        });
    });
});

// Mnemonic decoding
describe("Mnemonic decoding", () => {
    describe("decode", () => {
        it("should decode mnemonic correctly without checksum", () => {
            for (const test of TEST_VECTOR) {
                const entropy = monero.mnemonic.decode(test.mnemonic);
                assert.equal(test.entropy, entropy.toString("hex"));
            }
        });
        it("should decode mnemonic correctly with checksum", () => {
            for (const test of TEST_VECTOR) {
                const entropy = monero.mnemonic.decode(test.mnemonic_chksum);
                assert.equal(test.entropy, entropy.toString("hex"));
            }
        });
        it("should throw if invalid words number", () => {
            assert.throws(() => {monero.mnemonic.decode(MNEMONIC_INVALID_LEN_1)}, Error);
            assert.throws(() => {monero.mnemonic.decode(MNEMONIC_INVALID_LEN_2)}, Error);
        });
        it("should throw if not existent words", () => {
            assert.throws(() => {monero.mnemonic.decode(MNEMONIC_INVALID_WORD)}, Error);
        });
        it("should throw if invalid checksum", () => {
            assert.throws(() => {monero.mnemonic.decode(MNEMONIC_INVALID_CHECKSUM)}, Error);
        });
    });
});

// Mnemonic validation
describe("Mnemonic validation", () => {
    describe("isValid", () => {
        it("should return true if mnemonic is valid", () => {
            for (const test of TEST_VECTOR) {
                assert.ok(monero.mnemonic.isValid(test.mnemonic));
            }
        });
        it("should return false if mnemonic is not valid", () => {
            assert.equal(monero.mnemonic.isValid(MNEMONIC_INVALID_LEN_1), false);
            assert.equal(monero.mnemonic.isValid(MNEMONIC_INVALID_LEN_2), false);
            assert.equal(monero.mnemonic.isValid(MNEMONIC_INVALID_WORD), false);
            assert.equal(monero.mnemonic.isValid(MNEMONIC_INVALID_CHECKSUM), false);
        });
    });
});

// Mnemonic seed generation
describe("Mnemonic seed generation", () => {
    describe("toSeed", () => {
        it("should decode mnemonic correctly without checksum", () => {
            for (const test of TEST_VECTOR) {
                const entropy = monero.mnemonic.toSeed(test.mnemonic);
                assert.equal(test.entropy, entropy.toString("hex"));
            }
        });
        it("should decode mnemonic correctly with checksum", () => {
            for (const test of TEST_VECTOR) {
                const entropy = monero.mnemonic.toSeed(test.mnemonic_chksum);
                assert.equal(test.entropy, entropy.toString("hex"));
            }
        });
        it("should throw if invalid words number", () => {
            assert.throws(() => {monero.mnemonic.toSeed(MNEMONIC_INVALID_LEN_1)}, Error);
            assert.throws(() => {monero.mnemonic.toSeed(MNEMONIC_INVALID_LEN_2)}, Error);
        });
        it("should throw if not existent words", () => {
            assert.throws(() => {monero.mnemonic.toSeed(MNEMONIC_INVALID_WORD)}, Error);
        });
        it("should throw if invalid checksum", () => {
            assert.throws(() => {monero.mnemonic.toSeed(MNEMONIC_INVALID_CHECKSUM)}, Error);
        });
    });
});
