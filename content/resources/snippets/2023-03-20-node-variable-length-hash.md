---
title: "Generating a variable length hash with node"
tags: ["Node JS"]
cite:
    name: Blake Miner
    href: https://gist.github.com/bminer/4600432
---

I wanted to generate a unique hash of a given length for screenshot filenames and found Blake Miner's [variableHash.js gist](https://gist.github.com/bminer/4600432) which is able to generate a variable-length hash of `data`.

Blakes version being 11 years old doesn't work with current Node (_v19_), there exists a newer version in the [fork by @timargra](https://gist.github.com/timargra/016f247dd83dbc97ea1d8f71dea38c3f) which is only 5 years old, but that version causes "_DeprecationWarning: Buffer() is deprecated_" warnings.

Below is my version with admittedly minor changes required to get this function working under Node v19:

```js
    const crypto = require('node:crypto');

    // Initialization Vector
    const IV = Buffer.from('068f7bb47896981d6c8b3f9a186591ae', 'hex');
    
    /**
     * Generate a variable-length hash of `data`.
     *
     * Similar to the answer here: http://crypto.stackexchange.com/a/3559/4829
     * If you want a b-bit hash of the message m, then use the first b bits of AES-CTR(SHA256(m)).
     * Rather than using the suggested algorithm in the stackexchange answer above, I developed
     * my own.
     *
     * I decided to derive AES256 initialization vector and key from the output of SHA256(data).
     * Then, the cipher is fed a zero-filled buffer as plaintext, which is encrypted using this key.
     * The result should be a pseudorandom number generator seeded with a 256-bit hash of `data`.
     *
     * In other words, compute SHA256(m) and treat the resulting 256-bit string as a 256-bit AES key.
     * Next, use AES in counter mode (with this key) to generate an unending stream of pseudorandom bits.
     * Take the first b bits from this stream, and call it your hash.
     * 
     * @author Blake Miner (bminer), timargra, Simon Dann (carbontwelve)
     * @see https://gist.github.com/timargra/016f247dd83dbc97ea1d8f71dea38c3f
     * @see https://gist.github.com/bminer/4600432
     * @param {*} data
     * @param {number} size
     * @param {BufferEncoding} encoding
     * @returns {string}
     */
    module.exports = (data, size = 5, encoding = 'hex') => {
      let output = Buffer.alloc(size);
      let hash = crypto.createHash('sha256');
      
      hash.update(data);
    
      let cipher = crypto.createCipheriv('aes256', hash.digest(), IV);
      let offset = output.write(cipher.update(output).toString('binary'));
      output.write(cipher.final().toString('binary'), offset);
      return output.toString(encoding);
    }
```