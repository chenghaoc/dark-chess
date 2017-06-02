

// 0
// 1
// 2
// 3
// 4
// 5
// 6



// black
// red



function Chess(type, color, status = 'back') {
  this.type = type
  this.color = color
  this.status = status
  this.action = 'none'
  this.pos = [null, null]
}

Chess.prototype.flip = function() {
  this.status = 'front'
}

Chess.prototype.select = function() {
  this.action = 'selected'
}

Chess.prototype.unselect = function() {
  this.action = 'none'
}

// Chess.prototype.move = function(pos) {
//   this.action = 'selected'
// }