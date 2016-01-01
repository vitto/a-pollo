a-pollo
---

[![Version](http://img.shields.io/:version-1.5.57-B89766.svg)][release]
[![TravisCI](https://travis-ci.org/vitto/a-pollo.svg?branch=master)](https://travis-ci.org/vitto/a-pollo/builds)
[![Built with nodejs 4.2.2](http://img.shields.io/:nodejs-4.2.2-80BD01.svg)](http://badges.github.io/badgerbadgerbadger/)
[![MIT licence](http://img.shields.io/:license-MIT-00AFFF.svg)](https://github.com/ideatosrl/frontsize-sass/blob/master/LICENSE.md)

A-pollo generates **CSS style guide documentation** from your [code comments][apollo_code_docs].

It's been written for teams who need to check CSS widgets with examples, copy html related code with no pain to go through browser HTML debugger.

![a-pollo preview][a-pollo-preview]

## Roadmap

- Default style guide articles for CSS
- Default style guide articles for HTML
- Single widget tests with csslint
- Single widget stylestats report
- Documentation tags for SASS
- Documentation tags for LESS

##### Release notes

- Fix default font inheritance
- Update some theme style
- Update some markdown style
- Add customizable config file as command parameter
- Add site menu sorted by id
- Add site default pages
- Remove unused JS file

##### Known issues

- If `use_markdown` is set to `false`, code snippets are not correctly indented
- If `use_markdown` is set to `false`, code snippets cannot be copied on clipboard
- Incomplete customizable HTML template, complete at 95%
- Some of the doc vars names will probably change in the future
- Needs a lot of micro optimizations


---

The module works with [Hexo][hexo], an easy to use and powerful blog framework, so if you'd like to [write your own theme][apollo_theme] you'll have the power this nice tool in your fingers.

---

### To install a-pollo in your project

```
npm install --save a-pollo
```

---

### To create a config file

From `package.json` where you have installed `node_modules` folder

```
./node_modules/.bin/a-pollo init
```

It will start a process will help you to build the first one.

---

### To run a-pollo

From `package.json` where you have installed `node_modules` folder

```
./node_modules/.bin/a-pollo
```

---

Place a `a-pollo.yml` in the root folder of your project, this is the default config:

``` yaml
title: Client project                                           # [required] Will be listened on head's title tag
client: '[Client name](http://github.com/vitto/a-pollo#readme)'
developers: '[Vittorio Vittori](http://vit.to)'     # [required] Who's managing the style guide
designers: '[Vittorio Vittori](http://vit.to)'      # [required] Who's desining the style guide
date: 2015-11-01                 # [required] When the style guide project was started
date_format: dddd D MMMM YYYY    # [optional] Default from hexo config YYYY-MM-DD

public_dir: ./public        # [required] Where the style guide will be genarated
url: http://localhost:7777  # [optional] HTTP server URL
pages: test/a-pollo/*       # [optional] Additional static documentation pages you want to add, (markdown or html)
http_server: true           # [optional] HTTP server with port number
use_markdown: true          # [optional] This will be removed soon, it's used for development
theme: a-pollo              # [optional] The a-pollo theme folder

libs:
    bower: bower.json   # [optional] Link the bower.json file to display Bower used libraries in the index page
    node: package.json  # [optional] Link the package.json file to display NodeJS used libraries in the index page

style:
    docs: test/frontsize/themes/default/widgets/        # [required] Where a-pollo comments and tags are placed
    css: test/frontsize/test/frontsize-theme.min.css    # [required] This is the CSS will be loaded by a-pollo to show rendered widgets
    images: test/frontsize/themes/default/img/*         # [optional] Where the CSS images are stored
    fonts: test/frontsize/themes/default/fonts/*        # [optional] Where the CSS fonts are stored

header:
    logo: apollo-logo__icon-grey.svg        # [optional] The logo image you'll se on every page, it must be stored in style.images
    link: /                                 # [optional] The link on the logo image
    description: a-pollo / the visual CSS style guide for teams    # [optional] A description under the logo image

footer:
    logo: <a href="http://github.com/vitto/apollo#readme" class="apollo-logo"><img width="80px" src="/img/apollo-logo__icon.svg"><div class="apollo-logo__text">a-pollo</div></a>
    leftText: The visual CSS style guide for teams
    rightText: <a href="http://github.com/vitto/a-pollo#readme" class="apollo-footer__link"><i class="fa fa-code"></i></a> with <i class="fa fa-heart apollo-footer__heart"></i> by <a href="http://vit.to" class="apollo-footer__link">vitto</a> @ <a href="http://www.ideato.it" class="apollo-footer__link">ideato</a>

```

---

#### Configuration

| Property             | Hexo's shared config | Description |
| ---                  | ---                  | ---         |
| `title`              | **yes**              | Will be shown on HTML page title |
| `author`             | **yes**              | Will be shown around the pages |
| `date`               | **yes**              | Not yet used |
| `public_dir`         | **yes**              | The target path the site will be generated |
| `url`                | **yes**              | HTTP server URL |
| `theme`              | **yes**              | Theme folder name, you can [write your own theme][apollo_theme] |
| `pages`              | *no*                 | The customized markdown pages will be published from Hexo |
| `http_server`        | *no*                 | If the generated guide will be served by the HTTP server |
| `use_markdown`       | *no*                 | Which method will be used to render the HTML template pages |
| `style.docs`         | *no*                 | The path where the documentation files are |
| `style.css`          | *no*                 | The path where the CSS for the documentation is, this is not the CSS of the a-pollo theme |
| `style.images`       | *no*                 | Image assets for the CSS you are using |
| `style.fonts`        | *no*                 | Fonts assets for the CSS you are using |
| `header.logo`        | *no*                 | An image inside `style.images` to be used as image header inside a-pollo theme |
| `header.description` | *no*                 | The header description inside a-pollo theme |
| `header.link`        | *no*                 | The header logo href inside a-pollo theme |
| `footer.logo`        | *no*                 | An image inside `style.images` to be used as image footer inside a-pollo theme |
| `footer.leftText`    | *no*                 | The left text or HTML on the footer inside a-pollo theme |
| `footer.rightText`   | *no*                 | The right text or HTML on the footer inside a-pollo theme |

---

##### Development utils

To build theme

```
./node_modules/.bin/gulp frontsize:build
```

---

Generate test css

```
./node_modules/.bin/gulp frontsize:build && cd ./test && ./node_modules/.bin/gulp frontsize:css && ../ && node index.js
```

---

To test the HTML results

```
./node_modules/.bin/gulp frontsize:build && node index.js
```

---

Generate website

```
./node_modules/.bin/gulp frontsize:build && cd ./hexo && ../node_modules/.bin/hexo --config _site_config.yml generate && cd ../ && php -S localhost:8000 -t ./_site
```

Written with love by [Vittorio Vittori][vitto] @ [ideato srl][ideato]

[vitto]: https://twitter.com/vttrx
[ideato]: http://www.ideato.it
[hexo]: https://hexo.io
[apollo_code_docs]: https://github.com/vitto/a-pollo/blob/master/test/frontsize/themes/default/widgets/button-social.scss
[apollo_theme]: https://github.com/vitto/a-pollo/tree/master/hexo/themes/a-pollo
[release]: https://github.com/vitto/a-pollo/releases/tag/1.5.57
[a-pollo-preview]: https://github.com/vitto/a-pollo/raw/master/frontsize/themes/a-pollo/img/apollo-example.png
