title: Installation
category: a-pollo
id: 3
layout: website
---

### Node.js only

A-pollo is a [node.js][node_js] module stored as [NPM package][npm_apollo]. To install it you need node.js in your environment and run:

```
npm install a-pollo –-save
```

The `--save` flag is needed to save a-pollo installation reference to `package.json` file.

This will install **a-pollo** relatively to your project's folder `node_modules`, this can be very useful to avoid global installations, hard to maintain with the right versions if you have multiple projects on your machine.

---

### Init your style guide

To build the style guide you need an `a-pollo.yml` to be present on the root folder of your project, if it's missing you can run this command to create your first one:

```
./node_modules/.bin/a-pollo init
```

This command will lunch a prompt assistant from the command line which will ask you what it needs to create the first `a-pollo.yml` file.

---

Next, you just have to [generate your style guide][generate], or check [how to write the documentation][documentation].


[node_js]: http://nodejs.org
[npm_apollo]: http://npmjs.com/package/a-pollo
[generate]: /generate-style-guide.html
[documentation]: /writing-docs.html
