title: Homepage
category: a-pollo
id: 1
---

# A showcase for your CSS styles

You know how much can be hard maintaining a solid design in your HTML templates, especially if you work with huge, continuously changing and scalable websites.

<div class="apollo-row apollo-row--styled apollo-row--gain apollo-row--2-columns"><p><b><i class="fa fa-book"></i> CSS style guide</b><br>A-pollo generates a default documentation of the CSS best practices taken from the best front-end developers with their relative sources and shows your CSS theme default base styles, everything is ready to be used as is or to be customized.</p><p><b><i class="fa fa-sitemap"></i> Organized snippets</b><br>With <b>a-pollo doc tags</b>, you can manage your front-end styles and split them into groups of widgets to easily find the style you need to create new HTML templates with a wide view of what you already have in your CSS.</p><p><b><i class="fa fa-paste"></i> Copy and paste the code you need</b><br>If you need a static documentation generated from your code with all the CSS widgets you have in your theme with <b>HTML code blocks</b> ready to be copied, <b>a-pollo</b> is probably the tool for you.</p><p><b><i class="fa fa-group"></i> Nice for teams</b><br>It's perfect to leave your CSS hard work to the rest of your team and let them view what's inside and reduce one page styles, through to be reused but forgotten in the code.</p><p><b><i class="fa fa-bar-chart"></i> CSS stats</b><br>Checkout front-end development duration, how much material is inside your theme, the people who worked on the project, and other useful stats you can use to check your team performance.</p><p><b><i class="fa fa-paint-brush"></i> Customizable theme</b><br>There is <a href="https://hexo.io/docs/themes.html">Hexo</a> behind a-pollo, a fast, simple & powerful blog framework, perfect to create  static websites and their relative themes.</p></div>


---

### How it works?

You write code doc blocks in your CSS widgets:

```
/*@pollo
    @name:  Twitter
    @auth:  [Vittorio Vittori](http://vit.to)
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
[apollo_example]: #
