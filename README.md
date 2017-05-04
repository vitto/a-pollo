a-pollo
---
<div class="release-details">
[![Version](http://img.shields.io/:version-2.0.0-00AFFF.svg)](https://github.com/vitto/a-pollo)
[![TravisCI](https://travis-ci.org/vitto/a-pollo.svg?branch=master)](https://travis-ci.org/vitto/a-pollo/builds)
[![Built with nodejs 4.2.2](http://img.shields.io/:nodejs-4.2.2-80BD01.svg)](https://nodejs.org/en/)
[![NPM](http://img.shields.io/:NPM-package-C12127.svg)](https://www.npmjs.com/package/a-pollo)
[![MIT licence](http://img.shields.io/:license-MIT-B1C7C9.svg)](https://github.com/ideatosrl/frontsize-sass/blob/master/LICENSE.md)
</div>

## What is a-pollo?

a-pollo is a [node module][npm] which generates markdown pages decorated with [frontMatter][frontmatter] data that contains documentation and code snippets supposed to be written in your [SASS][sass], [LESS][less] or CSS files.

It's meant to be used with a static generator like [metalsmith](http://www.metalsmith.io/), [hexo](https://hexo.io/), [jekyll](https://jekyllrb.com), etc.

Below you'll read a guide on how to configure a-pollo and write annotation tags in order to start building your documentation.

---

#### Configuration

The default [YAML][yaml] config is named `a-pollo.yml`, you should put it on the base directory of your project. Writing your config is easy, here is how it's written:

| Property | Example | Required | Description |
| - | - | - | - |
| `annotations` | `your/sass/code` | `true` | Where your annotations are, a-pollo expects to find a set of **SASS**, **LESS** or **CSS** files that contains your styles and your annotations |
| `cache` | `path/to/cache` | `false` | This is the folder where a-pollo generate the markdown pages decorated with **frontMatter** data |
| `front_matter` | boolean | `false` | Decorated generated markdown files with additional metadata useful to static generators |
| `index` | `path/to/index.md` or boolean | `false` | Tells to a-pollo to render this markdown page or a path to target your own markdown page |
| `assets.css` | `sass/generated/file.css` | `true` | This is the **CSS** you generate with your source code, a-pollo will style your snippets with it |
| `assets.fonts` | `path/to/fonts` | `false` | The fonts loaded from your `assets.css` |
| `assets.images` | `path/to/images` | `false` | The images loaded from your `assets.css` |

#### Config example

```bash
annotations: './sass'
build: './tmp'
front_matter: true
posts: './path/to/markdown'
index: true
assets:
  css: 'css/example.css'
  fonts: 'css/fonts'
  images: 'css/img'
```

#### CLI

The CLI section will be updated soon.

---

## Annotation types

There are four ways to create documentation to your projects, below the list of annotation types:

- [Color](/#color)
- [Documentation](/#documentation)
- [Snippet](/#snippet)
- [Typography](/#typography)

---

## Color

This annotation expects just one parameter:

| Parameter | Required | Description |
| - | - | - |
| `@a-pollo-color` |  `true` | An inline string with che color name you give |

#### Annotation

Suppose you have a `vars.scss` file, you can add color annotation in this way:

```css
$color-azure: #135aa3; /* @a-pollo-color: Azure */
```

The annotation needs to be inline with the var or it will not work.

#### Generated frontMatter

```bash
annotations:
  -
    annotation: "color"
    category: "identity"
    name: "Azure"
    path:
      root: "/"
      base: "vars.scss"
      ext: ".scss"
      name: "vars"
      relative: "sass/frontsize/themes/_config"
      project: "/samples/sass/frontsize/themes/_config"
    type: "color"
    title: "Color"
    var: "$color-azure"
    value: "#135aa3"
    names:
      basic: "indigo"
      html: "darkslateblue"
      ntc: "Azure"
      pantone: "Denim"
      roygbiv: "indigo"
      x11: "darkslateblue"
    css:
      rgb: "rgb(19, 90, 163)"
      hsl: "hsl(210, 79%, 36%)"
      hex: "#135AA3"
      cmyk: "cmyk(88%, 45%, 0%, 36%)"
    channel:
      cmyk:
        c: 88
        m: 45
        y: 0
        k: 36
      hsl:
        h: 210
        s: 79
        l: 36
      rgb:
        r: 19
        g: 90
        b: 163
```

---

## Documentation

This annotation parameters:

| Parameter | Required | Description |
| - | - | - |
| `@a-pollo-doc` | `true` | The annotation tag |
| `@author` | | Inline markdown string |
| `@category` | | Inline string |
| `@code` | | Inline markdown string as first parameter, multiline code block as second parameter |
| `@css` | | Inline markdown string as first parameter, multiline code block as second parameter |
| `@date` | | A valid date |
| `@html` | | Inline markdown string as first parameter, multiline code block as second parameter |
| `@icon` | | Inline string, meant to be used to store a CSS class selector |
| `@name` | `true` | Inline string |
| `@param` | | First parameter expects an inline string with `{typeof}` data, `($var-name)` and if your parameter is `[required]`, the second parameter is an inline markdown string  |
| `@public` | | If you shoud use the entity as public |
| `@returns` | | If this code block returns something |
| `@text` | | Multiline markdown string |
| `@title` | | Inline string |
| `@type` | | A string to define the type of entity you are working with |
| `@version` | | If your code is used from a specific release |


### Annotation

The `@code` tag will be colored by the extension of it's source code, if you write it in a SASS file, the code will be colored as SASS code.

```css
/*
  @a-pollo-doc
  @author: [Vittorio Vittori](http://vit.to)
  @title: BEM
  @category: Components
  @code: Example on using the mixin with some static property
    @include block (button) {
      background: #3f6c44;
      color: #fff;
      display: inline-block;
      font-size: 12px;
      padding: 4px 8px;
    }
  @css: This is the CSS generated
    .button {
      background: #3f6c44;
      color: #fff;
      display: inline-block;
      font-size: 12px;
      padding: 4px 8px;
    }
  @date: 2016-12-28T17:40:42+01:00
  @type: mixin
  @html: A simple HTML element to see how mixin works
    <a class="button" href="#">Visit this link</a>
  @icon: fa fa-css3
  @name: block
  @param: {string} ($block-name) [required]
          Defines the block name of the BEM component
  @public: true
  @returns: css
  @text: Defines the block name of the BEM component. This mixin is required as wrapper of `element` and `modifier` mixins
  @version: 4.0.0
*/
```

This annotation is meant if you need to write code documentation, if you just need to write code snippets, go the ne snippet annotation.

#### Generated frontMatter

```bash
annotations:
  -
    annotation: "doc"
    author: "<p>Vittorio Vittori</p>\n"
    category: "Components"
    date: "2016-12-28T17:40:42+01:00"
    html:
      code: "<a class=\"button\" href=\"#\">Visit this link</a>"
      copy: "<a class=\"button\" href=\"#\">Visit this link</a>"
      snippet: "<pre><code class=\"lang-html\">&lt;a class=&quot;button&quot; href=&quot;#&quot;&gt;Visit this link&lt;/a&gt;\n</code></pre>\n"
      source: "<a class=\"button\" href=\"#\">Visit this link</a>"
      text: "<p>A simple HTML element to see how mixin works</p>\n"
    icon: "fa fa-css3"
    name: "block"
    params:
      -
        default: "required"
        name: "$block-name"
        text: "<p>Defines the block name of the BEM component</p>\n"
        type: "string"
    path:
      root: "/"
      base: "bem.scss"
      ext: ".scss"
      name: "bem"
      relative: "sass/frontsize/core/components"
      project: "/samples/sass/frontsize/core/components"
    public: true
    returns: "css"
    text: "<p>Defines the block name of the BEM component. This mixin is required as wrapper of <code>element</code> and <code>modifier</code> mixins</p>\n"
    type: "mixin"
    version: "4.0.0"
    title: "BEM"
    code:
      ext: "scss"
      code: "@include block (button) {\n  background: #3f6c44;\n  color: #fff;\n  display: inline-block;\n  font-size: 12px;\n  padding: 4px 8px;\n}"
      snippet: "<pre><code class=\"lang-scss\">@include block (button) {\n  background: #3f6c44;\n  color: #fff;\n  display: inline-block;\n  font-size: 12px;\n  padding: 4px 8px;\n}\n</code></pre>\n"
      text: "<p>Example on using the mixin with some static property</p>\n"
    css:
      code: ".button {\n  background: #3f6c44;\n  color: #fff;\n  display: inline-block;\n  font-size: 12px;\n  padding: 4px 8px;\n}"
      snippet: "<pre><code class=\"lang-css\">.button {\n  background: #3f6c44;\n  color: #fff;\n  display: inline-block;\n  font-size: 12px;\n  padding: 4px 8px;\n}\n</code></pre>\n"
      text: "<p>This is the CSS generated</p>\n"
```

---

## Snippet

This annotation parameters:

| Parameter | Required | Description |
| - | - | - |
| `@a-pollo-snippet` | `true` | The annotation tag |
| `@author` | | Inline markdown string |
| `@category` | | Inline string |
| `@date` | | A valid date |
| `@html` | | Inline markdown string as first parameter, multiline code block as second parameter |
| `@icon` | | Inline string, meant to be used to store a CSS class selector |
| `@name` | `true` | Inline string |
| `@text` | | Multiline markdown string |
| `@title` | | Inline string |

```css
/*
  @a-pollo-snippet
  @name: button-social
  @author: [Vittorio Vittori](http://vit.to)
  @date: 2017-01-06T17:50:18+01:00
  @category: Buttons
  @icon: fa fa-hand-pointer-o
  @text: The base usage without styles of the button, this component **requires** [FontAwesome](http://fontawesome.github.io) to be loaded as dependency.
  @html:
    <a href="#" class="button-social" data-style="width: 150px;">
      <div class="button-social__icon">
        <i class="fa fa-dashboard"></i>
      </div>
      <div class="button-social__network">
        Button
      </div>
    </a>
*/
```

##### Note

Inside the `@html` tag you can add the attribute `data-style`, this will be converted as inline stile for display examples, but will be not copied in the clipboard.

---

## Typography

This annotation parameters:

| Parameter | Required | Description |
| - | - | - |
| `@a-pollo-typography` | `true` | The annotation tag |
| `@name` | | Inline string |
| `@selector` | | CSS selector to render the typography in the documentation |
| `@text` | | Multiline markdown string |
| `@usage` | | Inline string |


### Annotation

The `@selector` tag will be colored by the extension of it's source code, if you write it in a SASS file, the code will be colored as SASS code.

```css
/*
  @a-pollo-typography
  @name: Merriweather
  @usage: paragraph
  @selector: .text.text--big
  @text: This is used for paragraphs text blocks, it's nice on web browser and digial devices with low or high density displays.
        If you need to write on physical object it's recommended to use [Kepler STD](https://typekit.com/fonts/kepler).
*/
```

#### Generated frontMatter

```bash
annotations:
  -
    annotation: "typography"
    category: "identity"
    name: "Merriweather"
    path:
      root: "/"
      base: "text.scss"
      ext: ".scss"
      name: "text"
      relative: "sass/fonts/widgets"
      project: "/samples/sass/fonts/widgets"
    text: "<p>This is used for paragraphs text blocks, it&#39;s nice on web browser and digial devices with low or high density displays.\n If you need to write on physical object it&#39;s recommended to use <a href=\"https://typekit.com/fonts/kepler\">Kepler STD</a>.</p>\n"
    usage: "paragraph"
    type: "snippet"
    title: "Typography"
    alphabet:
      uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
      lowercase: "abcdefghijklmnopqrstuvwxyz"
      symbols: "‘?’“!”(%)[#]{@}/&<-+÷×=>®©$€£¥¢:;,.*"
    selector: ".text.text--big"
    selectorClass: "text text--big"
    preview:
      title: "Suec ebraaj baj sef buvzocpi ke"
      sentence: "No ofifizel worewu voectu deuduh iw awicioh lutu"
      paragraph: "Hejobtap upepa jukvedlu vof atleh lej kodaer luvuhtun ebapuha az jinu ri tah jusoror. Disazse ciniug naduco wectormof uj cog poczo kanuju numijev ivel piz vozuj bihsol ciamudit okrezaf ohoaj cuhpuk. Wusguek kabfi agete gibnahsiv vegebewo ciged ul ge guthor ga favu razle ev jotricez luw. Funcorjid nod zuc da zo pu pefam sapfiso fo satgi hotbaho debic. Tacev zam ona tufuap nihoopa dadvafaw la wu az fohpah keagu fuvu kamone hu gotohu. Wir lapoz wetceme sonjo ku mos athage hafvivpo weh fudol ogiti vodite idimuhir kup fe. Tivsipmi lo fu um eru mehcuni kisno wufugdo hawihe pu hog ja petugko zipur ivo. Ehlazo esegepam so cevipag farivogeb ko nub buwabut sa jokomlit mabwuf tovoge fiv. Ic emmokkoj ojoove za esowihih bacdig bov gih jib osbij barigku amuva numvepug lu ziebe losev orsugjeh. Na av jawduobo labopmaf zi vohgim wi joz deenzot cagun gocuwene dihake razcatkat ijajod wajhuces gic. Av feb iheuwiwi jovek couju ri tarpa okahe ufbu kafwa jumoc osewil ne ganvumjok tacnuljon."
```

[npm]: https://www.npmjs.com/package/a-pollo
[yaml]: http://www.yaml.org/spec/1.2/spec.html#id2761803
[sass]: http://sass-lang.com/
[less]: http://lesscss.org/
[frontmatter]: https://jekyllrb.com/docs/frontmatter/
