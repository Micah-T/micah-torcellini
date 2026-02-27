---
title: Simple Pure CSS/HTML Timeline (with Extra Eleventy Integration)
tags: ["digital-humanities", "web development", eleventy]
---
I wanted an online time for a companion website for an academic presentation that I'm presenting at a couple of different conferences this semester. I don't have time to cover all the historical events, so I wanted to provide a timeline to aid people in orienting themselves and making further historical connections. Initially I thought I would have to use JavaScript, but I ultimately was able to do it in pure CSS and semantic HTML. While this is a very basic timeline, it does the basic job well in a performant and accessible manner. 

## The CSS and HTML

The basic principle is to represent the timeline items as a list, and draw the timeline using CSS variables. Using a list means that the items are represented semantically. This aids accessibility and allows it to gracefully degrade in browsers that do not support CSS variables. 

The basic method is to calculate a "scale" (how wide each year is) and then use that as a factor to calculate how far from the beginning of the timeline each item should begin and how wide each item should be. the lines are drawn using borders, and text is allowed to overflow. 

For accessibility, both because borders do not appear in the accessibility tree and because it is helpful to all users to know precise years, you should include the years in the text of each item. 




## Extra Eleventy (and Obsidian!) Integration

I use [Obsidian](https://obsidian.md/) for my notes, so 

https://github.com/clairefro/obsidian-plugin-chronos
