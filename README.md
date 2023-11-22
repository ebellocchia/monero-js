# Monero JS
[![Test](https://github.com/ebellocchia/monero-js/actions/workflows/test.yml/badge.svg)](https://github.com/ebellocchia/monero-js/actions/workflows/test.yml)

## Mnemonic

This library allows to handle mnemonic phrases and generate keys and addresses/subaddresses for Monero, like the Monero official wallet.

### Generation

Generate random entropy bytes and encode them to a mnemonic phrase.

    const monero = require("./monero-js");

    // No checksum (i.e. 24-word)
    let mnemonic = monero.mnemonic.mnemonicGenerate();
    console.log(mnemonic);

    // With checksum (i.e. 25-word)
    mnemonic = monero.mnemonic.mnemonicGenerateWithChecksum();
    console.log(mnemonic);

### Encoding

Get a mnemonic phrase from entropy bytes.\
This shall be used only if the entropy bytes are known and shall not be randomly generated. Otherwise, the previous methods shall be used.\
Entropy shall be 32-byte long. An `Error` is thrown if the entropy length is not valid.

    const monero = require("./monero-js");

    const entropy = Buffer.from("905ea9e20ec5885fc1bb58d0a54a26a3db834bdd8e9f85d5a089dc3776522c02", "hex");

    // No checksum (i.e. 24-word)
    let mnemonic = monero.mnemonic.mnemonicEncode(entropy);
    console.log(mnemonic);

    // With checksum (i.e. 25-word)
    mnemonic = monero.mnemonic.mnemonicEncodeWithChecksum(entropy);
    console.log(mnemonic);

### Decoding

Get back entropy bytes from a mnemonic phrase.\
Both mnemonics with and without checksum can be decoded.\
An `Error` is thrown if the mnemonic is not valid.

    const monero = require("./monero-js");

    const mnemonic = "exquisite wise diode lifestyle ornament bicycle pepper quick mowing five auburn easy ginger macro peeled upstairs psychic acoustic until pylons films sincerely gained hashing sincerely";
    const entropy = monero.mnemonic.mnemonicDecode(mnemonic);

    console.log(entropy.toString("hex"));

### Validation

Get if a mnemonic phrase is valid or not. It returns a boolean value.

    const monero = require("./monero-js");

    const mnemonic = "exquisite wise diode lifestyle ornament bicycle pepper quick mowing five auburn easy ginger macro peeled upstairs psychic acoustic until pylons films sincerely gained hashing sincerely";
    const is_valid = monero.mnemonic.mnemonicIsValid(mnemonic);

    console.log(is_valid);

### Seed Generation

Generate seed from a mnemonic phrase. For Monero, the seed is equal to the entropy bytes so it"s the same of decoding a mnemonic.

    const monero = require("./monero-js");

    const mnemonic = "exquisite wise diode lifestyle ornament bicycle pepper quick mowing five auburn easy ginger macro peeled upstairs psychic acoustic until pylons films sincerely gained hashing sincerely";
    const seed = monero.mnemonic.mnemonicToSeed(mnemonic);

    console.log(seed.toString("hex"));

## Wallet

This library allows to create Monero wallets and generate addresses.

### Construction

From seed:

    const monero = require("./monero-js");

    monero.wallet.initEcc().then(() => {
        const seed = Buffer.from("b8083b02224454c8671868930d0ae9e1aa347373ec450aaff336478ae32cc10d", "hex");
        const wallet = monero.wallet.fromSeed(seed);

        console.log("Private spend key:", wallet.privateSpendKey.toString("hex"));
        console.log("Private view key:", wallet.privateViewKey.toString("hex"));
        console.log("Public spend key:", wallet.publicSpendKey.toString("hex"));
        console.log("Public view key:", wallet.publicViewKey.toString("hex"));
    })

From private spend key (an `Error` is thrown if the private key is not valid):

    const monero = require("./monero-js");

    monero.wallet.initEcc().then(() => {
        const priv_skey = Buffer.from("b6514a29ff612189af1bba250606bb5b1e7846fe8f31a91fc0beb393cddb6101", "hex");
        const wallet = monero.wallet.fromPrivateSpendKey(priv_skey);

        console.log("Private spend key:", wallet.privateSpendKey.toString("hex"));
        console.log("Private view key:", wallet.privateViewKey.toString("hex"));
        console.log("Public spend key:", wallet.publicSpendKey.toString("hex"));
        console.log("Public view key:", wallet.publicViewKey.toString("hex"));
    })

From watch-only (an `Error` is thrown if one of the keys is not valid):

    const monero = require("./monero-js");

    monero.wallet.initEcc().then(() => {
        const priv_vkey = Buffer.from("b10e56f46ac431cc7b8374abe8eb569a30432a8738587416705514460b1f9e0b", "hex");
        const pub_skey = Buffer.from("310e380533336d850081ee63cece4a9ec6df17db97d67b18f35b4d5b406a2375", "hex");
        const wallet = monero.wallet.fromWatchOnly(priv_vkey, pub_skey);

        console.log("Private view key:", wallet.privateViewKey.toString("hex"));
        console.log("Public spend key:", wallet.publicSpendKey.toString("hex"));
        console.log("Public view key:", wallet.publicViewKey.toString("hex"));
    })

### Get Address

Primary, Integrated and subaddresses are supported.\
An `Error` is thrown if:
- The payment ID is not valid, in case of integrated addresses
- The indexes are not valid, in case of subaddresses

Example:

    const monero = require("./monero-js");

    monero.wallet.initEcc().then(() => {
        const seed = Buffer.from("b8083b02224454c8671868930d0ae9e1aa347373ec450aaff336478ae32cc10d", "hex");
        const wallet = monero.wallet.fromSeed(seed);

        // Primary address
        console.log("Primary address:", wallet.primaryAddress().encode());
        // Integrated address
        const payment_id = Buffer.from("d6f093554c0daa94", "hex");
        console.log("Integrated address:", wallet.integratedAddress().encode(payment_id));

        // Same as primary address
        console.log("Subaddress 0,0:", wallet.subaddress(0, 0).encode());
        // First parameter is subaddress index, second one is account index
        console.log("Subaddress 1,0:", wallet.subaddress(1, 0).encode());
        console.log("Subaddress 0,1:", wallet.subaddress(0, 1).encode());
        // Account index is zero by default
        console.log("Subaddress 2,0:", wallet.subaddress(2).encode());
    })

## Run tests

Run:

    npm run test

# License

This software is available under the MIT license.
