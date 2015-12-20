CSS
------------------

### Vendor Prefixes

Just write the official, unprefixed syntax for all CSS 3 features, no need to write the vendor prefixed versions.

[Autoprefixer](https://github.com/postcss/autoprefixer) handles that for you automatically based on the browser versions defined in the task and data from [Can I Use](http://caniuse.com/).


SVG sprite
------------------

All icons and most assets are SVGs. A gulp task grabs all svg files from the `img/` folder and puts them as `<symbol>` into one SVG sprite file. Reference those icons with the SVG `<use>` element and their ID in the HTML where you want them to be:

```html
<svg class="logo" aria-labelledby="title">
    <title>Logo</title>
    <use xlink:href="/assets/img/sprite.svg#logo"></use>
</svg>
```
