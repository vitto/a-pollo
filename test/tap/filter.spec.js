'use strict'

const filter = require('../../lib/filter')
const tap = require('tap')
const test = tap.test

const fileList = [
  'test/samples/sass/frontsize/core/components/base.scss',
  'test/samples/sass/frontsize/core/components/bem.scss',
  'test/samples/sass/frontsize/core/components/print.scss',
  'test/samples/sass/frontsize/core/core.scss',
  'test/samples/sass/frontsize/core/functions/background.scss',
  'test/samples/sass/frontsize/core/functions/ease.scss',
  'test/samples/sass/frontsize/core/functions/public.scss',
  'test/samples/sass/frontsize/core/functions/string.scss',
  'test/samples/sass/frontsize/core/grids/float.scss',
  'test/samples/sass/frontsize/core/helpers/background.scss',
  'test/samples/sass/frontsize/core/helpers/container.scss',
  'test/samples/sass/frontsize/core/helpers/debug.scss',
  'test/samples/sass/frontsize/core/helpers/font.scss',
  'test/samples/sass/frontsize/core/helpers/sprite.scss',
  'test/samples/sass/frontsize/core/import.scss',
  'test/samples/sass/frontsize/core/info.scss',
  'test/samples/sass/frontsize/core/test.scss',
  'test/samples/sass/frontsize/test/import.scss',
  'test/samples/sass/frontsize/themes/_config/config.scss',
  'test/samples/sass/frontsize/themes/_config/import.scss',
  'test/samples/sass/frontsize/themes/_config/vars.scss',
  'test/samples/sass/frontsize/themes/_config/vendor/include-media.scss',
  'test/samples/sass/frontsize/themes/_config/vendor/normalize.scss',
  'test/samples/sass/frontsize/themes/_config/vendor/resolution.scss',
  'test/samples/sass/frontsize/themes/_config/vendor/spinners.scss',
  'test/samples/sass/frontsize/themes/default/alias/grid.scss',
  'test/samples/sass/frontsize/themes/default/base/body.scss',
  'test/samples/sass/frontsize/themes/default/config.scss',
  'test/samples/sass/frontsize/themes/default/import.scss',
  'test/samples/sass/frontsize/themes/default/vars.scss'
]

const noDocFileList = [
  'test/samples/sass/frontsize/core/import.scss',
  'test/samples/sass/frontsize/themes/_config/vendor/include-media.scss',
  'test/samples/sass/frontsize/themes/_config/vendor/normalize.scss',
  'test/samples/sass/frontsize/themes/_config/vendor/resolution.scss',
  'test/samples/sass/frontsize/themes/_config/vendor/spinners.scss',
  'test/samples/sass/frontsize/themes/default/import.scss'
]

test('filters file list of annotations', tap => {
  tap.plan(1)
  filter(fileList, function (err, files) {
    if (err) {
      throw err
    }
    tap.equal(files.length, 1)
  })
})

test('filter fail to retrieve the file list of annotations', tap => {
  tap.plan(1)

  filter(noDocFileList, function (err, files) {
    tap.throws(function () {
      throw err
    }, new Error(`No docs data found inside documents list`))
  })
})
