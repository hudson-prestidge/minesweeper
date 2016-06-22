document.addEventListener('DOMContentLoaded', startGame)
var board = {
  cells: []
}

function startGame () {
  var squares = document.getElementsByClassName('board')[0].children
  console.log(squares)
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
  evt.target.classList.remove('hidden')
  showSurrounding(evt.target)
}

function markCell (evt) {
  evt.preventDefault()
  evt.target.classList.toggle('marked')
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
