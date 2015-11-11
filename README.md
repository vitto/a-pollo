Apollo
---

To build the style guide

```
./node_modules/.bin/gulp frontsize:build && node index.js && php -S localhost:8000 -t ./public
```

---

Generate test css

```
cd ./test && ./node_modules/.bin/gulp frontsize:css
```

---

To test the HTML results

```
node index.js && php -S localhost:8000 -t ./public
```
