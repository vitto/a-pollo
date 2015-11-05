Apollo
---

To build the style guide

```
./node_modules/.bin/gulp frontsize:build && node index.js && php -S localhost:8000 -t ./public
```

To test the HTML results

```
php -S localhost:8000 -t ./public
```
