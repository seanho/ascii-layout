String.prototype.pad = function (width) {
  let left = Math.max(Math.floor((width - this.length) / 2), 0);
  let right = Math.max(width - this.length - left, 0);
  return ' '.repeat(left) + this + ' '.repeat(right);
}

class Block {
  constructor() {
    this.name = '';
    this.child = null;
  }

  get itemWidths() {
    return [this.estimatedSize[0]];
  }

  get estimatedSize() {
    if (this.child) {
      let [childWidth, childHeight] = this.child.estimatedSize;
      return [Math.max(this.name.length, childWidth) + 6, 3 + childHeight];
    }
    return [this.name.length + 6, 3];
  }

  print(width) {
    let contentWidth = width - 6;
    let topLine    = `┌──${'─'.repeat(contentWidth)}──┐`;
    let nameLine   = `│  ${this.name.pad(contentWidth)}  │`;
    let bottomLine = `└──${'─'.repeat(contentWidth)}──┘`;

    if (this.child) {
      let childPrint = this.child.print(contentWidth + 2);
      let childLines = childPrint.split('\n').map((l) => `│ ${l} │`);
      return [topLine, nameLine, ...childLines, bottomLine].join('\n');
    }
    return [topLine, nameLine, bottomLine].join('\n');
  }
}

class HorizontalBlock {
  constructor(left, right) {
    this.left = left;
    this.right = right;
  }

  get itemWidths() {
    return [...this.left.itemWidths, ...this.right.itemWidths];
  }

  get estimatedSize() {
    let [, leftHeight] = this.left.estimatedSize;
    let [, rightHeight] = this.right.estimatedSize;
    let totalWidth = Math.max(...this.itemWidths) * this.itemWidths.length;
    let spaces = this.itemWidths.length - 1;
    return [totalWidth + spaces, Math.max(leftHeight, rightHeight)];
  }

  print(width) {
    let itemCount = this.left.itemWidths.length + this.right.itemWidths.length;
    let leftWidth = Math.floor(width * this.left.itemWidths.length / itemCount);
    let leftLines = this.left.print(leftWidth).split('\n');
    let rightLines = this.right.print(width - leftWidth - 1).split('\n');
    let numberOfLines = Math.max(leftLines.length, rightLines.length);
    return Array.from(Array(numberOfLines).keys()).map(function (n) {
        let leftLine = leftLines[n] || ' '.repeat(leftLines[0].length);
        let rightLine = rightLines[n] || ' '.repeat(rightLines[0].length);
        return `${leftLine} ${rightLine}`;
      }).join('\n');
  }
}

class VerticalBlock {
  constructor(top, bottom) {
    this.top = top;
    this.bottom = bottom;
  }

  get itemWidths() {
    return [this.estimatedSize[0]];
  }

  get estimatedSize() {
    let [topWidth, topHeight] = this.top.estimatedSize;
    let [bottomWidth, bottomHeight] = this.bottom.estimatedSize;
    return [Math.max(topWidth, bottomWidth), topHeight + bottomHeight];
  }

  print(width) {
    return [this.top.print(width), this.bottom.print(width)].join('\n');
  }
}

function parse(string, block, scoped = false) {
  if (string.length == 0) return [block, string];

  let char = string.substring(0, 1);
  let tail = string.substring(1);

  switch (char) {
    case '(':
      return parse(tail, new Block(), true);
    case ')':
      return [block, tail];
    case '-':
      let [rightBlock, rightTail] = parse(tail, new Block(), scoped);
      if (scoped) {
        return [new HorizontalBlock(block, rightBlock), rightTail];
      } else {
        return parse(rightTail, new HorizontalBlock(block, rightBlock));
      }
    case '|':
      let [bottomBlock, bottomTail] = parse(tail, new Block(), scoped);
      if (scoped) {
        return [new VerticalBlock(block, bottomBlock), bottomTail];
      } else {
        return parse(bottomTail, new VerticalBlock(block, bottomBlock));
      }
    case '>':
      let [childBlock, childTail] = parse(tail, new Block(), scoped);
      block.child = childBlock;
      return parse(childTail, block, scoped);
    default:
      block.name += char;
      return parse(tail, block, scoped);
  }
}

function print(string, asComment) {
  let [block,] = parse(string, new Block());
  let [width,] = block.estimatedSize;

  if (asComment) {
    return ['/*', ...block.print(width).split('\n').map((l) => ' ' + l), '*/'].join('\n');
  } else {
    return block.print(width);
  }
}

module.exports = print;
