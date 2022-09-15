(Eleventy-base-blog readme below)
# Micah Torcellini's modification
## YouTube shortcode
Embeds a responsive, [lazyloading](https://github.com/paulirish/lite-youtube-embed) YouTube video. The width and height should be reduced fractions (i.e. aspect ratio). Currently any combination of aspect ratio values will still create a 16x9 video; if needed, this can be updated in the future.
```
{% ytEmbed 'id', width, height, 'title', 'optional css classes'}
{% ytEmbed 'ZHKVYSwl67M', 16, 9, 'About Scramble the Duck', 'card' %}
```
## Images
Can be embedded by the normal markdown method
```
![Scramble's diploma from Stormy Heights Academy](/assets/images/diploma.jpeg)
```
.jpg files will be renamed to .jpeg in the build process. To avoid confusion, it is best to rename files in source to .jpeg.

Card images (1000w) have the suffix `-card` appended.

Only JPEG files (not PNG) are resized.

SVGs are optimized by SVGO.
## Data
- `_data/navigation.json` controls navigation.
- `_data/videos.json` generates the video gallery.
- `_data/metadata.json` is used throughout the site.
- `_data/livestream.json` controls livestream notifications and page. `"alert"` determines whether or not the notification boxes have the CSS modifier class `"-alert"` added. Currently, it makes the box red. `"id"` is the YouTube video ID, and `"title"` is the appropriate title. `"time"` should be written in a human-readable format. To not have any notifications show, leave `"id"` blank.
## How-Tos
### Commands
- To run a development server: `npm run dev`
- To compile SASS: `npm run sass`
- To build: `npm run build`
- To deploy: after building, run `cd _site` to move into the correct directory; run `git status` and check that there are no unexpected changes. Then, run `git add --a` and `git commit -m "[insert commit message"]`, replacing [insert commit message] with "website update YYY-MM-DD"; to deploy, run `git push origin`.
## CSS
This project uses BEM syntax, modified by [ABEM](https://css-tricks.com/abem-useful-adaptation-bem/).

The grid structure and accessibility properties are heavily based on [Bootstrap](https://getbootstrap.com), but are configured differently to work with ABEM.

Font-sizes are often adjusted with [RFS](https://github.com/twbs/rfs).

[Color scheme by this protocol](https://refactoringui.com/previews/building-your-color-palette/)

### Structure
```
atoms (small, simple components)
global (styles that either apply globally or not to a specific component)
    mixins
    variables
    layout (see below)
    layouts (layout-specific design files)
    molecules (larger components)
    organisms (the largest components)
    utils (styles that function in the background, such as resets, see below)
```

### Layout
The grid uses the ABEM syntax. Columns are created using `.col`, and are assigned widths using `-w[value]` for wide and `-n[value]` for narrow.

For columns that will be equally sized, use "auto" for the value.

Example: 
````
    <div class="col -w6">This is six out of twelve units wide on a wide breakpoint</div>
    <div class="col -n6">This is six out of twelve units on both breakpoints</div>
    <div class="col -auto">This is an automatic width</div>
````

### Utils
`_normalize.scss` is from [normalize.css](https://github.com/necolas/normalize.css). 
`_reset.scss` contains some other minor reset styles.
### Accessability styles
`.-sr` is for screen reader-only content, and `.-skip-link` is for skip links and will become visible when focused.



# eleventy-base-blog

A starter repository showing how to build a blog with the [Eleventy](https://github.com/11ty/eleventy) static site generator.

[![Build Status](https://travis-ci.org/11ty/eleventy-base-blog.svg?branch=master)](https://travis-ci.org/11ty/eleventy-base-blog)

## Demos

* [Netlify](https://eleventy-base-blog.netlify.com/)
* [Get your own Eleventy web site on Netlify](https://app.netlify.com/start/deploy?repository=https://github.com/11ty/eleventy-base-blog)—seriously, just click OK a few times and it’s live—Netlify is amazing.
* [GitHub Pages](https://11ty.github.io/eleventy-base-blog/)

## Getting Started

### 1. Clone this repository:

```
git clone https://github.com/11ty/eleventy-base-blog.git my-blog-name
```


### 2. Navigate to the directory

```
cd my-blog-name
```

Specifically have a look at `.eleventy.js` to see if you want to configure any Eleventy options differently.

### 3. Install dependencies

```
npm install
```

### 4. Edit _data/metadata.json

### 5. Run Eleventy

```
npx eleventy
```

Or build and host locally for local development
```
npx eleventy --serve
```

Or build automatically when a template changes:
```
npx eleventy --watch
```

Or in debug mode:
```
DEBUG=* npx eleventy
```

### Implementation Notes

* `about/index.md` shows how to add a content page.
* `posts/` has the blog posts but really they can live in any directory. They need only the `post` tag to be added to this collection.
* Add the `nav` tag to add a template to the top level site navigation. For example, this is in use on `index.njk` and `about/index.md`.
* Content can be any template format (blog posts needn’t be markdown, for example). Configure your supported templates in `.eleventy.js` -> `templateFormats`.
	* Because `css` and `png` are listed in `templateFormats` but are not supported template types, any files with these extensions will be copied without modification to the output (while keeping the same directory structure).
* The blog post feed template is in `feed/feed.njk`. This is also a good example of using a global data files in that it uses `_data/metadata.json`.
* This example uses three layouts:
  * `_includes/layouts/base.njk`: the top level HTML structure
  * `_includes/layouts/home.njk`: the home page template (wrapped into `base.njk`)
  * `_includes/layouts/post.njk`: the blog post template (wrapped into `base.njk`)
* `_includes/postlist.njk` is a Nunjucks include and is a reusable component used to display a list of all the posts. `index.njk` has an example of how to use it.
