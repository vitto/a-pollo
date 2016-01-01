title: Generate style guide
category: a-pollo
id: 5
---

### Config file missing?

Be sure to have a `a-pollo.yml` first, to do it check out [how to init the project][apollo_init].

### Generate

To generate the style guide, you just need to run this command:

```
./node_modules/.bin/a-pollo
```

This will run a-pollo locally and generate the site in the folder specified in the config.

### Configuration

This is the list of the properties inside the `a-pollo.yml` config file, basically it's just an extension of [Hexo configuration][hexo_config], so if you want to handle it's configuration, just write what you need here.

| Property             | Hexo's shared config | Description |
| ---                  | ---                  | ---         |
| `title`              | **yes**              | Will be shown on HTML page title |
| `author`             | **yes**              | Will be shown around the pages |
| `date`               | **yes**              | Not yet used |
| `public_dir`         | **yes**              | The target path the site will be generated |
| `url`                | **yes**              | HTTP server URL |
| `theme`              | **yes**              | Theme folder name, you can [write your own theme][apollo_theme] |
| `pages`              | *no*                 | The customized markdown pages will be published from Hexo |
| `http_server`        | *no*                 | If the generated guide will be served by the HTTP server |
| `use_markdown`       | *no*                 | Which method will be used to render the HTML template pages |
| `style.docs`         | *no*                 | The path where the documentation files are |
| `style.css`          | *no*                 | The path where the CSS for the documentation is, this is not the CSS of the a-pollo theme |
| `style.images`       | *no*                 | Image assets for the CSS you are using |
| `style.fonts`        | *no*                 | Fonts assets for the CSS you are using |
| `header.logo`        | *no*                 | An image inside `style.images` to be used as image header inside a-pollo theme |
| `header.description` | *no*                 | The header description inside a-pollo theme |
| `header.link`        | *no*                 | The header logo href inside a-pollo theme |
| `footer.logo`        | *no*                 | An image inside `style.images` to be used as image footer inside a-pollo theme |
| `footer.leftText`    | *no*                 | The left text or HTML on the footer inside a-pollo theme |
| `footer.rightText`   | *no*                 | The right text or HTML on the footer inside a-pollo theme |

Then if you want to customize the a-pollo theme, check out [how to do it here][apollo_theme].


[apollo_init]: /installation.html#Init_your_style_guide
[hexo_config]: https://hexo.io/docs/configuration.html
[apollo_theme]: /theme-installation.html
