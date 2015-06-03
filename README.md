
# Node Trello Utils

> Utility methods to be used with `node-trello`.


## Installation

Get it with `npm`:

```
npm install --save ivantage/node-trello-utils
```


## Usage

```javascript
var utils = require('node-trello-utils')
  , Trello = require('node-trello')
  , t = new Trello('...', '...');

var boardUrl = 'https://trello.com/b/...'
  , listName = 'Awesome Cards';
  

utils.getCardsByListName(t, boardUrl, listName, function(err, cards) {
  if(err) {
    // Handle the error...
  }
  // Do something with cards...
});
```

#### `getBoardIdFromUrl(boardUrl)`
- `boardUrl` - A Trello board url

Given a trello board url, parses and returns the board id. When passed a valid
id (i.e. instead of a full url) will return the id. If `getBoardIdFromUrl`
cannot find a valid id it will return the empty string.

#### `getCardsByListName(trello, boardIdOrUrl, listName[, ignoreCase], callback)`
- `trello` - A Trello instance a la
  [node-trello](https://github.com/adunkman/node-trello)
- `boardIdOrUrl` - A board url or board id
- `listName` - The name of the list to get cards for
- `ignoreCase` - [Optional] Whether or not to consider case when comparing
  `listName` to actual list names
- `callback` - The callback function, it gets an error (or `null`) and the array
  of cards.

Get an array of cards from the board corresponding to `boardIdOrUrl` (can be
either a Trello board url or a board id) from the list with name `listName`. The
`ignoreCase` parameter is optional and can be used to indicate that we should
ignore list name capitalization when searching for `listName`.


## Tests

Tests are run with `npm` and can be kicked off with `npm test`. For interactive
testing during development use `npm run watch`.


## License

MIT
