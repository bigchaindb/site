Testimonials
------------------

The [testimonials component](../_src/_includes/testimonials.html)'s quotes are based on simple YAML data defined in [`_src/data/testimonials.yml`](../_src/data/testimonials.yml) with different arrays. Each array holds a total of 3 quotes.

So the testimonials component consists of various files:

- [component](../_src/_includes/testimonials.html)
- [section](../_src/_includes/section-testimonials.html)
- [data](../_src/data/testimonials.yml)
- [styles](../_src/_assets/styles/bigchain/_testimonials.scss)
- [js](../_src/_assets/javascripts/bigchain/testimonials.js)

### Photos

Photos of quotees need to be square and should be at least or exact 144x144px. The lazy retina technique is in use where the photo is the @2x resolution but is scaled down by 50% with CSS. Photo paths are relative to `/assets/img/`.

### JavaScript

The small js component only handles activating the quotes intro animation once the whole section is in viewport. The component needs to be activated either globally or on each page it is used by calling:

```js
Testimonials.init();
```

### Select and output a set of quotes

A set of quotes can be set as custom variable `quotes` in the YAML Front Matter of the page where the testimonials component has been included.

E.g. on the frontpage [`_src/index.html`](../_src/index.html) we want to include the whole testimonials section and use `set3` for the quotes. So in the YAML Front Matter of that file, write:

```
---

quotes: set3

---
```

In the content of the page where you want to have the testimonials section include it:

```
<body>
    {% include section-testimonials.html  %}
</body>
```

The value of the `quotes` variable will grab the associated set of quotes and outputs them on the frontpage.
