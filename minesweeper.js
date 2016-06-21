document.addEventListener('DOMContentLoaded', startGame)

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
