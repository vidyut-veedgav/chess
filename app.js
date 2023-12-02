//defining global variables
const gameBoard = document.querySelector("#gameboard"); //gameboard
const playerDisplay = document.querySelector("#player"); //player
const infoDisplay = document.querySelector("#info-display"); //info
const width = 8; //width of gameboard
let playerGo = 'black'
playerDisplay.textContent = 'blacks'

const startPieces = [
    rook, knight, bishop, queen, king, bishop, knight, rook,
     pawn, pawn, pawn, pawn, pawn, pawn, pawn, pawn,
     '', '', '', '', '', '', '', '', 
     '', '', '', '', '', '', '', '', 
     '', '', '', '', '', '', '', '', 
     '', '', '', '', '', '', '', '', 
     pawn, pawn, pawn, pawn, pawn, pawn, pawn, pawn,
     rook, knight, bishop, queen, king, bishop, knight, rook,
]

function createBoard() {
    startPieces.forEach((startPiece, i) => {
        const square = document.createElement('div')
        square.classList.add('square')
        square.innerHTML = startPiece
        square.firstChild?.setAttribute('draggable', true)
        square.setAttribute('square-id', i)
        //square.classList.add('beige')
        const row = Math.floor((63 - i)/ 8) + 1
        if (row % 2 === 0) {
            square.classList.add(i % 2 === 0 ? "beige" : "brown");
        } else {
            square.classList.add(i % 2 === 0 ? "brown" : "beige");
        }
        if (i <= 15) { 
            square.firstChild.firstChild.classList.add('black');
        } else if (i >= 48) {
            square.firstChild.firstChild.classList.add('white');
        }
        gameBoard.append(square)
    })
}
createBoard()
 
const allSquares = document.querySelectorAll("#gameboard .square")

allSquares.forEach((square) => {
    square.addEventListener('dragstart', dragStart)
    square.addEventListener('dragover', dragOver)
    square.addEventListener('drop', dragDrop)
})

let startPositionId
let draggedElement

function dragStart(e) {
    console.log(e.target.parentNode.getAttribute('square-id'));
    draggedElement = e.target
}

function dragOver(e) {
    e.preventDefault()
}

function dragDrop(e) {
    e.stopPropagation() 
    console.log('playerGo', playerGo);

    console.log('e.target', e.target);
    const correctGo = draggedElement.firstChild.classList.contains(playerGo)
    const taken = e.target.classList.contains('piece')
    const opponentGo = playerGo === 'white' ? 'black' : 'white'
    console.log('opponentGo', opponentGo);
    const takenByOpponent = e.target.firstChild?.classList.contains(opponentGo)
    
    //e.target.parentNode.append(draggedElement)
    //e.target.remove()
    //e.target.append(draggedElement)
    changePlayer()
}

function changePlayer() {
    if (playerGo === 'black') {
        reverseIds()
        playerGo = 'white'
        playerDisplay.textContent = 'white'
    } else {
        revertIds()
        playerGo = 'black'
        playerDisplay.textContent = 'black'
    }
}

function reverseIds() {
    const allSquares = document.querySelectorAll(".square")
    allSquares.forEach((square, i) => 
        square.setAttribute('square-id', (width * width - 1) - i))
}

function revertIds() {
    const allSquares = document.querySelectorAll(".square")
    allSquares.forEach((square, i) => square.setAttribute('square-id', i))
}
