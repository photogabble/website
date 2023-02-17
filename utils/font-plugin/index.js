const { spawn } = require("child_process");
const chalk = require("chalk");

// TODO: could use node-html-parser to find glyph usage by dom element (e.g if I used a different font for headings)

/**
 *
 * @param command {string}
 * @returns {Promise<boolean>}
 */
function checkCommandExists(command) {
  return new Promise(resolve => {
    const processCheck = spawn('which', [command]);
    processCheck.on('exit', (code) => resolve(code === 0))
  });
}

module.exports = function (eleventyConfig, options = {}) {
  const glyphs = {
    chars: new Set(),
    add(text) {
      for (let char of text) {
        if ([' ', "\n", "\r", "\t"].includes(char) === false) this.chars.add(char);
      }
    },
    getUnique() {
      const out = Array.from(this.chars);
      out.sort();
      return out.join('');
    }
  };

  eleventyConfig.addTransform('identifyGlyphs', (content, outputPath) => {
    if (outputPath.endsWith('.html')) glyphs.add(content);
    return content;
  });

  eleventyConfig.on('eleventy.after', async () => {
    if ((await checkCommandExists('pyftsubset')) === false) {
      console.log(chalk.blue('[@photogabble/glyphs]'), chalk.red('[ERROR]'), 'Unable to locate pyftsubset, please install via "pip install fonttools"');
      return;
    }

    const CharacterSet = await import('characterset');
    const cs = new CharacterSet.default(glyphs.getUnique());

    // TODO: If the subset font files exist then check if the value of cs.toHexRangeString() has changed from the cached value
    // TODO: cache cs.toHexRangeString() forever, until its found to change

    console.log(chalk.blue('[@photogabble/glyphs]'), `Identified ${glyphs.chars.size} unique glyphs in use, creating subset`);
    console.log(chalk.blue('[@photogabble/glyphs]'), 'Codepoint Range:', cs.toHexRangeString());

    const promises = [];
    for (const src of options.srcFiles ?? []) {

      // TODO: workout the subset version of src and check if it exists
      //       if it does and the cached hex range is current then do not process

      promises.push(new Promise((resolve) => {
        console.log(chalk.blue('[@photogabble/glyphs]'), chalk.yellow('[...]'), `Processing: ${src}`);

        const buildProcess = spawn(
          "pyftsubset",
          [
            src,
            `--unicodes=${cs.toHexRangeString()}`,
            '--flavor=woff2',
          ],
          { stdio: "inherit" }
        );

        buildProcess.on('error', (err) => console.error(err));

        buildProcess.on("close", () => {
          console.log(chalk.blue('[@photogabble/glyphs]'), chalk.green('[OK]'), `Processed: ${src}`);
          resolve();
        });
      }));
    }

    await Promise.all(promises);
    console.log(chalk.blue('[@photogabble/glyphs]'), chalk.green('[OK]'), `Complete`);
  });
};