document.addEventListener('DOMContentLoaded', startGame)
var board = {
  cells: []
}

function startGame () {
  var squares = document.getElementsByClassName('board')[0].children
  for (var i = 0; i < squares.length; i++) {
    addListeners(squares[i])
    addCellToBoard(squares[i])
  } for (var j = 0; j < board.cells.length; j++) {
    board.cells[j].surroundingMines = countSurroundingMines(board.cells[j])
  }
}

function addListeners (element) {
  element.addEventListener('click', showCell)
  element.addEventListener('contextmenu', markCell)
}

function showCell (evt) {
  var revealSound = document.getElementbyID("reveal-sound")
  evt.target.classList.remove('hidden')
  if (evt.target.classList.contains('mine')) {
    showAllMines()
    alert('You have lost!')
    resetGame()
  } else {
    revealSound.play()
    showSurrounding(evt.target)
    checkForWin()
  }
}

function markCell (evt) {
  evt.preventDefault()
  evt.target.classList.toggle('marked')
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
  } alert('You have won!')
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
  for (var i = 0; i < squares.length; i++) {
    squares[i].classList.add('hidden')
    squares[i].classList.remove('marked')
    squares[i].innerHTML = ''
    board.cells[i].isProcessed = false
  }
}
