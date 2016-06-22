document.addEventListener('DOMContentLoaded', startGame)
var board = {
  cells: []
}

function startGame () {
  var squares = document.getElementsByClassName('board')[0].children
  console.log(squares)
  for (var i = 0; i < squares.length; i++) {
    addListeners(squares[i])
  }
}

function addListeners (element) {
  element.addEventListener('click', showCell)
  element.addEventListener('contextmenu', markCell)
}

function showCell (evt) {
  evt.target.classList.remove('hidden')
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
