let Nunjucks = require("nunjucks");
let pluginSass = require("eleventy-plugin-dart-sass");
const Image = require("@11ty/eleventy-img");
const moment = require('moment');
const timeToRead = require('eleventy-plugin-time-to-read');
const pluginTOC = require('eleventy-plugin-toc')
const markdownIt = require('markdown-it')
const markdownItAnchor = require('markdown-it-anchor')

moment.locale('en');

// images
async function imageShortcode(src, alt, sizes) {
  let metadata = await Image(src, {
    widths: [300, 800, 1600, 2048],
    formats: ["webp", "jpeg"],
    urlPath: "/images/",
    outputDir: "./build/images/",
  });

  let imageAttributes = {
    alt,
    sizes: '100vw',
    loading: "lazy",
    decoding: "async",
  };

  // You bet we throw an error on missing alt in `imageAttributes` (alt="" works okay)
  return Image.generateHTML(metadata, imageAttributes);
}

module.exports = function (eleventyConfig) {
 

    eleventyConfig.addPlugin(pluginSass, {
        watch: ['./src/scss/**/*.{scss,sass}', '!node_modules/**'],
        sassLocation: './src/scss/',
        outDir: './build/css/',
        sassIndexFile: 'main.scss',
        outFileName: 'main.css',
    });

    eleventyConfig.addWatchTarget("./src/images/");
   
    eleventyConfig.addPassthroughCopy({ "src/static": "/" });

    eleventyConfig.addWatchTarget("./src/js/");
    eleventyConfig.addPassthroughCopy("./src/js/");

    let nunjucksEnvironment = new Nunjucks.Environment(
        new Nunjucks.FileSystemLoader("src/_includes")
    );

    eleventyConfig.addWatchTarget("./src/**/*.{njk,nunjucks}");

    eleventyConfig.setLibrary("njk", nunjucksEnvironment);
    
    eleventyConfig.setLibrary(
      'md',
      markdownIt({
        html: true,
      }).use(markdownItAnchor)
    )
    
    // filter time in posts
    eleventyConfig.addFilter('dateIso', date => {
        return moment(date).toISOString();
      });
     
      eleventyConfig.addFilter('dateReadable', date => {
        return moment(date).utc().format('LL'); // E.g. May 31, 2019
      });

      eleventyConfig.addNunjucksAsyncShortcode("image", imageShortcode);
      eleventyConfig.addLiquidShortcode("image", imageShortcode);
      eleventyConfig.addJavaScriptFunction("image", imageShortcode);
      
    eleventyConfig.addPlugin(timeToRead);
    eleventyConfig.addPlugin(pluginTOC);

    return {
        dir: {
            input: "./src",
            output: "./build",
        },
        markdownTemplateEngine: "njk",
    }; 
};