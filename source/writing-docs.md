title: Writing docs
category: a-pollo
id: 4
layout: website
---

### How to write a CSS widget documentation?

A-pollo can read documentation tags inside **CSS**, **SASS** or **LESS** files, right now it works by grouping widgets by filename, so if you have [two SASS files][apollo_test_files] with multiple examples inside documentation tags each file, you'll see two example pages.

So you can have [a file with multiple examples][button_social_sass] like this and see everything inside it's widget page:

```
/*@pollo
    @name:  Social button
    @auth:  [Vittorio Vittori](http://vit.to)
    @category:  Buttons
    @date:  2015-12-01
    @text:  This should be used to connect social accounts to the project service.
            It requires [Font Awesome](http://fontawesome.github.io/) to be loaded as dependency.
            The code above will show the Facebook version.
    @html:  <a href="#" class="button-social button-social--facebook">
                <div class="button-social__icon">
                    <i class="fa fa-facebook"></i>
                </div>
                <div class="button-social__network">
                    facebook
                </div>
            </a>
*/

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

.button-social {
    // sass code here...
}
```

### CSS documentation tags list

This is the list of the a-pollo documentation tags for CSS widgets:


| Tag name         | Required | Type         | Description                 |
|---               |---       |---           |---                          |
| `@name`          | `true`   | `String`     | Title of the example |
| `@auth`          | `false`  | `Markdown`   | Author or authors of the widget of the example |
| `@date`          | `false`  | `YYYY-MM-DD` | Date of the example |
| `@category`      | `false`  | `String`     | Widgets will be grouped with this, it's `Uncategorized` by default |
| `@text`          | `false`  | `Markdown`   | Description of the example  |
| `@html`          | `false`  | `String`     | Code snippet of the example, can be copied with a click |

Next step is [how to generate the style guide][generate].

[button_social_sass]: https://github.com/vitto/a-pollo/blob/master/test/frontsize/themes/default/widgets/button-social.scss
[apollo_test_files]: https://github.com/vitto/a-pollo/tree/master/test/frontsize/themes/default/widgets
[generate]: /generate-style-guide.html
