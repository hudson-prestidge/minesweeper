document.addEventListener('DOMContentLoaded', startGame)
var board = {
  cells: []
}
var numMines = 5

function startGame () {
  var smallButton = document.getElementById('smallButton')
  var mediumButton = document.getElementById('mediumButton')
  var largeButton = document.getElementById('largeButton')
  randomiseMines()
  initBoard()
}

function addListeners (element) {
  element.addEventListener('click', showCell)
  element.addEventListener('contextmenu', markCell)
}

function showCell (evt) {
  evt.target.classList.remove('hidden')
  if (evt.target.classList.contains('mine')) {
    document.getElementById('mine-sound').play()
    showAllMines()
    alert('You have lost!')
    resetGame()
  } else {
    document.getElementById("reveal-sound").play()
    showSurrounding(evt.target)
    checkForWin()
  }
}

function markCell (evt) {
  evt.preventDefault()
  if (evt.target.classList.contains('marked')) {
    document.getElementById('unmark-sound').play()
    evt.target.classList.remove('marked')
  } else {
    document.getElementById('mark-sound').play()
    evt.target.classList.add('marked')
  }
  evt.target.classList.toggle('hidden')
  for (var i = 0; i < board.cells.length; i++) {
    if (board.cells[i].row === getRow(evt.target) && board.cells[i].col === getCol(evt.target)) {
      board.cells[i].isMarked = true
    }
  } checkForWin()
}

function getRow (element) {
  for (var i = 0; i < element.classList.length; i++) {
    var classNameParts = element.classList[i].split('-')
    if (classNameParts[0] === 'row') {
      return parseInt(classNameParts[1], 10)
    }
  }
}

function getCol (element) {
  for (var i = 0; i < element.classList.length; i++) {
    var classNameParts = element.classList[i].split('-')
    if (classNameParts[0] === 'col') {
      return parseInt(classNameParts[1], 10)
    }
  }
}

function addCellToBoard (cell) {
  var newCell = {
    row: getRow(cell),
    col: getCol(cell),
    isMine: cell.classList.contains('mine')
  }
  board.cells.push(newCell)
}

function countSurroundingMines (cell) {
  var surroundingCells = getSurroundingCells(cell.row, cell.col)
  var mineCount = 0
  for (var i = 0; i < surroundingCells.length; i++) {
    if (surroundingCells[i].isMine) {
      mineCount++
    }
  } return mineCount
}

function checkForWin () {
  for (var i = 0; i < board.cells.length; i++) {
    var currentCell = board.cells[i]
    if (currentCell.isMine && !currentCell.isMarked) {
      return
    }
  }
  if (document.getElementsByClassName('hidden').length !== 0) {
    return
  } document.getElementById('victory-sound').play()
  alert('You have won!')
  resetGame()
}

function showAllMines () {
  var squares = document.getElementsByClassName('board')[0].children
  for (var i = 0; i < squares.length; i++) {
    if (squares[i].classList.contains('mine')) {
      squares[i].classList.remove('hidden')
    }
  }
}

function resetGame () {
  var squares = document.getElementsByClassName('board')[0].children
  randomiseMines()
  initBoard()
  for (var i = 0; i < squares.length; i++) {
    squares[i].classList.add('hidden')
    squares[i].classList.remove('marked')
    squares[i].innerHTML = ''
    board.cells[i].isProcessed = false
  }
}

function randomiseMines () {
  var squares = document.getElementsByClassName('board')[0].children
  // remove all currently existing mines
  for (var i = 0; i < squares.length; i++) {
    squares[i].classList.remove('mine')
  } for (var j = 0; j < numMines; j++) {
    var squareCandidate = Math.floor(Math.random() * 25)

    // check if the square contains a mine. if it doesn't, put a mine there. if it does, set the loop to run one more time so that we get the correct number of mines

    if (squares[squareCandidate].classList.contains('mine')) {
      j--
    } else {
      squares[squareCandidate].classList.add('mine')
    }
  }
}

function initBoard () {
  // clear out possible existing board element

  board.cells = []

  // initialise board.cells, set listeners and surrounding mines

  var squares = document.getElementsByClassName('board')[0].children
  for (var i = 0; i < squares.length; i++) {
    addListeners(squares[i])
    addCellToBoard(squares[i])
  } for (var j = 0; j < board.cells.length; j++) {
    board.cells[j].surroundingMines = countSurroundingMines(board.cells[j])
  }
}
