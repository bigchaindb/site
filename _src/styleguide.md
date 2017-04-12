---
layout: page

title: Style Guide
sitemap: false
---

## Colors

### Primary

<div class="grid grid--gutters grid--full grid-medium--fit">
    {% for color in site.data.colors.primary %}
    <div class="grid__col">
        <div class="color {{ color.name }}">
            <span class="color-meta color-name">${{ color.name }}</span>
            <span class="color-meta color-hex">#{{ color.hex }}</span>
        </div>
    </div>
    {% endfor %}
</div>

### Secondary

<div class="grid grid--gutters grid--full grid-medium--fit">
    {% for color in site.data.colors.secondary %}
    <div class="grid__col">
        <div class="color {{ color.name }}">
            <span class="color-meta color-name">${{ color.name }}</span>
            <span class="color-meta color-hex">#{{ color.hex }}</span>
        </div>
    </div>
    {% endfor %}
</div>

### Errors

<div class="grid grid--gutters grid--full grid-medium--fit">
    {% for color in site.data.colors.errors %}
    <div class="grid__col">
        <div class="color {{ color.name }}">
            <span class="color-meta color-name">${{ color.name }}</span>
            <span class="color-meta color-hex">#{{ color.hex }}</span>
        </div>
    </div>
    {% endfor %}
</div>


## Typography

The main branding typeface is [**Europa**](http://www.europatype.com/articledetail/17), used for both text and headline. Europa is only [available from Typekit](https://typekit.com/fonts/europa) or as a paid download. Please consult a designer to assist you in using this font in your documents & presentations.

<div class="typeface light">Europa Light</div>
<div class="typeface">Europa Regular</div>
<div class="typeface italic">Europa Regular Italic</div>
<div class="typeface bold">Europa Bold</div>

The light weight is only used for headlines from a certain size to retain readability on all screens. For the website this means only headings 1 - 4 are using light weight.

### Body Copy

Nullam quis risus eget urna mollis ornare vel eu leo. Cum sociis natoque penatibus et magnis dis [parturient montes](#), nascetur ridiculus mus. Nullam id dolor id nibh **ultricies vehicula**.

Donec *ullamcorper nulla* non metus auctor fringilla. Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit. Donec ullamcorper nulla non metus auctor fringilla.

Nullam quis risus eget urna mollis ornare vel eu leo. Cum sociis natoque penatibus et magnis dis [parturient montes](#), nascetur ridiculus mus. Nullam id dolor id nibh **ultricies vehicula**.


<p class="large">Maecenas sed diam eget risus varius blandit sit amet non magna. Donec id elit non mi porta gravida at eget metus.</p>

```html
<p class="large">Maecenas sed diam eget risus varius blandit sit amet non magna. Donec id elit non mi porta gravida at eget metus.</p>
```

<small>Maecenas sed diam eget risus varius blandit sit amet non magna.</small>

```html
<small>Maecenas sed diam eget risus varius blandit sit amet non magna.</small>
```

<p class="mini">Maecenas sed diam eget risus varius blandit sit amet non magna.</p>

```html
<p class="mini">Maecenas sed diam eget risus varius blandit sit amet non magna.</p>
```


## Headings

# Heading 1

## Heading 2

### Heading 3

#### Heading 4

##### Heading 5

###### Heading 6


## Lists

* Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit.
* Est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit.
* Maecenas sed diam eget risus varius blandit sit amet non magna.

1. Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit.
2. Est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit.
3. Maecenas sed diam eget risus varius blandit sit amet non magna.


## Logo

Logo can be used with a base class and modifier classes for size & color:

- `logo`: default logo
- `logo--sm`: small version
- `logo--full`: full width version
- `logo--white`: complete white version
- `logo--white--green`: white & green version

<svg class="logo logo--sm" aria-labelledby="title"><title>Logo Bigchain</title><use xlink:href="/assets/img/sprite.svg#logo"></use></svg>

<svg class="logo" aria-labelledby="title"><title>Logo Bigchain</title><use xlink:href="/assets/img/sprite.svg#logo"></use></svg>

<svg class="logo logo--full" aria-labelledby="title"><title>Logo Bigchain</title><use xlink:href="/assets/img/sprite.svg#logo"></use></svg>

<svg class="logo logo--sm logo--white--green" aria-labelledby="title"><title>Logo Bigchain</title><use xlink:href="/assets/img/sprite.svg#logo"></use></svg>

<svg class="logo logo--white--green" aria-labelledby="title"><title>Logo Bigchain</title><use xlink:href="/assets/img/sprite.svg#logo"></use></svg>

<svg class="logo logo--full logo--white--green" aria-labelledby="title"><title>Logo Bigchain</title><use xlink:href="/assets/img/sprite.svg#logo"></use></svg>

<svg class="logo logo--sm logo--white" aria-labelledby="title"><title>Logo Bigchain</title><use xlink:href="/assets/img/sprite.svg#logo"></use></svg>

<svg class="logo logo--white" aria-labelledby="title"><title>Logo Bigchain</title><use xlink:href="/assets/img/sprite.svg#logo"></use></svg>

<svg class="logo logo--full logo--white" aria-labelledby="title"><title>Logo Bigchain</title><use xlink:href="/assets/img/sprite.svg#logo"></use></svg>

```html
<svg class="logo logo--sm" aria-labelledby="title">
    <title>Logo Bigchain</title>
    <use xlink:href="/assets/img/sprite.svg#logo"></use>
</svg>

<svg class="logo" aria-labelledby="title">
    <title>Logo Bigchain</title>
    <use xlink:href="/assets/img/sprite.svg#logo"></use>
</svg>

<svg class="logo logo--full" aria-labelledby="title">
    <title>Logo Bigchain</title>
    <use xlink:href="/assets/img/sprite.svg#logo"></use>
</svg>
```


## Components

### Buttons

<a class="btn btn-primary">Button</a> <a class="btn btn-primary btn-xs">Button</a> <a class="btn btn-primary btn-sm">Button</a> <a class="btn btn-primary btn-lg">Button</a>

```html
<a class="btn btn-primary">Button</a>
<a class="btn btn-primary btn-xs">Button</a>
<a class="btn btn-primary btn-sm">Button</a>
<a class="btn btn-primary btn-lg">Button</a>
```

<a class="btn btn-secondary">Button</a> <a class="btn btn-secondary btn-xs">Button</a> <a class="btn btn-secondary btn-sm">Button</a> <a class="btn btn-secondary btn-lg">Button</a>

```html
<a class="btn btn-secondary">Button</a>
<a class="btn btn-secondary btn-xs">Button</a>
<a class="btn btn-secondary btn-sm">Button</a>
<a class="btn btn-secondary btn-lg">Button</a>
```

<a class="btn btn-blue">Button</a> <a class="btn btn-blue btn-xs">Button</a> <a class="btn btn-blue btn-sm">Button</a> <a class="btn btn-blue btn-lg">Button</a>

```html
<a class="btn btn-blue">Button</a>
<a class="btn btn-blue btn-xs">Button</a>
<a class="btn btn-blue btn-sm">Button</a>
<a class="btn btn-blue btn-lg">Button</a>
```

<a class="btn btn-violet">Button</a> <a class="btn btn-violet btn-xs">Button</a> <a class="btn btn-violet btn-sm">Button</a> <a class="btn btn-violet btn-lg">Button</a>

```html
<a class="btn btn-violet">Button</a>
<a class="btn btn-violet btn-xs">Button</a>
<a class="btn btn-violet btn-sm">Button</a>
<a class="btn btn-violet btn-lg">Button</a>
```

<a class="btn btn-link">Button</a> <a class="btn btn-link btn-xs">Button</a> <a class="btn btn-link btn-sm">Button</a> <a class="btn btn-link btn-lg">Button</a>

```html
<a class="btn btn-link">Button</a>
<a class="btn btn-link btn-xs">Button</a>
<a class="btn btn-link btn-sm">Button</a>
<a class="btn btn-link btn-lg">Button</a>
```


### Forms

<form class="form js-parsley" action="#">
    <div class="form-group">
        <input class="form-control" type="text" id="name" name="name" required>
        <label class="form-label" for="name">Your Name</label>
    </div>
    <div class="form-group">
        <input class="form-control" type="email" id="email" name="email">
        <label class="form-label" for="email">Your Email</label>
    </div>
    <div class="form-group">
        <input class="form-control" type="tel" id="phone" name="phone">
        <label class="form-label" for="phone">Your Phone</label>
    </div>
    <div class="form-group">
        <select class="form-control" id="select" name="select" required data-required="true">
            <option value="">Select me...</option>
            <option value="Automotive">Automotive</option>
            <option value="Banking">Banking</option>
            <option value="Consulting">Consulting</option>
            <option value="Data">Data</option>
            <option value="Automotive">Automotive</option>
            <option value="Banking">Banking</option>
            <option value="Consulting">Consulting</option>
            <option value="Data">Data</option>
            <option value="Automotive">Automotive</option>
            <option value="Banking">Banking</option>
            <option value="Consulting">Consulting</option>
            <option value="Data">Data</option>
        </select>
        <label class="form-label" for="industry">Industry</label>
    </div>
    <div class="form-group">
        <textarea class="form-control" id="comment" name="comment" rows="1"></textarea>
        <label class="form-label" for="comment">Autogrowing textarea</label>
    </div>
    <div class="form-group">
        <input class="btn btn-primary" type="submit" value="Submit">
    </div>
</form>

```html
<form class="form js-parsley" action="#">
    <div class="form-group">
        <input class="form-control" type="text" id="name" name="name" required>
        <label class="form-label" for="name">Your Name</label>
    </div>
    <div class="form-group">
        <input class="form-control" type="email" id="email" name="email">
        <label class="form-label" for="email">Your Email</label>
    </div>
    <div class="form-group">
        <input class="form-control" type="tel" id="phone" name="phone">
        <label class="form-label" for="phone">Your Phone</label>
    </div>
    <div class="form-group">
        <select class="form-control" id="select" name="select" required data-required="true">
            <option value="">Select me...</option>
            <option value="Automotive">Automotive</option>
            <option value="Banking">Banking</option>
            <option value="Consulting">Consulting</option>
            <option value="Data">Data</option>
            ...
        </select>
        <label class="form-label" for="industry">Industry</label>
    </div>
    <div class="form-group">
        <textarea class="form-control" id="comment" name="comment" rows="1"></textarea>
        <label class="form-label" for="comment">Autogrowing textarea</label>
    </div>
    <div class="form-group">
        <input class="btn btn-primary" type="submit" value="Submit">
    </div>
</form>
```

### Alerts

<div class="alert alert-success"><strong class="alert__title">Lucas ipsum</strong> dolor sit amet kenobi ubese yaka weequay aka trioculus</div>
<div class="alert alert-info"><strong class="alert__title">Lucas ipsum</strong> Lucas ipsum dolor sit amet kenobi ubese yaka weequay aka trioculus</div>
<div class="alert alert-warning"><strong class="alert__title">Lucas ipsum</strong> Lucas ipsum dolor sit amet kenobi ubese yaka weequay aka trioculus</div>
<div class="alert alert-danger"><strong class="alert__title">Lucas ipsum</strong> Lucas ipsum dolor sit amet kenobi ubese yaka weequay aka trioculus</div>

```html
<div class="alert alert-success">
    <strong class="alert__title">Lucas ipsum</strong>
    Lucas ipsum dolor sit amet kenobi ubese yaka weequay aka trioculus
</div>

<div class="alert alert-info">
    <strong class="alert__title">Lucas ipsum</strong>
    Lucas ipsum dolor sit amet kenobi ubese yaka weequay aka trioculus
</div>

<div class="alert alert-warning">
    <strong class="alert__title">Lucas ipsum</strong>
    Lucas ipsum dolor sit amet kenobi ubese yaka weequay aka trioculus
</div>

<div class="alert alert-danger">
    <strong class="alert__title">Lucas ipsum</strong>
    Lucas ipsum dolor sit amet kenobi ubese yaka weequay aka trioculus
</div>
```
