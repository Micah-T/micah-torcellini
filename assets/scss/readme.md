The philosophy of this project is that it is easier to edit something directly than to override it. This contains a few choice components, rather than many, in order to make a leaner final CSS file.

This project uses BEM syntax, modified by [ABEM](https://css-tricks.com/abem-useful-adaptation-bem/).

The grid structure and accessibility properties are heavily based on [Bootstrap](https://getbootstrap.com), but are configured differently to work with ABEM.

Font-sizes are often adjusted with [RFS](https://github.com/twbs/rfs).

The current icons are from [https://iconsvg.xyz/](https://iconsvg.xyz/), which allows customization of appearance.

Structure
---------
- Layout: contains column structure files
- Design: contains design files
- Components: contains sectional components
- Utils: resets and accessibility styles
- Mixins: contains font-size and flexbox mixins


Layout
----
The grid is done using the ABEM syntax. Columns are created using `.col`, and are assigned widths using `-w[value]` for wide and `-n[value]` for narrow.

For columns that will be equally sized, use "auto" for the value.

Example: 
````
    <div class="col -w6">This is six out of twelve units wide on a wide breakpoint</div>
    <div class="col -n6">This is six out of twelve units on both breakpoints</div>
    <div class="col -auto">This is an automatic width</div>
````
Design
------
This needs to be edited to customize site design. Each site should have its own, unique design files here.

Components
----------
These are starter templates for commonly used website components. They probably need to be edited in order to customize the GUI.

Utils
-----
`_normalize.scss` is from [normalize.css](https://github.com/necolas/normalize.css). 
`_reset.scss` contains some other minor reset styles.
### Accessability styles
`.-sr` is for screen reader-only content, and `.-skip-link` is for skip links and will become visible when focused.

Mixins
----------
Contains mixins.
`_flexbox.scss` contains several flexbox-related mixins.
`_rfs.scss` and `_rfs_config.scss` are the [RFS](https://github.com/twbs/rfs)-related mixins.