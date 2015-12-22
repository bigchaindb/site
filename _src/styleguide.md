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

### Grays

<div class="grid grid--gutters grid--full grid-medium--fit">
    {% for color in site.data.colors.grays %}
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


# Typography

## Body Copy

Nullam quis risus eget urna mollis ornare vel eu leo. Cum sociis natoque penatibus et magnis dis [parturient montes](#), nascetur ridiculus mus. Nullam id dolor id nibh **ultricies vehicula**.

Donec *ullamcorper nulla* non metus auctor fringilla. Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit. Donec ullamcorper nulla non metus auctor fringilla.

```html
<p>Nullam quis risus eget urna mollis ornare vel eu leo. Cum sociis natoque penatibus et magnis dis <a href="#">parturient montes</a>, nascetur ridiculus mus. Nullam id dolor id nibh <strong>ultricies vehicula</strong>.</p>

<p>Donec <em>ullamcorper nulla</em> non metus auctor fringilla. Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit. Donec ullamcorper nulla non metus auctor fringilla.</p>
```

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


## Lists

* Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit.
* Est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit.
* Maecenas sed diam eget risus varius blandit sit amet non magna.

1. Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit.
2. Est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit.
3. Maecenas sed diam eget risus varius blandit sit amet non magna.


## Components

### Buttons

<a class="btn btn-primary">Button</a> <a class="btn btn-primary btn-xs">Button</a> <a class="btn btn-primary btn-sm">Button</a> <a class="btn btn-primary btn-lg">Button</a>

```html
<a class="btn btn-primary">Button</a>
<a class="btn btn-primary btn-xs">Button</a>
<a class="btn btn-primary btn-sm">Button</a>
<a class="btn btn-primary btn-lg">Button</a>
```


### Alerts

<div class="alert alert-success"><strong class="alert__title">Lucas ipsum</strong> dolor sit amet kenobi ubese yaka weequay aka trioculus</div>
<div class="alert alert-info"><strong class="alert__title">Lucas ipsum</strong> Lucas ipsum dolor sit amet kenobi ubese yaka weequay aka trioculus</div>
<div class="alert alert-warning"><strong class="alert__title">Lucas ipsum</strong> Lucas ipsum dolor sit amet kenobi ubese yaka weequay aka trioculus</div>
<div class="alert alert-danger"><strong class="alert__title">Lucas ipsum</strong> Lucas ipsum dolor sit amet kenobi ubese yaka weequay aka trioculus</div>

```html
<div class="alert alert-success"><strong class="alert__title">Lucas ipsum</strong>Lucas ipsum dolor sit amet kenobi ubese yaka weequay aka trioculus</div>

<div class="alert alert-info"><strong class="alert__title">Lucas ipsum</strong>Lucas ipsum dolor sit amet kenobi ubese yaka weequay aka trioculus</div>

<div class="alert alert-warning"><strong class="alert__title">Lucas ipsum</strong>Lucas ipsum dolor sit amet kenobi ubese yaka weequay aka trioculus</div>

<div class="alert alert-danger"><strong class="alert__title">Lucas ipsum</strong>Lucas ipsum dolor sit amet kenobi ubese yaka weequay aka trioculus</div>
```
