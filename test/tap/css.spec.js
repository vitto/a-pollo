'use strict'

const css = require('../../lib/css')
const config = require('../../lib/config')
const tap = require('tap')
const test = tap.test

const cssString = `
.selector {
  background-image: url('/path/to/image.png');
}

.selector-2 {
  background-image: url('/path/to/image.svg');
}

.selector-3 {
  background-image: url("/path/to/image.svg");
}

.selector-4 {
  background-image: url(/path/to/image.png);
}

@font-face {
  font-family: 'Graublau Web';
  src: url('GraublauWeb.eot');
  src: local('☺︎'),
    url("GraublauWeb.woff") format("woff"),
    url('GraublauWeb.otf') format("opentype"),
    url("GraublauWeb.svg#grablau") format("svg");
  }

@media screen and (max-device-width: 480px) {
  @font-face {
    font-family: "Graublau Web";
    src: url("GraublauWeb.woff") format("woff"),
    url(GraublauWeb.otf) format("opentype"),
    url("GraublauWeb.svg#grablau") format("svg");
}}
`

const cssChanged = `
.selector {
  background-image: url("assets/image.png");
}

.selector-2 {
  background-image: url("assets/image.svg");
}

.selector-3 {
  background-image: url("assets/image.svg");
}

.selector-4 {
  background-image: url("assets/image.png");
}

@font-face {
  font-family: 'Graublau Web';
  src: url("assets/GraublauWeb.eot");
  src: local('☺︎'),
    url("assets/GraublauWeb.woff") format("woff"),
    url("assets/GraublauWeb.otf") format("opentype"),
    url("assets/GraublauWeb.svg#grablau") format("svg");
  }

@media screen and (max-device-width: 480px) {
  @font-face {
    font-family: "Graublau Web";
    src: url("assets/GraublauWeb.woff") format("woff"),
    url("assets/GraublauWeb.otf") format("opentype"),
    url("assets/GraublauWeb.svg#grablau") format("svg");
}}
`

test('replace CSS url with a-pollo build path', tap => {
  tap.equal(css.inline(cssString, config.assetsPath), cssChanged)
  tap.end()
})
