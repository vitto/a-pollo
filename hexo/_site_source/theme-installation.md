title: Theme installation
category: a-pollo
id: 6
---

### Install a theme

Installing an [Hexo theme][hexo_theme] inside a-pollo is very simple, if you have installed a-pollo locally you'll notice this folder structure:

```
project-root
    |_ node_modules
        |_ a-pollo
            |_ hexo
                |_ themes

```

### Set theme from config

To choose the theme to use set `theme` property as the name of your theme (it's folder name) in `a-pollo.yml` config.

### Manual installation

Place your theme inside `project-root/node_modules/a-pollo/hexo/themes` folder.

### Command line installation

Before install your theme from command line, be sure to have set `theme` property in `a-pollo.yml` config, and place your theme in the root folder of your project (where you run command line), a-pollo will looking for it and will copy it inside a-pollo themes folder, then you can remove it.

```
./node_modules/.bin/a-pollo
```


[hexo_theme]: https://hexo.io/docs/themes.html
