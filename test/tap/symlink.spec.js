'use strict'

const symlink = require('../../lib/symlink')
const tap = require('tap')
const test = tap.test

test('symlink node_modules folder for hexo', tap => {
  tap.plan(3)
  symlink.muteLogger()
  symlink.unlink()
  tap.equal(symlink.hasHexoModules(), false)
  symlink.set()
  tap.equal(symlink.hasHexoModules(), true)
  symlink.unlink()
  tap.equal(symlink.hasHexoModules(), false)
})
