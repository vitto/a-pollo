![][a-pollo-logo]

# a-pollo

[![Version](http://img.shields.io/:version-1.18.99-B79769.svg)][release] [![TravisCI](https://travis-ci.org/vitto/a-pollo.svg?branch=master)](https://travis-ci.org/vitto/a-pollo/builds) [![Built with nodejs 4.2.2](http://img.shields.io/:nodejs-4.2.2-80BD01.svg)](https://nodejs.org/en/) [![NPM](http://img.shields.io/:NPM-package-C12127.svg)](https://www.npmjs.com/package/a-pollo) [![Built with hexo 3.2.0](http://img.shields.io/:hexo-3.2.0-0E83CD.svg)](https://hexo.io/) [![MIT licence](http://img.shields.io/:license-MIT-00AFFF.svg)](https://github.com/ideatosrl/frontsize-sass/blob/master/LICENSE.md)

A-pollo generates **CSS style guide documentation** from your [code comments][apollo_code_docs].

It's been written for teams who need to check CSS widgets with examples, copy html related code with no pain to go through browser HTML debugger.

--------------------------------------------------------------------------------

## Release notes

- Documentation annotations support
- Remove use_markdown var from config
- Add data-style snippet attribute to ease snippet specific examples
- Change named widgets to snippets
- Update snippet style
- Add new font icons

![a-pollo preview][a-pollo-preview]

--------------------------------------------------------------------------------

## Roadmap

- Default style guide articles for CSS
- Default style guide articles for HTML
- Single widget tests with CSSlint
- Single widget StyleStats report
- Documentation tags for SASS
- Documentation tags for LESS

--------------------------------------------------------------------------------

The module works with [Hexo], an easy to use and powerful blog framework, so if you'd like to [write your own theme][apollo_theme] you'll have the power this nice tool in your fingers.

--------------------------------------------------------------------------------

## To install a-pollo in your project

```
npm install --save a-pollo
```

--------------------------------------------------------------------------------

## To create a config file

From `package.json` where you have installed `node_modules` folder

```
./node_modules/.bin/a-pollo init
```

It will start a process will help you to build the first one.

--------------------------------------------------------------------------------

## To run a-pollo

From `package.json` where you have installed `node_modules` folder

```
./node_modules/.bin/a-pollo
```

--------------------------------------------------------------------------------

## Doc style guide example

This will be placed on `style.docs` files defined in the YAML configuration.

```
/*@pollo
    @name:  Icon
    @icon:  fa-star
    @auth:  [Vittorio Vittori](http://vit.to)
    @category:  Icons
    @date:  2016-01-11
    @text:  This is an icons set composet by an SVG sprite, the single icon is `48px` size.
    @html:  <i class="icon icon--head"></i>
*/
```

--------------------------------------------------------------------------------

Place a `a-pollo.yml` in the root folder of your project, this is the default config:

```yaml
title: 'Client project'                                           # [required] Will be listened on head's title tag
client: '[Client name](http://github.com/vitto/a-pollo#readme)'
developers: '[Vittorio Vittori](http://vit.to), [Pietro Campagnano](https://twitter.com/fain182)'     # [required] Who's managing the style guide
designers: '[Vittorio Vittori](http://vit.to)'      # [required] Who's desining the style guide
date: 2015-11-01                 # [required] When the style guide project was started
date_format: dddd D MMMM YYYY    # [optional] Default from hexo config YYYY-MM-DD

public_dir: ./public        # [required] Where the style guide will be genarated
url: http://localhost:7777  # [optional] HTTP server URL
pages: example_source/a-pollo/*       # [optional] Additional static documentation pages you want to add, (markdown or html)
http_server: true           # [optional] HTTP server with port number
use_markdown: true          # [optional] This will be removed soon, it's used for development
theme: a-pollo              # [optional] The a-pollo theme folder

libs:
    bower: bower.json   # [optional] Link the bower.json file to display Bower used libraries in the index page
    node: package.json  # [optional] Link the package.json file to display NodeJS used libraries in the index page

style:
    docs: example_source/frontsize/themes/default/widgets/        # [required] Where a-pollo comments and tags are placed
    css: example_source/frontsize/test/frontsize-theme.min.css    # [required] This is the CSS will be loaded by a-pollo to show rendered widgets
    images: example_source/frontsize/themes/default/img/*         # [optional] Where the CSS images are stored
    fonts: example_source/frontsize/themes/default/fonts/*        # [optional] Where the CSS fonts are stored

header:
    logo: a-pollo-logo--gold.svg # [optional] The logo image you'll se on every page, it must be stored in style.images
    link: / # [optional] The link on the logo image
    description: A-POLLO / The visual CSS style guide for teams    # [optional] A description under the logo image

footer:
    logo: a-pollo-logo.svg # [optional] The logo image you'll se on every page, it must be stored in style.images
    link: http://vitto.github.io/a-pollo/  # [optional] The link on the logo image
    description: A-POLLO / The visual CSS style guide for teams # [optional] A description under the logo image
```

--------------------------------------------------------------------------------

### Configuration

Property             | Hexo's shared config | Description
-------------------- | -------------------- | -----------------------------------------------------------------------------------------
`title`              | **yes**              | Will be shown on HTML page title
`author`             | **yes**              | Will be shown around the pages
`date`               | **yes**              | Not yet used
`public_dir`         | **yes**              | The target path the site will be generated
`url`                | **yes**              | HTTP server URL
`theme`              | **yes**              | Theme folder name, you can [write your own theme][apollo_theme]
`pages`              | _no_                 | The customized markdown pages will be published from Hexo
`http_server`        | _no_                 | If the generated guide will be served by the HTTP server
`use_markdown`       | _no_                 | Which method will be used to render the HTML template pages
`style.docs`         | _no_                 | The path where the documentation files are
`style.css`          | _no_                 | The path where the CSS for the documentation is, this is not the CSS of the a-pollo theme
`style.images`       | _no_                 | Image assets for the CSS you are using
`style.fonts`        | _no_                 | Fonts assets for the CSS you are using
`header.logo`        | _no_                 | An image inside `style.images` to be used as image header inside a-pollo theme
`header.description` | _no_                 | The header description inside a-pollo theme
`header.link`        | _no_                 | The header logo href link
`footer.logo`        | _no_                 | An image inside `style.images` to be used as image footer inside a-pollo theme
`footer.description` | _no_                 | The footer description inside a-pollo theme
`footer.link`        | _no_                 | The footer logo href link
`libs.bower`         | _no_                 | Location of the `bower.json` file to display Bower used libraries in the index page
`libs.node`          | _no_                 | Location of the `package.json` file to display NodeJS used libraries in the index page

--------------------------------------------------------------------------------

#### Development utils

Prepare environment

```
npm install && ./node_modules/.bin/bower install && cd test && npm install && ./node_modules/.bin/bower install
```

--------------------------------------------------------------------------------

To build theme

```
./node_modules/.bin/gulp -s
```

--------------------------------------------------------------------------------

Generate test CSS

```
./node_modules/.bin/gulp -s && cd ./test && ./node_modules/.bin/gulp frontsize:css && ../ && node index.js --config a-pollo.test.yml
```

Generate website example CSS

```
./node_modules/.bin/gulp -s && cd ./test && ./node_modules/.bin/gulp frontsize:css && ../ && node index.js --config a-pollo.example.yml
```

--------------------------------------------------------------------------------

To test the HTML results

```
./node_modules/.bin/gulp -s && node index.js
./node_modules/.bin/gulp -s && node index.js --config a-pollo.test.yml
./node_modules/.bin/gulp -s && node index.js --config a-pollo.example.yml
```

--------------------------------------------------------------------------------

Generate website

```
./node_modules/.bin/gulp -s && cd ./hexo && ../node_modules/.bin/hexo --config _site_config.yml generate && cd ../ && php -S localhost:8000 -t ./_site
```

Coded with love by [Vittorio Vittori][vitto] and [Pietro Campagnano][pietro] @ [ideato srl][ideato]

[a-pollo-logo]: https://github.com/vitto/a-pollo/raw/master/frontend/frontsize/a-pollo/img/a-pollo-logo.png
[a-pollo-preview]: https://github.com/vitto/a-pollo/raw/master/frontend/frontsize/a-pollo/img/apollo-example.png
[apollo_code_docs]: https://github.com/vitto/a-pollo/blob/master/example_source/frontsize/themes/default/widgets/button-social.scss
[apollo_theme]: https://github.com/vitto/a-pollo/tree/master/hexo/themes/a-pollo
[hexo]: https://hexo.io
[ideato]: http://www.ideato.it
[pietro]: https://twitter.com/fain182
[release]: https://github.com/vitto/a-pollo/releases/tag/1.18.99
[vitto]: https://twitter.com/vttrx
