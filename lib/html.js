'use strict'

const jsdom = require('jsdom').jsdom

function mergeDataStyles (html, callback) {
  const document = jsdom(html)
  Array.from(
    document.querySelectorAll('[data-style]')
  ).forEach(function (el) {
    const styles = []

    Array.from(el.attributes).forEach(function (attr) {
      if (attr.name !== 'style' && attr.name !== 'data-style') {
        return
      }
      styles.push(attr.value)
      el.removeAttributeNode(attr)
    })

    if (!styles.length) {
      return
    }

    el.setAttribute('style', styles.join(';'))
  })

  const result = document.body.innerHTML
    .replace(/[;]{2,}/g, ';')
    .replace(/(: ){1,}/g, ':')
    .replace(/(; ){1,}/g, ';')
  return callback(null, result)
}

module.exports.mergeDataStyles = mergeDataStyles
