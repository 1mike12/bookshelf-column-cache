# Bookshelf Column Cache

This plugin works with Bookshelf.js, available here http://bookshelfjs.org. Add a utility function to the Bookshelf object that can be accessed by other plugins or yourself.

It does this by checking the database for all the valid column names for a given table and caching the values

## Installation
```
    npm install bookshelf-column-cache
```
Then in your bookshelf configuration:
```
    var bookshelf = require('bookshelf')(knex);
    bookshelf.plugin(require('bookshelf-column-cache');

    bookshelf.plugin(require('some-other-plugin-that-uses-column-cache'))
```