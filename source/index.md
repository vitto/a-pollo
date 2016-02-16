title: Index
category: a-pollo
id: 1
layout: website
---

# A showcase for your CSS styles

You know how much can be hard maintaining a solid design in your CSS and HTML templates, especially if you work with huge, continuously changing and scalable websites.

---

### How it works?

You write code doc blocks in your CSS widgets:

```
/*@pollo
    @name:  Twitter
    @auth:  Vittorio Vittori
    @category: Buttons
    @date:  2015-12-02
    @text:  This twitter version has also `button-social--with-effects` modifier to show drop shadow effects
    @html:  <a href="#" class="button-social button-social--twitter button-social--with-effects">
                <div class="button-social__icon">
                    <i class="fa fa-twitter"></i>
                </div>
                <div class="button-social__network">
                    twitter
                </div>
            </a>
*/
```

You generate your style guide with this node command

```
./node_modules/.bin/a-pollo
```

That's it.

---

### An example

This is [what you can expect from the default theme][apollo_example] of a-pollo.

---


### Why use it?

* It requires just [Node.js][nodejs], no ruby or other environments are required
* It's based on [Hexo][hexo], a fast, simple & powerful blog framework
* Thanks to Hexo, it supports [totally customizable themes][hexo_theme]



[nodejs]: http://nodejs.org
[hexo]: https://hexo.io
[hexo_theme]: https://hexo.io/docs/themes.html
[apollo_example]: http://vitto.github.io/a-pollo/example/index.html
