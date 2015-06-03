/*global describe, it, beforeEach */

var expect = require('chai').expect
  , sinon = require('sinon')
  , utils = require('../index.js');

describe('getBoardIdFromUrl', function() {
  it('should pull board ids from a board url', function() {
    var url = 'https://trello.com/b/abcd123/awesome-board'
      , actual = utils.getBoardIdFromUrl(url)
      , expected = 'abcd123';
    expect(actual).to.equal(expected);
  });

  it('should return ids as is', function() {
    var id = 'abcd1234'
      , actual = utils.getBoardIdFromUrl(id)
      , expected = id;
    expect(actual).to.equal(expected);
  });
});

describe('getCardIdByName', function() {
  beforeEach(function() {
    t = {get: function() {}};
    cards = [{id: 'card0', name: 'foobar'}];
    sinon.stub(t, 'get', function(url, cb) {
      if(/boards.*cards/.test(url)) {
        return cb(null, cards);
      }
      return cb(new Error('Unexpected url: ' + url));
    });
  });

  it('should catch invalid board ids', function() {
    var cardId
      , error;
    utils.getCardIdByName(t, 'abcd123', 'foobar', function(err, c) {
      error = err;
      cardId = c;
    });
    expect(error).to.be.an.instanceOf(Error);
  });

  it('should return the card id for the card name', function() {
    var cardId;
    utils.getCardIdByName(t, 'abcd1234', 'foobar', function(err, c) {
      cardId = c;
    });
    expect(cardId).to.equal('card0');
  });

  it('should allow for ignoring card name case', function() {
    var cardId;
    utils.getCardIdByName(t, 'abcd1234', 'FooBar', true, function(err, c) {
      cardId = c;
    });
    expect(cardId).to.equal('card0');
  });

  it('should generate an error if it cannot find the card', function() {
    var cardId
      , error;
    utils.getCardIdByName(t, 'abcd1234', 'blargus', function(err, c) {
      error = err;
      cardId = c;
    });
    expect(error).to.be.an.instanceOf(Error);
    expect(cardId).to.be.an('undefined');
  });

});

describe('getCardsByListName', function() {
  var t, lists, cards;

  beforeEach(function() {
    t = {get: function() {}};
    lists = [{id: 'foo', name: 'blargus'},{id: 'bar', name: 'Snap'}];
    cards = [{id: 'card0'}];
    sinon.stub(t, 'get', function(url, cb) {
      if(/boards.*lists/.test(url)) {
        return cb(null, lists);
      }
      if('/1/lists/bar/cards' === url) {
        return cb(null, cards);
      }
      return cb(new Error('Unexpected url: ' + url));
    });
  });

  it('should catch invalid board ids', function() {
    var actualCards
      , error;
    utils.getCardsByListName(t, 'abcd123', 'Snap', function(err, c) {
      error = err;
      actualCards = c;
    });
    expect(error).to.be.an.instanceOf(Error);
    expect(actualCards).to.be.an('undefined');
  });

  it('should let us get a list of cards for a given list name', function() {
    var actualCards;
    utils.getCardsByListName(t, 'abcd1234', 'Snap', function(err, c) {
      actualCards = c;
    });
    expect(actualCards).to.equal(cards);
  });

  it('should allow for ignoring list name case', function() {
    var actualCards
      , error;
    utils.getCardsByListName(t, 'abcd1234', 'snap', true, function(err, c) {
      actualCards = c;
    });
    expect(actualCards).to.equal(cards);
  });

  it('should generate an error if it cannot find the list', function() {
    var actualCards
      , error;
    utils.getCardsByListName(t, 'abcd1234', 'wowza', function(err, c) {
      error = err;
      actualCards = c;
    });
    expect(error).to.be.an.instanceOf(Error);
    expect(actualCards).to.be.an('undefined');
  });
});
