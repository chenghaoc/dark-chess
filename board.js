let turn = 0
let selectedChess = null
const playerColor = [null, null]

const chesses = [
  new Chess(0, 'black'),

  new Chess(1, 'black'),
  new Chess(1, 'black'),

  new Chess(2, 'black'),
  new Chess(2, 'black'),

  new Chess(3, 'black'),
  new Chess(3, 'black'),

  new Chess(4, 'black'),
  new Chess(4, 'black'),

  new Chess(5, 'black'),
  new Chess(5, 'black'),

  new Chess(6, 'black'),
  new Chess(6, 'black'),
  new Chess(6, 'black'),
  new Chess(6, 'black'),
  new Chess(6, 'black'),

  new Chess(0, 'red'),

  new Chess(1, 'red'),
  new Chess(1, 'red'),

  new Chess(2, 'red'),
  new Chess(2, 'red'),

  new Chess(3, 'red'),
  new Chess(3, 'red'),

  new Chess(4, 'red'),
  new Chess(4, 'red'),

  new Chess(5, 'red'),
  new Chess(5, 'red'),

  new Chess(6, 'red'),
  new Chess(6, 'red'),
  new Chess(6, 'red'),
  new Chess(6, 'red'),
  new Chess(6, 'red')
]

const nameMap = {
  black: ['將', '士', '象', '車', '馬', '砲', '卒'],
  red: ['帥', '仕', '相', '俥', '傌', '炮', '兵']
}


function init() {
  const board = []
  for (let rowIndex = 0; rowIndex < 4; rowIndex ++) {
    let row = []
    for (let colIndex = 0; colIndex < 8; colIndex ++) {
      let ran = Math.floor(Math.random() * chesses.length)
      let target = chesses.splice(ran, 1)

      row.push(target[0])
      target[0].pos = [rowIndex, colIndex]
    }
    board.push(row)
  }
  return board
}

function switchTurn(color) {
  if (!playerColor[turn]) {
    playerColor[turn] = color
    if (color == 'black') {
      playerColor[1 - turn] = 'red'
    } else {
      playerColor[1 - turn] = 'black'
    }
  }
  if (turn === 0) {
    turn = 1
  } else {
    turn = 0
  }
  document.querySelector('.turn').textContent = turn
}

function isAdj(chess1, chess2) {
  if (chess1.pos[0] === chess2.pos[0] && Math.abs(chess1.pos[1] - chess2.pos[1]) === 1) {
    return true
  } else if (chess1.pos[1] === chess2.pos[1] && Math.abs(chess1.pos[0] - chess2.pos[0]) === 1) {
    return true
  }
  return false
}

function isAdjToPlace(chess1, row, col) {
  console.log(chess1)
  console.log(row)
  console.log(col)
  if (chess1.pos[0] === row && Math.abs(chess1.pos[1] - col) === 1) {
    return true
  } else if (chess1.pos[1] === col && Math.abs(chess1.pos[0] - row) === 1) {
    return true
  }
  return false
}

function move(chess, row, col) {
  boardData[chess.pos[0]][chess.pos[1]] = null
  boardData[row][col] = chess
  chess.pos = [row, col]
}

function canFire(chess1, chess2) {
  console.log(chess1)
  console.log(chess2)
  if (chess1.pos[0] === chess2.pos[0]) {
    let small = Math.min(chess1.pos[1], chess2.pos[1]) + 1
    let big = Math.max(chess1.pos[1], chess2.pos[1])
    let counter = 0
    for (small; small < big; small ++) {
      if (boardData[chess1.pos[0]][small]) {
        counter ++
      }
    }
    console.log(counter)
    return counter === 1
  } else if (chess1.pos[1] === chess2.pos[1]) {
    let small = Math.min(chess1.pos[0], chess2.pos[0]) + 1
    let big = Math.max(chess1.pos[0], chess2.pos[0])
    let counter = 0
    for (small + 1; small < big; small ++) {
      if (boardData[small][chess1.pos[1]]) {
        counter ++
      }
    }
    console.log(counter)
    return counter === 1
  }
  return false
}

function canEat(chess1, chess2) {
  if (chess1.type === 6 && chess2.type === 0) return true
  return chess1.type !== 5 && chess1.type <= chess2.type
}

function draw(data, dom) {
  while (dom.firstChild) {
    dom.removeChild(dom.firstChild)
  }
  data.forEach(function (row, rowIndex) {
    let rowDiv = document.createElement('div')
    rowDiv.classList.add('row')
    row.forEach(function (chess, colIndex) {

      let colDiv = document.createElement('div')
      rowDiv.appendChild(colDiv)
      colDiv.classList.add('block')
      if (!chess) {
        colDiv.addEventListener('click', function() {
          if (
            selectedChess &&
            isAdjToPlace(selectedChess, rowIndex, colIndex)
          ) {
            move(selectedChess, rowIndex, colIndex)
            if (selectedChess) {
              selectedChess.unselect()
              selectedChess = null
            }
            switchTurn()
            draw(boardData, document.querySelector('.app'))
          }
        })
        return
      }
      
      colDiv.classList.add(chess.color)
      colDiv.classList.add(chess.type)
      colDiv.classList.add(chess.status)
      colDiv.classList.add(chess.action)
      if (chess.status == 'front') {
        colDiv.textContent = nameMap[chess.color][chess.type]
      }

      colDiv.addEventListener('click', function() {
        if (chess.status === 'back') {
          chess.flip()
          switchTurn(chess.color)
          if (selectedChess) {
            selectedChess.unselect()
            selectedChess = null
          }
        } else if (playerColor[turn] === chess.color) {
          if (selectedChess) {
            selectedChess.unselect()
            selectedChess = null
          }
          chess.select()
          selectedChess = chess
        } else if (
          selectedChess &&
          selectedChess.type === 5 &&
          playerColor[turn] !== chess.color &&
          canFire(selectedChess, chess)) {
            move(selectedChess, chess.pos[0], chess.pos[1])
            if (selectedChess) {
              selectedChess.unselect()
              selectedChess = null
            }
            switchTurn(chess.color)
        } else if (
          selectedChess &&
          selectedChess.type !== 5 &&
          playerColor[turn] !== chess.color &&
          canEat(selectedChess, chess) &&
          isAdj(selectedChess, chess)
        ) {
          move(selectedChess, chess.pos[0], chess.pos[1])
          if (selectedChess) {
            selectedChess.unselect()
            selectedChess = null
          }
          switchTurn(chess.color)
        }
        draw(boardData, document.querySelector('.app'))
      })
      
    })
    dom.appendChild(rowDiv)
  })
}

const boardData = init()

draw(boardData, document.querySelector('.app'))

/*
*  xxxxxxxx
*  xxxxxxxx
*  xxxxxxxx
*  xxxxxxxx
*/