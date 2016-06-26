document.addEventListener('DOMContentLoaded', startGame)
var board = {
  cells: []
}
var numMines = 5
var boardSize = 'small'

function startGame () {
  // Adding event listeners to buttons to change board size. Could be condensed to one line per button but I feel like it's slightly clearer this way? Uses some memory
  // for no real reason though. Using anonymous functions so that changeBoardSize() can be called with the appropriate parameter. There is likely a better way of doing
  // this.
  var smallButton = document.getElementById('small-button')
  smallButton.addEventListener('click', function () {
    changeBoardSize('small')
  })
  var mediumButton = document.getElementById('medium-button')
  mediumButton.addEventListener('click', function () {
    changeBoardSize('medium')
  })
  var largeButton = document.getElementById('large-button')
  largeButton.addEventListener('click', function () {
    changeBoardSize('large')
  })
  randomiseMines()
  initBoard()
}

function addListeners (element) {
  element.addEventListener('click', showCell)
  element.addEventListener('contextmenu', markCell)
}

function showCell (evt) {
  // Should only affect the cell if it's hidden or marked
  if (evt.target.classList.contains('hidden') || evt.target.classList.contains('marked')) {
    evt.target.classList.remove('hidden')
    evt.target.classList.remove('marked')
    // if you reveal a mine, play the explode sound, alert the player they've lost, and reset the board
    if (evt.target.classList.contains('mine')) {
      var mineSound = document.getElementById('mine-sound')
      mineSound.volume = 0.5
      mineSound.play()
      showAllMines()
      alert('You have lost!')
      resetGame()
    } else {
      // if you click a hidden cell that's not a mine, play the reveal sound and show the cell + surrounding cells (and check if the player has won)
      var revealSound = document.getElementById('reveal-sound')
      revealSound.volume = 0.5
      revealSound.play()
      showSurrounding(evt.target)
      checkForWin()
    }
  }
}

function markCell (evt) {
  evt.preventDefault()
  // Manually removing/adding hidden rather than toggling it became necessary when marking and unmarking were handled differently and when marking revealed
  // squares became no longer possible. This seems like clunky implementation but it gets the job done for now.

  // If the cell was already marked, play the unmark sound and remove the mark
  if (evt.target.classList.contains('marked')) {
    var unmarkSound = document.getElementById('unmark-sound')
    unmarkSound.volume = 0.5
    unmarkSound.play()
    evt.target.classList.remove('marked')
    evt.target.classList.add('hidden')
  } else {
    // You can only mark cells that are hidden!
    if (evt.target.classList.contains('hidden')) {
      // If the cell wasn't marked, play the mark sound and add a mark!
      var markSound = document.getElementById('mark-sound')
      markSound.volume = 0.5
      markSound.play()
      evt.target.classList.add('marked')
      evt.target.classList.remove('hidden')
    }
  }
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
  } var victorySound = document.getElementById('victory-sound')
  victorySound.volume = 0.5
  victorySound.play()
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
  // Remove all currently existing mines.
  for (var i = 0; i < squares.length; i++) {
    squares[i].classList.remove('mine')
  } for (var j = 0; j < numMines; j++) {
    var squareCandidate = Math.floor(Math.random() * (squares.length))

    // Check if the square contains a mine. if it doesn't, put a mine there. if it does, set the loop to run one more time so that we get the correct number of mines.

    if (squares[squareCandidate].classList.contains('mine')) {
      j--
    } else {
      squares[squareCandidate].classList.add('mine')
    }
  }
}

function initBoard () {
  // Clear out possible existing board element

  board.cells = []

  // Initialise board.cells, set listeners and surrounding mines

  var squares = document.getElementsByClassName('board')[0].children
  for (var i = 0; i < squares.length; i++) {
    addListeners(squares[i])
    addCellToBoard(squares[i])
  } for (var j = 0; j < board.cells.length; j++) {
    board.cells[j].surroundingMines = countSurroundingMines(board.cells[j])
  }
}

function changeBoardSize (size) {
  // Don't remake the board to the same size
  if (boardSize === size) {
    return
  } else if (confirm('Change board size? This will erase any progress on your current board!')) {
    // Remove all the current html elements of the board
    var myNode = document.getElementsByClassName('board')[0]
    while (myNode.lastChild) {
      myNode.removeChild(myNode.lastChild)
    }
    // Create an appropriate number of new html elements based on selected size, and add row-i and col-j to their classlist.
    // This code does not seem very DRY, and is almost certainly doable in a much more clever way.
    // In particular, assuming only these three cases, it's probably much easier to not delete the whole thing every time.
    // This method is hopefully more open to expansion/revision though.
    switch (size) {
      case 'small':
        boardSize = 'small'
        var boardWidth = '420px'
        numMines = 5
        for (var i = 0; i < 5; i++) {
          for (var j = 0; j < 5; j++) {
            var div = document.createElement('div')
            div.classList.add('row-' + i)
            div.classList.add('col-' + j)
            document.getElementsByClassName('board')[0].appendChild(div)
          }
        }
        break
      case 'medium':
        boardSize = 'medium'
        var boardWidth = '505px'
        numMines = 7
        for (var i = 0; i < 6; i++) {
          for (var j = 0; j < 6; j++) {
            var div = document.createElement('div')
            div.classList.add('row-' + i)
            div.classList.add('col-' + j)
            document.getElementsByClassName('board')[0].appendChild(div)
          }
        }
        break
      case 'large':
        boardSize = 'large'
        var boardWidth = '590px'
        numMines = 10
        for (var i = 0; i < 7; i++) {
          for (var j = 0; j < 7; j++) {
            var div = document.createElement('div')
            div.classList.add('row-' + i)
            div.classList.add('col-' + j)
            document.getElementsByClassName('board')[0].appendChild(div)
          }
        }
        break
      default:
        console.log('invalid board size specified')
    } // Increase board size appropriately. The board width and height should increase by ~83px per square taking into account margins, but 85 should do.
    // As the board is always square, width = height for simplicity. You could instead of changing the style properties add classes to the board html element and then
    // modify the css properties of those classes. That seems like a more elegant solution.
    // then reset the game with the new board (iff it was changed)
    document.getElementsByClassName('board')[0].style.width = boardWidth
    document.getElementsByClassName('board')[0].style.height = boardWidth
    resetGame()
  }
}
