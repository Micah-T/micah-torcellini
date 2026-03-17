---
title: Simple Pure CSS/HTML Timeline (with Extra Eleventy Integration)
tags: ["digital-humanities", "web development", eleventy]
---
I wanted a simple historical timeline for a companion website for an academic presentation. I don't have time to cover all the historical events that might be relevant to people's own interests, so I wanted to provide a timeline to aid people in orienting themselves and making further historical connections. Initially I thought I would have to use JavaScript, but I ultimately was able to do it in pure CSS and semantic HTML. While there are many JavaScript libraries, they are for the most part, bloated, not performant, inaccessible, and don't degrade nicely in unsupported browsers. While my solution is quite basic, it does the job well in a performant and accessible manner, and does degrade gracefully in older browsers. While there might be times for more complicated solutions, I suspect that most situations will be served well by a simpler one like this. 

## The CSS and HTML

The basic principle is to represent the timeline items as a list, and create the the timeline's visual presentation using CSS variables. Using a list means that the items are represented semantically. This aids accessibility and allows it to gracefully degrade in browsers that do not support CSS variables. 

The basic method is to calculate a "scale" (how wide each year is) and then use that as a factor to calculate how far from the beginning of the timeline each item should begin and how wide each item should be. the lines are drawn using borders, and text is allowed to overflow. In other words:
- period (total number of years in timeline) = end - beginning. 
- scale (how wide each year is) = (1 / period) &times; the width of the timeline (which itself can be defined using any CSS necessary for your layout).
- give each item a left-margin of the distance it is from the beginning: (start year of the item - the start year of the timeline) &times; scale. 
- each item width = (end year of item - beginning year of item ) &times; scale. 

For accessibility, both because borders do not have any representation in the accessibility tree and because it is helpful to all users to know precise years, you should include the years in the text of each item. This also means that the meaning will still be accessible in browsers that do not support CSS variables; the timeline will degrade to a simple list. 

There is one bug that I haven't solved yet, which is that the gridlines are not of a consistent thickness in Firefox, but are in Chromium-based browsers.

### Example

```html
<link rel="stylesheet" href="/assets/css/timeline.css">
<div class="timeline-container">
    <ol class="timeline" style="--timeline-start: 1850; --timeline-end: 1958">
        <li style="--start: 1874; --end: 1934; --bar-color: green">1874-1934: Gustav Holst</li>
        <li style="--start: 1872; --end: 1958; --bar-color: green">1872-1958: Ralph Vaughan Williams</li>
        <li style="--start: 1914; --end: 1918; --bar-color: red">1914-1918: World War I</li>
        <li style="--start: 1938; --end: 1845; --bar-color: red">1938-1945: World War II</li>
        <li style="--start: 1918; --end: 1918; --bar-color: purple">1918: Holst&rsquo;s <i>The Planets</i></li>
    </ol>
</div>
```

<link rel="stylesheet" href="/assets/css/timeline.css">
<div class="timeline-container">
    </ol>
    <ol class="timeline" style="--timeline-start: 1850; --timeline-end: 1958">
        <li style="--start: 1874; --end: 1934; --bar-color: green">1874-1934: Gustav Holst</li>
        <li style="--start: 1872; --end: 1958; --bar-color: green">1872-1958: Ralph Vaughan Williams</li>
        <li style="--start: 1914; --end: 1918; --bar-color: red">1914-1918: World War I</li>
        <li style="--start: 1938; --end: 1845; --bar-color: red">1938-1945: World War II</li>
        <li style="--start: 1918; --end: 1918; --bar-color: purple">1918: Holst&rsquo;s <i>The Planets</i></li>
    </ol>
</div>


### The CSS Code
```css
/* parent element for timeline--creates sideways-scrolling */
.timeline-container {
    overflow-x: scroll;
}

/* timeline list--should be <ol> */
.timeline {
    /* keeps the timeline a reasonable width; on
     smaller screens it'll overflow because of the container. */
    --timeline-width: max(100%, 50em);
    /* the total number of years that we need to include */
    --timeline-period: calc(var(--timeline-end) - var(--timeline-start));
    /* the width of each year; is factor to determine the width of each item */
    --timeline-scale: calc((1 / var(--timeline-period)) * var(--timeline-width));
    /* gridlines */
    --grid-color: var(--grey-400);
    --grid-line-width: 1px;
    /* we want a gridline every decade */
    --grid-line-space: calc(var(--timeline-scale) * 10);
    /* and then we use gradients to make the lines */
    background: repeating-linear-gradient(to right, var(--grid-color) 0 var(--grid-line-width), transparent var(--grid-line-width) var(--grid-line-space), transparent var(--grid-line-space));
    padding: 1em 0;
    width: var(--timeline-width);
    max-width: unset;
}
.timeline li {
    --timeline-bar-height: 1em;
    /* I have --shade-color set in my CSS elsewhere. 
       You should set this default based on your theming */
    --bar-color: var(--shade-color);
    margin: 0.5em auto;
    /* While there are other methods for positioning, margin is simple and 
      works enough for this. 
      We calculate the total width of the years to the beginning of the bar */
    margin-left: calc((var(--start) - var(--timeline-start)) * var(--timeline-scale));
    /* how many years it is long */
    --period: calc(var(--end) - var(--start));
    /* and the finding the width */
    width: max(calc(var(--period) * var(--timeline-scale)), var(--timeline-bar-height));
    /* if we don't have this, it won't print the border colors */
    print-color-adjust: exact; 
    /* causes all kinds of problems if it's a list */
    display: block;
    /* keeps all the words on the same line */
    white-space: nowrap;
    padding: 0;
    /* actually creating the bar */
    border-top: var(--timeline-bar-height) solid var(--bar-color);
    /* if we were using max-width elsewhere we want to clear it */
    max-width: unset;
    }
```



## Extra Eleventy (and Obsidian!) Integration

I use [Obsidian](https://obsidian.md/) for my notes (which works nicely because markdown is native to [Eleventy](https://eleventy.dev)), so I use the [Chronos plugin](https://github.com/clairefro/obsidian-plugin-chronos) to make timelines to organize historical information. It isn't perfect, but it's available. Because I'm already using it, it would be nice to use its markup style to create timelines, especially since the raw HTML markup is a bit verbose. To do this, I installed the [Chronos Timeline MD](https://github.com/clairefro/chronos-timeline-md) package and created a shortcode. 

Add ```eleventyConfig.addShortcode("timeline", require("./_11ty/timeline.js"));``` into `.eleventy.js` ([Eleventy shortcode documentation ](https://www.11ty.dev/docs/shortcodes/)). 

In your content, the shortcode will work like this. It's a bit neater to capture the content in `capture` blocks and then pass it into the shortcode as a variable. The shortcode requires beginning and end years. 

```
{% raw %}
{% capture myTimeline %} 
- [1920~1960] {category name} Stuff that happened for 40 years
- [1930] {another category} thing that happened in 1930
{% endcapture %}
{% timeline myTimeline, 1900, 2000 %}
{% endraw %}
```

In `./_11ty/timeline.js`, this will produce the HTML. In short, it uses the Chronos Timeline MD package to parse the input, and then takes that data and parses it into HTML. 

```js
const chronos = require("chronos-timeline-md")

module.exports = function(markdown, timelineStart, timelineEnd) {
    const data = chronos.parseChronos(markdown);
    let htmlList = "";
    data.items.forEach(i => {
        let startYear = i.start.getUTCFullYear();
        let endYear = undefined;
        let years = startYear
        if (i.end) {
            endYear = i.end.getUTCFullYear();
            years = `${startYear}-${endYear}`
        }
        else {
            endYear = startYear;
        }
        let htmlListItem = `<li style="--start: ${startYear}; --end: ${endYear}" class="timeline-group-${i.group}">
        ${years}: 
        ${i.content}
        </li>`
        htmlList = htmlList + htmlListItem;
    });
    const html = `
        <link
        href="/assets/css/timeline.css"
        rel="stylesheet"
        type="text/css"
        >
        <div class="timeline-container">
        <ul class="timeline" style="--timeline-start: ${timelineStart}; --timeline-end: ${timelineEnd}">
            ${htmlList}
        </ul></div>
        `;
    return html
}
```

This worked with Chronos Timeline MD 1.0.5; since only using the parser and not also the final rendering really isn't a documented method, it might not work in any other version. In reality, creating your own parser is a better idea, so if you are good at Markdown-It plugins and make something, please do share it to <micah@torcellini.org> and I'll link to it from here (with your permission). My solution also only supports events, and not periods. 


This does result in CSS classes that we can use to control the colors, like so:
```css
li.timeline-group-1 {
    --bar-color: green;
}
li.timeline-group-2 {
    --bar-color: blue;
...
```

To emphasize, this Eleventy/Obsidian integration is probably questionable and you probably shouldn't use it for anything important. It's working for me for the time being, though. If the data could be represented in markdown directly, that would also make things better. Since timelines are important for digital humanities, I think it is worthwhile to give more thought to how these can work effectively with modern web technologies for best performance and accessibility. If we can make it work with our notetaking tools, all the better. 
