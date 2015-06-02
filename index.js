
/**
 * Parse a trello board id from its url
 *
 * Note that it is safe to pass an ID to this method (i.e. if you are unsure
 * whether you already have an ID or url.
 *
 * @param {String} boardUrl The board url
 * @return {String} The board id
 */
var getBoardIdFromUrl = function(boardUrl) {
  return boardUrl
    .replace(/.*\/b\//, '')
    .replace(/\/.*$/, '');
};

/**
 * Get an array of cards for the given list name
 *
 * Note that `listName` is case sensitive unless `ignoreCase` (optional) is
 * `true`. The callback will be passed an error if there is one and an array of
 * trello cards if there are any.
 *
 * `cb` is passed an error if the given board does not have a list with the name
 * provided.
 *
 * @param {Trello} t The Trello instance
 * @param {String} boardIdOrUrl A trello board id or url
 * @param {String} listName The name of a trello list
 * @param {Boolean} ignoreCase [=false] Whether or not
 * @param {Function} cb The callback function
 */
var getCardsByListName = function(t, boardIdOrUrl, listName, ignoreCase, cb) {
  var f = require('util').format
    , boardId = getBoardIdFromUrl(boardIdOrUrl);

  // ignoreCase is optional...
  if(typeof ignoreCase === 'function') {
    cb = ignoreCase;
    ignoreCase = false;
  }

  var listNameSearch = ignoreCase ?
    listName.toLowerCase() : listName;

  // First we must find the list id
  t.get(f('/1/boards/%s/lists', boardId), function(err, lists) {
    if(err) { return cb(err); }
    var theList, ix;
    for(ix = lists.length; ix--;) {
      if(listNameSearch === (ignoreCase ? lists[ix].name.toLowerCase() : lists[ix].name)) {
        theList = lists[ix];
      }
    }

    if(!theList) {
      return cb(new Error('No list with name ' + listName));
    }

    t.get(f('/1/lists/%s/cards', theList.id), function(err, cards) {
      if(err) { return cb(err); }
      return cb(null, cards);
    });
  });
};

exports.getBoardIdFromUrl = getBoardIdFromUrl;
exports.getCardsByListName = getCardsByListName;
