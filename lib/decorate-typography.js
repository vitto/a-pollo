'use strict'

var Chance = require('chance')
var chance = new Chance()
var random = require('random-js')()

function alphabet () {
  return {
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    symbols: '‘?’“!”(%)[#]{@}/&<-+÷×=>®©$€£¥¢:;,.*'
  }
}

function paragraph () {
  return chance.paragraph({sentences: random.integer(4, 12)})
}

function sentence () {
  return chance.sentence({words: random.integer(8, 12)}).replace('.', '')
}

function title () {
  return chance.sentence({words: random.integer(3, 6)}).replace('.', '')
}

module.exports.alphabet = alphabet
module.exports.paragraph = paragraph
module.exports.sentence = sentence
module.exports.title = title
