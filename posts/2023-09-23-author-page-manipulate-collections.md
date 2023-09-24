---
title: Making Author Pages for an Academic Journal in Eleventy, or, How to Manipulate Collection Data in Eleventy
tags: ["academic journal", westmarch, "web development", eleventy]
---
I was asked to make pages for the authors in the [*Westmarch* Literary Journal](https://westmarchjournal.org)'s website, which I've built using Eleventy. Many CMSs provide support for multiple authors and will generate pages for each author; this is something that is quite useful, so I wished to add it to this site. First, this project required a page for each author. Second, this project required a [page that lists all the authors](https://westmarchjournal.org/authors/). 

## Individual Author Pages

Making pages from data in Eleventy is fairly easy. [Pagination](https://www.11ty.dev/docs/pagination/) allows creating pages from a list in a data file, so this is a good start. [Raymond Camden did this](https://www.raymondcamden.com/2020/08/24/supporting-multiple-authors-in-an-eleventy-blog). His solution will work nicely for any site that has regular posters, but for a site like *Westmarch* where there are many authors with few articles it is better to generate the author list from the front matter. Otherwise, the `_data/authors.json` would quickly become unmanageable (currently, with only two issues online, there are already 13 authors with only one article each and a few more with multiple articles). We did want to be able to include author biographies on their page, however, so we also needed to use data provided in the `_data` folder. To summarize, the site needed to
- take data from `_data/authors.json` to generate pages with biographies
- use `collections.article` to find all the `author` front matter variables to generate the remaining pages
- only make one page for each author. 

The first task, then, is to merge the two sources of data for the pagination to use. This initially seems easy. Eleventy can use JavaScript in data files, so why couldn't we use a JavaScript data file to combine the two data sources and then make nice simple pagination front matter? But alas! There does not appear to be an easy way to access collections data in the `_data` files. Eleventy can, however, [paginate a collection](https://www.11ty.dev/docs/pagination/#paging-a-collection). This seems convenient, but it still requires collecting this data and removing duplicate authors, and it still does not allow adding the data from `_data/authors.json`. 

This is an exciting problem. I could not solve it. Thus, I asked my colleague [Elijah Mendoza](https://blog.elijahmendoza.nom.za/) who knows most programming things much better than I do. After working back and forth on solutions and reading documentation for a few days, he and I sat down on the hallway floor in our dorm and figured it out. Actually, he figured the tricky stuff out. The trick is to use [JavaScript object front matter](https://www.11ty.dev/docs/data-frontmatter/#javascript-object-front-matter) because it allows functions and also can access the collections data. It is not without its challenges, though. The exciting part is the `pagination` variable. The real trick is that, in order to use it to manipulate the pagination data, we need to use the [`before` callback](https://www.11ty.dev/docs/pagination/#the-before-callback). Let's walk through the code:

``` {% raw %}
---js 
{
    layout: "base",
    pagination: {

        // Initially, use the `_data/authors.json`.
        // We'll change it later using the `before` callback`.
        data: "authors",

        // `alias` names the variable for use in the template lower down. 
        alias: "authordata",

        // Only one author is on each page.
        size: 1,

        // This makes it so that all the author pages (rather than just the 
        // first one) appear in collections, which is important later.
        addAllPagesToCollections: true,

        // Now we get to manipulate the data! Yay!
        // Take the original data as `jsonAuthors` and the collection data
        // as `fullData`. 
        before: function(jsonAuthors, fullData) {

            // Take the collections.article data and make it into the object
            // format for the pagination. 
            // Warning: do not use a collection that the author pages are in. That will
            // result in a circular reference and Eleventy will be sad. If you use
            // collections.all, the author pages will be included. You do not want to 
            // exclude the author pages from collections because we'll use 
            // collections.author later.  
            const postAuthors = fullData.collections.article

                // Make the objects into the right format.
                .map(function(post) {
                    return { "name": post.data.author }
                })

                // Remove duplicates.
                .filter(author => !!author.name)

            // Join together the arrays of author objects from the JSON and from collections.
            const authors = [...jsonAuthors, ...postAuthors]

            // Filter for duplicates. Since `jsonAuthors` is first, that
            // author information will take precedence. 
            let uniqueAuthors = [];
            let index = {};
            for (const author of authors) {
                if (index[author.name]) continue;
                index[author.name] = true;
                uniqueAuthors.push(author)
            }
            return uniqueAuthors
        },
    },

    // Use Eleventy Nunjucks to compute some other front matter. 
    eleventyComputed: {  
        title : "{{ authordata.name }}",
        author: "{{ authordata.name }}",

        // We'll use this later; the `filterByAuthor` filter is discussed below.
        articlenumber: `{{ collections.article | filterByAuthor( authordata.name ) | length }}`
    },
    permalink: "authors/{{ authordata.name | slugify }}/",
    tags: ["author"]
}
---
{# insert nice normal template stuff here #}
{% endraw %}```

After this, we now have pagination to work with, and we can make a page for each author. Basically, we filter the `article` collection by author name and then loop through the articles. Eleventy does this quite easily. The easiest way to do this is to first make a `filterByAuthor()` Nunjucks filter in `.eleventy.js`. We can do this using the [configuration API](https://www.11ty.dev/docs/filters/). 

```js
module.exports = function(eleventyConfig) {
    // ...
  eleventyConfig.addFilter("filterByAuthor", function(collection, author) {
    let product = collection.filter((article) => article.data.author === author )
    return product
  });
  // ...
}
```
Once we have this filter in place, the rest of the page is quite simple:

``` {% raw %}
<h1>{{ authordata.name }}</h1>
<p>{{ authordata.bio }}</p>

{% set postlist = collections["article"] | filterByAuthor( authordata.name ) %}
<ul reversed class="postlist">
{% for post in postlist | reverse %}
    <li>
        <a href="{{ post.url | url }}">
                {{ post.data.title | safe }}
        </a>
    </li>
{% endfor %}
</ul>
<p><a href="/authors">See all authors.</a></p>
{% endraw %}```

## Listing All Authors

The next task is to make a page that lists all the authors. This is fairly simple. We use the `author` collection, which we can do because we tagged the individual author pages with `author`. By default, Eleventy only adds the first page made with a pagination template to collections, though, so we set [`addAllPagesToCollections: true`](https://www.11ty.dev/docs/pagination/#add-all-pagination-pages-to-collections) in the individual author page template above. It is also handy to have a filter to sort the authors by the number of their posts. The `articlenumber` variable was a string above because of how Nunjucks works for calculating front matter, so the `sortAuthorsByArticleNumber` function will make it into a string while sorting the author pages. 

```js
module.exports = function(eleventyConfig) {
// ...
  eleventyConfig.addFilter("sortAuthorsByArticleNumber", function(collection) {
    let product = collection.sort((a, b) => {
      return Number(a.data.articlenumber) - Number(b.data.articlenumber)
    })
    return product
  });
// ...
}
```

Now we can use this filter to make the author page. We can also insert the `articlenumber`. It is interesting information. 

``` {%raw %}
---
title: Authors
permalink: "/authors/"
layout: base
---
<h1>Authors</h1>
{% set postlist = collections["author"]  | sortAuthorsByArticleNumber %}
<ul reversed class="postlist">
{% for post in postlist | reverse %}
        <li>
            <a href="{{ post.url | url }}">
                    {{ post.data.title | safe }}
                {% set number = post.data.articlenumber %}
                &nbsp;({{ number }} article{% if number != 1 %}s{% endif %})
            </a>
        </li>
{% endfor %}
</ul>
{% endraw %}```

[The full page is available on the *Westmarch* website](https://westmarchjournal.org/authors/).

In conclusion, we use some exciting front matter tricks to manipulate the data `collections` data and merge it with JSON data using the `before` callback. This produces an array of objects to generate author pages with pagination. The simpler matter is collecting all these pages and making them into a page of all the authors. 