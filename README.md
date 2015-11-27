A-pollo
---

[![Version](http://img.shields.io/:version-1.1.28-B89766.svg)][release]
[![Built with nodejs 4.2.2](http://img.shields.io/:nodejs-4.2.2-80BD01.svg)](http://badges.github.io/badgerbadgerbadger/)
[![MIT licence](http://img.shields.io/:license-MIT-00AFFF.svg)](https://github.com/ideatosrl/frontsize-sass/blob/master/LICENSE.md)

A-pollo generates **CSS style guide documentation** from your [code comments][apollo_code_docs].

It's been written for teams who need to check CSS widgets with examples, copy html related code with no pain to go through browser HTML debugger.

The module works with [Hexo][hexo], a simple and powerful blog framework, so if you'd like to [write your own theme][apollo_theme] you'll have the power this nice tool at your hands.

---

To install a-pollo in your project:

```
npm install --save a-pollo
```

---

Place a `a-pollo.yml` in the root folder of your project, this is the default config:

``` yaml
title: Client project       # [required] Will be listened on head's title tag

author: Vittorio Vittori    # [required] Who's managing the style guide
date: 2015-11-01            # [required] When the style guide project was started

public_dir: ./public        # [required] Where the style guide will be genarated
url: http://localhost:7777  # [optional] Root path of the style guide
pages: test/apollo/*        # [optional] Additional static documentation pages you want to add, (markdown or html)
http_server: true           # [optional] HTTP server with port number
use_markdown: true          # [optional] This will be removed soon, it's used for development
theme: a-pollo              # [optional] The a-pollo theme folder



style:
    docs: test/frontsize/themes/default/widgets/        # [required] Where a-pollo comments and tags are placed
    css: test/frontsize/test/frontsize-theme.min.css    # [required] This is the CSS will be loaded by a-pollo to show rendered widgets
    images: test/frontsize/themes/default/img/*         # [optional] Where the CSS images are stored
    fonts: test/frontsize/themes/default/fonts/*        # [optional] Where the CSS fonts are stored

header:
    logo: example-logo.svg                  # [optional] The logo image you'll se on every page, it must be stored in style.images
    link: http://github.com/vitto/a-pollo   # [optional] The link on the logo image
    description: Your client description    # [optional] A description under the logo image

footer:
#    logo: <a href="http://github.com/vitto/apollo"><img width="100px" src="/img/apollo-logo__icon.svg"></a>
    leftText: The visual CSS style guide for teams
    rightText: <a href="http://github.com/vitto/a-pollo" class="apollo-footer__link"><i class="fa fa-code"></i></a> with <i class="fa fa-heart apollo-footer__heart"></i> by <a href="http://vit.to" class="apollo-footer__link">vitto</a> @ <a href="http://www.ideato.it" class="apollo-footer__link">ideato</a>


```

---

#### Configuration

| Property  | Shared with Hexo config | Description |
| --- | :---: | --- |
| `title` | **yes** | Will be shown on HTML page title |
| `author` | **yes** | Will be shown around the pages |
| `date` | **yes** | Not yet used |
| `public_dir` | **yes** | The target path the site will be generated |
| `url` | **yes** | The URL to navigate the guide from the browser |
| `theme` | **yes** | Theme folder name, you can [write your own theme][apollo_theme] |
| `pages` | *no* | The customized markdown pages will be published from Hexo |
| `http_server` | *no* | If the generated guide will be served by the HTTP server |
| `use_markdown` | *no* | Which method will be used to render the HTML template pages |
| `style.docs` | *no* | The path where the documentation files are |
| `style.css` | *no* | The path where the CSS for the documentation is, this is not the CSS of the a-pollo theme |
| `style.images` | *no* | Image assets for the CSS you are using |
| `style.fonts` | *no* | Fonts assets for the CSS you are using |
| `header.logo` | *no* | An image inside `style.images` to be used as image header inside a-pollo theme |
| `header.description` | *no* | The header description inside a-pollo theme |
| `header.link` | *no* | The header logo href inside a-pollo theme |
| `footer.logo` | *no* | An image inside `style.images` to be used as image footer inside a-pollo theme |
| `footer.leftText` | *no* | The left text or HTML on the footer inside a-pollo theme |
| `footer.rightText` | *no* | The right text or HTML on the footer inside a-pollo theme |

---

### To run a-pollo

From package.json where you are installed `node_modules` folder

```
./node_modules/.bin/a-pollo
```

---

##### Release notes

- Update unused Hexo plugins
- Update a-pollo theme templates
- Update a-pollo CSS theme styles


##### Known issues

- Conventions examples missing for CSS and HTML
- Default theme not responsive yet
- If `use_markdown` is set to `false`, code snippets are not correctly indented
- If `use_markdown` is set to `false`, code snippets cannot be copied on clipboard
- Incomplete customizable HTML template, complete at 95%
- Var names will change in the future
- Needs a lot of micro optimizations

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
node index.js
```

Written with love by [Vittorio Vittori][vitto] @ [ideato srl][ideato]

[vitto]: https://twitter.com/vttrx
[ideato]: http://www.ideato.it
[hexo]: https://hexo.io
[apollo_code_docs]: https://github.com/vitto/a-pollo/blob/master/test/frontsize/themes/a-pollo/widgets/button-social.scss
[apollo_theme]: https://github.com/vitto/a-pollo/tree/master/hexo/themes/a-pollo
[release]: https://github.com/vitto/a-pollo/releases/tag/1.1.28
