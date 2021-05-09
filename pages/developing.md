---
title: Websites I've Developed
permalink: /developing/
---
<ol>
{% for site in sites %}
<li><a href="{{ site.url }}">{{ site.title }}</a></li>
{% endfor %}
</ol>