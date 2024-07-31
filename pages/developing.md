---
title: Websites I've Developed
permalink: /developing/
---
If you would like to discuss web development or have a site built, contact me at [{{ metadata.author.email }}]({{ metadata.author.email }}).{.no-dropcap}

<ul>
{% for site in sites %}
<li><a href="{{ site.url }}">{{ site.title }}</a></li>
{% endfor %}
</ul>