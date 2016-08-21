(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.AsciiLayout = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

String.prototype.pad = function (width) {
  var left = Math.max(Math.floor((width - this.length) / 2), 0);
  var right = Math.max(width - this.length - left, 0);
  return ' '.repeat(left) + this + ' '.repeat(right);
};

var Block = function () {
  function Block() {
    _classCallCheck(this, Block);

    this.name = '';
    this.child = null;
  }

  _createClass(Block, [{
    key: 'print',
    value: function print(width) {
      var contentWidth = width - 6;
      var topLine = '┌──' + '─'.repeat(contentWidth) + '──┐';
      var nameLine = '│  ' + this.name.pad(contentWidth) + '  │';
      var bottomLine = '└──' + '─'.repeat(contentWidth) + '──┘';

      if (this.child) {
        var childPrint = this.child.print(contentWidth + 2);
        var childLines = childPrint.split('\n').map(function (l) {
          return '│ ' + l + ' │';
        });
        return [topLine, nameLine].concat(_toConsumableArray(childLines), [bottomLine]).join('\n');
      }
      return [topLine, nameLine, bottomLine].join('\n');
    }
  }, {
    key: 'itemWidths',
    get: function get() {
      return [this.estimatedSize[0]];
    }
  }, {
    key: 'estimatedSize',
    get: function get() {
      if (this.child) {
        var _child$estimatedSize = _slicedToArray(this.child.estimatedSize, 2);

        var childWidth = _child$estimatedSize[0];
        var childHeight = _child$estimatedSize[1];

        return [Math.max(this.name.length, childWidth) + 6, 3 + childHeight];
      }
      return [this.name.length + 6, 3];
    }
  }]);

  return Block;
}();

var HorizontalBlock = function () {
  function HorizontalBlock(left, right) {
    _classCallCheck(this, HorizontalBlock);

    this.left = left;
    this.right = right;
  }

  _createClass(HorizontalBlock, [{
    key: 'print',
    value: function print(width) {
      var itemCount = this.left.itemWidths.length + this.right.itemWidths.length;
      var leftWidth = Math.floor(width * this.left.itemWidths.length / itemCount);
      var leftLines = this.left.print(leftWidth).split('\n');
      var rightLines = this.right.print(width - leftWidth - 1).split('\n');
      var numberOfLines = Math.max(leftLines.length, rightLines.length);
      return Array.from(Array(numberOfLines).keys()).map(function (n) {
        var leftLine = leftLines[n] || ' '.repeat(leftLines[0].length);
        var rightLine = rightLines[n] || ' '.repeat(rightLines[0].length);
        return leftLine + ' ' + rightLine;
      }).join('\n');
    }
  }, {
    key: 'itemWidths',
    get: function get() {
      return [].concat(_toConsumableArray(this.left.itemWidths), _toConsumableArray(this.right.itemWidths));
    }
  }, {
    key: 'estimatedSize',
    get: function get() {
      var _left$estimatedSize = _slicedToArray(this.left.estimatedSize, 2);

      var leftHeight = _left$estimatedSize[1];

      var _right$estimatedSize = _slicedToArray(this.right.estimatedSize, 2);

      var rightHeight = _right$estimatedSize[1];

      var totalWidth = Math.max.apply(Math, _toConsumableArray(this.itemWidths)) * this.itemWidths.length;
      var spaces = this.itemWidths.length - 1;
      return [totalWidth + spaces, Math.max(leftHeight, rightHeight)];
    }
  }]);

  return HorizontalBlock;
}();

var VerticalBlock = function () {
  function VerticalBlock(top, bottom) {
    _classCallCheck(this, VerticalBlock);

    this.top = top;
    this.bottom = bottom;
  }

  _createClass(VerticalBlock, [{
    key: 'print',
    value: function print(width) {
      return [this.top.print(width), this.bottom.print(width)].join('\n');
    }
  }, {
    key: 'itemWidths',
    get: function get() {
      return [this.estimatedSize[0]];
    }
  }, {
    key: 'estimatedSize',
    get: function get() {
      var _top$estimatedSize = _slicedToArray(this.top.estimatedSize, 2);

      var topWidth = _top$estimatedSize[0];
      var topHeight = _top$estimatedSize[1];

      var _bottom$estimatedSize = _slicedToArray(this.bottom.estimatedSize, 2);

      var bottomWidth = _bottom$estimatedSize[0];
      var bottomHeight = _bottom$estimatedSize[1];

      return [Math.max(topWidth, bottomWidth), topHeight + bottomHeight];
    }
  }]);

  return VerticalBlock;
}();

function parse(string, block) {
  var scoped = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

  if (string.length == 0) return [block, string];

  var char = string.substring(0, 1);
  var tail = string.substring(1);

  switch (char) {
    case '(':
      return parse(tail, new Block(), true);
    case ')':
      return [block, tail];
    case '-':
      var _parse = parse(tail, new Block(), scoped);

      var _parse2 = _slicedToArray(_parse, 2);

      var rightBlock = _parse2[0];
      var rightTail = _parse2[1];

      if (scoped) {
        return [new HorizontalBlock(block, rightBlock), rightTail];
      } else {
        return parse(rightTail, new HorizontalBlock(block, rightBlock));
      }
    case '|':
      var _parse3 = parse(tail, new Block(), scoped);

      var _parse4 = _slicedToArray(_parse3, 2);

      var bottomBlock = _parse4[0];
      var bottomTail = _parse4[1];

      if (scoped) {
        return [new VerticalBlock(block, bottomBlock), bottomTail];
      } else {
        return parse(bottomTail, new VerticalBlock(block, bottomBlock));
      }
    case '>':
      var _parse5 = parse(tail, new Block(), scoped);

      var _parse6 = _slicedToArray(_parse5, 2);

      var childBlock = _parse6[0];
      var childTail = _parse6[1];

      block.child = childBlock;
      return parse(childTail, block, scoped);
    default:
      block.name += char;
      return parse(tail, block, scoped);
  }
}

function print(string, asComment) {
  var _parse7 = parse(string, new Block());

  var _parse8 = _slicedToArray(_parse7, 1);

  var block = _parse8[0];

  var _block$estimatedSize = _slicedToArray(block.estimatedSize, 1);

  var width = _block$estimatedSize[0];


  if (asComment) {
    return ['/*'].concat(_toConsumableArray(block.print(width).split('\n').map(function (l) {
      return ' ' + l;
    })), ['*/']).join('\n');
  } else {
    return block.print(width);
  }
}

module.exports = print;

},{}]},{},[1])(1)
});