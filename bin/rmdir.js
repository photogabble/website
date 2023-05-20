#!/usr/bin/env node
const fs = require('node:fs');
process.argv.slice(2).map((fpath) => {
    if (fs.existsSync(fpath)) {
        try {
            fs.rmdirSync(fpath, {recursive: true})
        } catch (e) {
            console.warn('Error folder:', fpath, e)
        }
    }
});
process.exit(0);