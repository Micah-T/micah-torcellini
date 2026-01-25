// https://dev.to/jonoyeong/excerpts-with-eleventy-4od8
const striptags = require("striptags");

function extractExcerpt(article) {
    content = article;
  
    excerpt = striptags(content)
      .substring(0, 200) // Cap at 200 characters
      .replace(/^\\s+|\\s+$|\\s+(?=\\s)/g, "")
      .trim()
      .concat("...");
    return excerpt;
  }

module.exports = function(content) {
    return extractExcerpt(content);
}