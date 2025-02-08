const { DateTime } = require("luxon");
const fs = require("fs");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const pluginSyntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const slugify = require("slugify");
const striptags = require("striptags");
const yaml = require("js-yaml");
const excerpt = require("./_11ty/excerpt.js");

module.exports = function(eleventyConfig) {
  eleventyConfig.addPreprocessor("hide", "*", (data, content) => {
  	if(data.hide) {
  		return false;
  	}
  });

  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(pluginSyntaxHighlight);
  eleventyConfig.setDataDeepMerge(true);
	eleventyConfig.addDataExtension("yml", (contents) => yaml.load(contents));
  eleventyConfig.addLayoutAlias("base", "layouts/base.njk");
  eleventyConfig.addLayoutAlias("default", "layouts/default.njk");
  eleventyConfig.addLayoutAlias("post", "layouts/post.njk");
  eleventyConfig.addLayoutAlias("home", "layouts/landing.njk");
  eleventyConfig.addLayoutAlias("landing", "layouts/landing.njk");

  eleventyConfig.addFilter("excerpt", (content) => {
    return excerpt(content);
  });
  eleventyConfig.addFilter("readableDate", dateObj => {
    return DateTime.fromJSDate(dateObj, {zone: 'utc'}).toFormat("LLLL dd, yyyy");
  });
  eleventyConfig.addFilter("slugify-removeChars", function(value) {
    let product = slugify(value, {
      replacement: '-',    // replace spaces with replacement
      remove: /[*+~.()'"!:@’“”]/g,    // regex to remove characters
      lower: true          // result in lower case
    })
    return product;
  });
  eleventyConfig.addFilter("striptags", function(value) {
      let product = striptags(value);
      return product;
  });

  // shortcodes 
  eleventyConfig.addShortcode("ytEmbed", require("./_11ty/ytEmbed.js"));

  // https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string
  eleventyConfig.addFilter('htmlDateString', (dateObj) => {
    return DateTime.fromJSDate(dateObj, {zone: 'utc'}).toFormat('yyyy-LL-dd');
  });

  // Get the first `n` elements of a collection.
  eleventyConfig.addFilter("head", (array, n) => {
    if( n < 0 ) {
      return array.slice(n);
    }

    return array.slice(0, n);
  });

  eleventyConfig.addCollection("tagList", require("./_11ty/getTagList"));
// passthrough
  eleventyConfig.addPassthroughCopy("assets/js");
  eleventyConfig.addPassthroughCopy("assets/css");
  eleventyConfig.addPassthroughCopy("assets/files");
  eleventyConfig.addPassthroughCopy("assets/fonts");
  eleventyConfig.addPassthroughCopy("assets/images/site");
  eleventyConfig.addPassthroughCopy("robots.txt");
  eleventyConfig.addPassthroughCopy("CNAME");
  eleventyConfig.addPassthroughCopy("favicon.ico");

  /* Markdown Plugins */
  let markdownIt = require("markdown-it");
  let markdownItAnchor = require("markdown-it-anchor");
  let markdownItResponsive = require("@gerhobbelt/markdown-it-responsive");
  let markdownItLazy = require("markdown-it-image-lazy-loading");
  let markdownItDeflist = require("markdown-it-deflist");
  let markdownItFootnote = require('markdown-it-footnote');
  let markdownItAttrs = require("markdown-it-attrs");
  let mdOptions = {
    html: true,
    breaks: false,
    linkify: true,
    typographer: true
  };
  let anchorOptions = {
    permalink: false,
    permalinkClass: "direct-link",
    permalinkSymbol: "#"
  };

  let riOptions = {
    responsive :{
      'srcset': {
        '*.jpeg': [
          {width: 800,},
          {width: 200, 
            rename: {
              suffix: '-w200'
            },
          },
          {width: 300, 
            rename: {
              suffix: '-w300'
            },
          },
          {width: 600, 
            rename: {
              suffix: '-w600'
            },
          },
          {width: 800, 
            rename: {
              suffix: '-w800'
            },
          },
          {width: 1000, 
            rename: {
             suffix: '-w1000'
            },
        } ]
      },
      'sizes': {
        '*': '(min-width: 36em) 33.3vw, 100vw',
      }
    }
  };

  let md = markdownIt(mdOptions)
    .use(markdownItAnchor, anchorOptions)
    .use(markdownItResponsive, riOptions)
    .use(markdownItLazy)
    .use(markdownItDeflist)
    .use(markdownItAttrs)
    .use(markdownItFootnote);

  eleventyConfig.setLibrary("md", md);

  md.renderer.rules.footnote_block_open = function () {
      return '<h2>Footnotes</h2> \n <ol>';
  };
  md.renderer.rules.footnote_block_close = function () {
    return '</ol>';
  };
  md.renderer.rules.footnote_anchor = function () {
    return "";
  };

  md.renderer.rules.footnote_caption = function (tokens, idx) {
    var n = Number(tokens[idx].meta.id + 1).toString();

    if (tokens[idx].meta.subId > 0) {
      n += ':' + tokens[idx].meta.subId;
    }
  
    return  n;
  };

  eleventyConfig.setBrowserSyncConfig({
    callbacks: {
      ready: function(err, browserSync) {
        const content_404 = fs.readFileSync('_site/404.html');

        browserSync.addMiddleware("*", (req, res) => {
          // Provides the 404 content without redirect.
          res.write(content_404);
          res.end();
        });
      }
    }
  });

  return {
    templateFormats: [
      "md",
      "njk",
      "html",
      "liquid"
    ],

    // If your site lives in a different subdirectory, change this.
    // Leading or trailing slashes are all normalized away, so don’t worry about it.
    // If you don’t have a subdirectory, use "" or "/" (they do the same thing)
    // This is only used for URLs (it does not affect your file structure)
    pathPrefix: "/",

    markdownTemplateEngine: "liquid",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk",
    passthroughFileCopy: true,
    dir: {
      input: ".",
      includes: "_includes",
      data: "_data",
      output: "_site"
    }
  }
};