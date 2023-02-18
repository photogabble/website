const ObjectCache = require('../helpers/cache');
const { spawn } = require('node:child_process');
const chalk = require('chalk');
const path = require('node:path');
const fs = require('node:fs');

/**
 * Uses the system which command to check if a given command exists in the users' path.
 * This is of course linux/unix specific and will need updating if this is deployed on
 * a windows box... or there might be a node built in I am unaware of that does this??
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

function rootPath(p){
  return path.resolve(process.env.ELEVENTY_ROOT, p);
}

module.exports = function (eleventyConfig, options = {}) {
  if (options.dist) eleventyConfig.addPassthroughCopy(options.dist);

  const cache = new ObjectCache('font-subsetting');
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
    const cachedUnicodeHexRange = cache.get('cs');
    const CharacterSet = await import('characterset');
    const cs = new CharacterSet.default(glyphs.getUnique());
    const unicodeHexRange = cs.toHexRangeString();
    const rootDist = options.dist ? rootPath(options.dist) : false;
    let srcFiles = (options.srcFiles ?? []).map((src) => {
      const info = path.parse(src);
      const dir = rootDist ? rootDist : info.dir;

      return {
        src: rootPath(src),
        dist: `${dir}/${info.name}.subset${info.ext}`
      }
    });

    // If we have a cached unicode hex range that's identical to what has been discovered then we do not need to
    // rebuild the font files unless a subset font file is missing.
    if (cachedUnicodeHexRange && cachedUnicodeHexRange === unicodeHexRange) {
      srcFiles = srcFiles.filter((file) => fs.existsSync( file.dist) === false);

      if (srcFiles.length === 0) {
        console.log(chalk.blue('[@photogabble/glyphs]'), chalk.green('[OK]'), 'Matching cached charset found, not rebuilding fonts');
        return;
      }
    }

    console.log(chalk.blue('[@photogabble/glyphs]'), `Identified ${glyphs.chars.size} unique glyphs in use, creating subset`);
    console.log(chalk.blue('[@photogabble/glyphs]'), 'Codepoint Range:', unicodeHexRange);
    console.log(chalk.blue('[@photogabble/glyphs]'), `Subsetting ${srcFiles.length} font files.`);

    // If we must run, first check if pyftsubset is available in our path
    if ((await checkCommandExists('pyftsubset')) === false) {
      console.log(chalk.blue('[@photogabble/glyphs]'), chalk.red('[ERROR]'), 'Unable to locate pyftsubset, please install via "pip install fonttools"');
      return;
    }

    const promises = [];
    for (const file of srcFiles) {
      promises.push(new Promise((resolve) => {
        console.log(chalk.blue('[@photogabble/glyphs]'), chalk.yellow('[..]'), `Processing: ${file.src}`);
        const buildProcess = spawn(
          "pyftsubset",
          [
            file.src,
            `--output-file=${file.dist}`,
            `--unicodes=${cs.toHexRangeString()}`,
            '--flavor=woff2',
          ],
          { stdio: "inherit" }
        );

        buildProcess.on('error', (err) => console.error(err));

        buildProcess.on("close", () => {
          console.log(chalk.blue('[@photogabble/glyphs]'), chalk.green('[OK]'), `Saved: ${file.dist}`);
          resolve();
        });
      }));
    }

    await Promise.all(promises);

    // Cache unicode hex range for 10 years (forever...)
    cache.set('cs', unicodeHexRange, 86400 * 365 * 10);

    console.log(chalk.blue('[@photogabble/glyphs]'), chalk.green('[OK]'), `Complete`);
  });
};