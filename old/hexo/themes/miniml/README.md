# a-pollo default theme

a-pollo uses [Hexo][hexo] to generate the style guide from the [documentation you write][apollo_code_docs] inside your CSS files.

To write your theme, go to Hexo website and see [how to do it][hexo_theme], then in your [a-pollo config][apollo_config] set `theme` var to enable your new fantastic theme.

---

First, to install your theme you have two ways:

* copy it inside `node_modules/a-pollo/hexo/themes/` folder.
* leave your theme folder from where you launch `a-pollo`, if it's not allready installed, it will be copied inside themes folders.

---

Remember [a-pollo config][apollo_config] is just an [Hexo config][hexo_config] with some additional var for a-pollo.

[apollo_config]: https://github.com/vitto/a-pollo/blob/master/a-pollo.yml
[hexo]: https://hexo.io
[hexo_theme]: https://hexo.io/docs/themes.html
[hexo_config]: https://hexo.io/docs/configuration.html
[apollo_code_docs]: https://github.com/vitto/a-pollo/blob/master/test/frontsize/themes/default/widgets/button-social.scss
