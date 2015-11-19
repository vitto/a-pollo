a-pollo
---

Version `1.0.3`

Place a `a-pollo.yml` in the root folder of your project, this is the default config:

``` yaml
title: Client project

author: Vittorio Vittori
date: 2015-11-01

pages: test/apollo/*
public_dir: ./public
url: http://localhost:7777
http_server: true
use_markdown: true

style:
    docs: test/frontsize/themes/default/widgets/
    css: test/frontsize/test/csslint/frontsize.csslint.css
    images: test/frontsize/themes/default/img/*
    fonts: test/frontsize/themes/default/fonts/*

header:
    logo: example-logo.svg
    description: Your client description
    link: http://github.com/vitto/a-pollo

footer:
#    logo: <a href="http://github.com/vitto/apollo"><img width="100px" src="/img/apollo-logo__icon.svg"></a>
    leftText: The visual CSS style guide for teams
    rightText: <a href="http://github.com/vitto/a-pollo" class="apollo-footer__link"><i class="fa fa-code"></i></a> with <i class="fa fa-heart apollo-footer__heart"></i> by <a href="http://vit.to" class="apollo-footer__link">vitto</a> @ <a href="http://www.ideato.it" class="apollo-footer__link">ideato</a>

```

#### Configuration

| Property  | Shared with Hexo config | Description |
| --- | --- | --- |
| `title` | Yes | Will be shown on HTML page title |
| `author` | Yes | Will be shown around the pages |
| `date` | Yes | Not yes used |
| `pages` | No | The customized markdown pages will be published from Hexo |
| `public_dir` | Yes | The target path the site will be generated |
| `url` | Yes | The URL to navigate the guide from the browser |
| `http_server` | No | If the generated guide will be served by the HTTP server |
| `use_markdown` | No | Which method will be used to render the HTML template pages |
| `style.docs` | No | The path where the documentation files are |
| `style.css` | No | The path where the CSS for the documentation is, this is not the CSS of the a-pollo theme |
| `style.images` | No | Image assets for the CSS you are using |
| `style.fonts` | No | Fonts assets for the CSS you are using |
| `header.logo` | No | An image inside `style.images` to be used as image header inside a-pollo theme |
| `header.description` | No | The header description inside a-pollo theme |
| `header.link` | No | The header logo href inside a-pollo theme |
| `footer.logo` | No | An image inside `style.images` to be used as image footer inside a-pollo theme |
| `footer.leftText` | No | The left text or HTML on the footer inside a-pollo theme |
| `footer.rightText` | No | The left text or HTML on the footer inside a-pollo theme |

---

### To run a-pollo

From package.json where you are installed `node_modules` folder

```
./node_modules/.bin/a-pollo
```

---

##### Development utils

To build theme

```
./node_modules/.bin/gulp frontsize:build
```

---

Generate test css

```
cd ./test && ./node_modules/.bin/gulp frontsize:css
```

---

To test the HTML results

```
node index.js
```

created by [Vittorio Vittori][vitto] at [ideato srl][ideato]

[vitto]: https://twitter.com/vttrx
[ideato]: http://www.ideato.it
