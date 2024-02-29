# Use of Paged API data and combining data with different techniques

Some things of note:

- `prizes.liquid` shows using "prizes" and "laureates" data structures (see `_data` folder) to build content from two different REST endpoints.
- `prizes-augmented.liquid` shows using a single data structure built by `_data/prizes-augmented.js` that uses the two different REST endpoints.
- Note the logic in JS to determine whether the prize "motivation" is the same for laureates (instead of trying to do this in templates)
- Note the "shortcodes" defined in `eleventy.config.js`

## To run
This eleventy project is setup like we've seen before in class:
```
npm install
npm run start
```