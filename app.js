//defining global variables
const gameBoard = document.querySelector("#gameboard"); //gameboard
const playerDisplay = document.querySelector("#player"); //player
const infoDisplay = document.querySelector("#info-display"); //info
const width = 8; //width of gameboard
let playerGo = 'black' //keeping track of who's turn it is
playerDisplay.textContent = "black"

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
 
const allSquares = document.querySelectorAll(".square")

allSquares.forEach(square => {
    square.addEventListener('dragstart', dragStart)
    square.addEventListener('dragover', dragOver)
    square.addEventListener('drop', dragDrop)
})

let startPositionId
let draggedElement

function dragStart(e) {
    startPositionId = e.target.closest('.square').getAttribute('square-id');
    console.log("STARTPOSITION CELL: ", e.target.closest('.square'));
    draggedElement = e.target //MAYBE USE CLOSEST ON THIS
    console.log("DRAGGED ELEMENT/E.TARGET", draggedElement);
}

function dragOver(e) {
    e.preventDefault()
}

//DRAG DROP FUNCTION - CENTRAL COMMAND
function dragDrop(e) {

    e.stopPropagation()
    console.log("E.TARGET", e.target);

    //check if the correct player is going
    const correctTurn = draggedElement.firstChild.classList.contains(playerGo)
    console.log("isCorrectGo", correctTurn);

    //keeping track of the opponent's color for a given move
    const opponentTurn = playerGo === 'white' ? 'black' : 'white'
    console.log("isOpponentGo", opponentTurn);

    //check if something is taken
    const squareOccupied = e.target.classList.contains('piece');

    //check if something is taken by opponent
    const opponentPieceCaptured = (e.target !== null) && e.target.classList.contains(opponentTurn);
    console.log("opponentPieceCaptured", opponentPieceCaptured);

    //check if the movement is valid
    const validMove = checkIfValid(e.target)
    console.log("is valid: ", validMove);

    //checks if the correct player is going
    if (correctTurn) {

        //checks if the move is valid and is a taking action
        if (opponentPieceCaptured  && validMove) {
            e.target.parentNode.append(draggedElement)
            e.target.remove()
            changePlayer()
            return
        }

        //checks if the move is just valid and no piece is taken
        if (validMove) {
            console.log("valid move?", validMove);
            console.log("Valid move: Normal move");
            e.target.append(draggedElement)
            changePlayer()
            return
        }

        /*
        //checks if a player attempts to attempts to capture their own piece
        if (squareOccupied && !opponentPieceCaptured) {
            console.log("Invalid move: Square already occupied");
            infoDisplay.textContent = "Invalid Move"
            setTimeout(() => infoDisplay.textContent = "", 2000)
            return
        }

        //checks if the move is just valid and no piece is taken
        if (validMove) {
            console.log(validMove);
            console.log("Valid move: Normal move");
            e.target.append(draggedElement)
            changePlayer()
            return
        }
        */
    }
    changePlayer()

    /*
    e.stopPropagation() 

    //checks if the correct player is going
    const correctGo = draggedElement.firstChild.classList.contains(playerGo)
    const taken = e.target.classList.contains('piece')
    console.log("taken: " + taken);
    const valid = checkIfValid(e.target)
    console.log("valid: " + valid);
    const opponentGo = playerGo === 'white' ? 'black' : 'white'
    console.log("opponentGo: " + opponentGo);
    const takenByOpponent = e.target.firstChild?.classList.contains(opponentGo)
    console.log("takenByOpponent");
    
    if (correctGo) {

        if (takenByOpponent && valid) {
            console.log("Valid move: Take opponent's piece");
            e.target.parentNode.append(draggedElement)
            e.target.remove()
            changePlayer()
            return
        }

        if (taken && !takenByOpponent) {
            console.log("Invalid move: Square already occupied");
            infoDisplay.textContent = "Invalid Move"
            setTimeout(() => infoDisplay.textContent = "", 2000)
            return
        }

        if (valid) {
            console.log("Valid move: Normal move");
            e.target.append(draggedElement)
            changePlayer()
            return
        }
    }
    console.log("Invalid move: Incorrect piece or invalid destination");
    changePlayer()
    */
}

/**
 * a function which checks if the 
 * @param {} target 
 * @returns 
 */
function checkIfValid(target) {

    console.log("VALIDITY CHECK");

    let targetId
    console.log(target);
    console.log(target.getAttribute('square-id') !== null);
    console.log(target.parentNode.getAttribute('square-id') !== null);
    console.log(target.parentNode.parentNode.getAttribute('square-id') !== null);

    //target itself
    if (target.getAttribute('square-id') !== null) {
        console.log("SQUARE ITSELF IS THE TARGET");
        targetId = Number(target.getAttribute('square-id')); 
        trueTargetSquare = target;
        console.log("trueTargetSquare" + trueTargetSquare);
    
    //1st parent
    } else if (target.parentNode.getAttribute('square-id') !== null) {
        console.log("1st PARENT");
        targetId = Number(target.parentNode.getAttribute('square-id'));
        trueTargetSquare = target.parentNode;
        console.log("trueTargetSquare" + trueTargetSquare);

    //2nd parent
    } else if (target.parentNode.parentNode.getAttribute('square-id') !== null) {
        console.log("2nd PARENT");
        targetId = Number(target.parentNode.parentNode.getAttribute('square-id'));
        trueTargetSquare = target.parentNode.parentNode;
        console.log("trueTargetSquare" + trueTargetSquare);
    }

    //3rd parent
    else if (target.parentNode.parentNode.parentNode.getAttribute('square-id') !== null) {
        console.log("3rd PARENT");
        targetId = Number(target.parentNode.parentNode.parentNode.getAttribute('square-id'));
        trueTargetSquare = target.parentNode.parentNode.parentNode;
        console.log("trueTargetSquare" + trueTargetSquare);
    }

    //4th parent
    else if (target.parentNode.parentNode.parentNode.parentNode.getAttribute('square-id') !== null) {
        console.log("4th PARENT");
        targetId = Number(target.parentNode.parentNode.parentNode.parentNode.getAttribute('square-id'));
        trueTargetSquare = target.parentNode.parentNode.parentNode.parentNode;
        console.log("trueTargetSquare" + trueTargetSquare);
    }

    /*
    //5th parent
    else if (target.parentNode.parentNode.parentNode.getAttribute('square-id') !== null) {
        console.log("target is the icon");
        targetId = Number(target.parentNode.parentNode.parentNode.getAttribute('square-id'));
        trueTargetSquare = target.parentNode.parentNode.parentNode;
    }

    //6th parent
    else if (target.parentNode.parentNode.parentNode.getAttribute('square-id') !== null) {
        console.log("target is the icon");
        targetId = Number(target.parentNode.parentNode.parentNode.getAttribute('square-id'));
        trueTargetSquare = target.parentNode.parentNode.parentNode;
    }

    //7th parent
    else if (target.parentNode.parentNode.parentNode.getAttribute('square-id') !== null) {
        console.log("target is the icon");
        targetId = Number(target.parentNode.parentNode.parentNode.getAttribute('square-id'));
        trueTargetSquare = target.parentNode.parentNode.parentNode;
    }

    //8th parent
    else if (target.parentNode.parentNode.parentNode.getAttribute('square-id') !== null) {
        console.log("target is the icon");
        targetId = Number(target.parentNode.parentNode.parentNode.getAttribute('square-id'));
        trueTargetSquare = target.parentNode.parentNode.parentNode;
    }
    //10th parent
    else if (target.parentNode.parentNode.parentNode.getAttribute('square-id') !== null) {
        console.log("target is the icon");
        targetId = Number(target.parentNode.parentNode.parentNode.getAttribute('square-id'));
        trueTargetSquare = target.parentNode.parentNode.parentNode;
    }
    else if (target.parentNode.parentNode.parentNode.getAttribute('square-id') !== null) {
        console.log("target is the icon");
        targetId = Number(target.parentNode.parentNode.parentNode.getAttribute('square-id'));
        trueTargetSquare = target.parentNode.parentNode.parentNode;
    }
    else if (target.parentNode.parentNode.parentNode.getAttribute('square-id') !== null) {
        console.log("target is the icon");
        targetId = Number(target.parentNode.parentNode.parentNode.getAttribute('square-id'));
        trueTargetSquare = target.parentNode.parentNode.parentNode;
    }
    else if (target.parentNode.parentNode.parentNode.getAttribute('square-id') !== null) {
        console.log("target is the icon");
        targetId = Number(target.parentNode.parentNode.parentNode.getAttribute('square-id'));
        trueTargetSquare = target.parentNode.parentNode.parentNode;
    }
    else if (target.parentNode.parentNode.parentNode.getAttribute('square-id') !== null) {
        console.log("target is the icon");
        targetId = Number(target.parentNode.parentNode.parentNode.getAttribute('square-id'));
        trueTargetSquare = target.parentNode.parentNode.parentNode;
    }
    else if (target.parentNode.parentNode.parentNode.getAttribute('square-id') !== null) {
        console.log("target is the icon");
        targetId = Number(target.parentNode.parentNode.parentNode.getAttribute('square-id'));
        trueTargetSquare = target.parentNode.parentNode.parentNode;
    }
    else if (target.parentNode.parentNode.parentNode.getAttribute('square-id') !== null) {
        console.log("target is the icon");
        targetId = Number(target.parentNode.parentNode.parentNode.getAttribute('square-id'));
        trueTargetSquare = target.parentNode.parentNode.parentNode;
    }
    else if (target.parentNode.parentNode.parentNode.getAttribute('square-id') !== null) {
        console.log("target is the icon");
        targetId = Number(target.parentNode.parentNode.parentNode.getAttribute('square-id'));
        trueTargetSquare = target.parentNode.parentNode.parentNode;
    }
    else if (target.parentNode.parentNode.parentNode.getAttribute('square-id') !== null) {
        console.log("target is the icon");
        targetId = Number(target.parentNode.parentNode.parentNode.getAttribute('square-id'));
        trueTargetSquare = target.parentNode.parentNode.parentNode;
    }
    else if (target.parentNode.parentNode.parentNode.getAttribute('square-id') !== null) {
        console.log("target is the icon");
        targetId = Number(target.parentNode.parentNode.parentNode.getAttribute('square-id'));
        trueTargetSquare = target.parentNode.parentNode.parentNode;
    }
    //20th parent
    else if (target.parentNode.parentNode.parentNode.getAttribute('square-id') !== null) {
        console.log("target is the icon");
        targetId = Number(target.parentNode.parentNode.parentNode.getAttribute('square-id'));
        trueTargetSquare = target.parentNode.parentNode.parentNode;
    }
    else if (target.parentNode.parentNode.parentNode.getAttribute('square-id') !== null) {
        console.log("target is the icon");
        targetId = Number(target.parentNode.parentNode.parentNode.getAttribute('square-id'));
        trueTargetSquare = target.parentNode.parentNode.parentNode;
    }
    else if (target.parentNode.parentNode.parentNode.getAttribute('square-id') !== null) {
        console.log("target is the icon");
        targetId = Number(target.parentNode.parentNode.parentNode.getAttribute('square-id'));
        trueTargetSquare = target.parentNode.parentNode.parentNode;
    }
    else if (target.parentNode.parentNode.parentNode.getAttribute('square-id') !== null) {
        console.log("target is the icon");
        targetId = Number(target.parentNode.parentNode.parentNode.getAttribute('square-id'));
        trueTargetSquare = target.parentNode.parentNode.parentNode;
    }
    else if (target.parentNode.parentNode.parentNode.getAttribute('square-id') !== null) {
        console.log("target is the icon");
        targetId = Number(target.parentNode.parentNode.parentNode.getAttribute('square-id'));
        trueTargetSquare = target.parentNode.parentNode.parentNode;
    }
    else if (target.parentNode.parentNode.parentNode.getAttribute('square-id') !== null) {
        console.log("target is the icon");
        targetId = Number(target.parentNode.parentNode.parentNode.getAttribute('square-id'));
        trueTargetSquare = target.parentNode.parentNode.parentNode;
    }
    else if (target.parentNode.parentNode.parentNode.getAttribute('square-id') !== null) {
        console.log("target is the icon");
        targetId = Number(target.parentNode.parentNode.parentNode.getAttribute('square-id'));
        trueTargetSquare = target.parentNode.parentNode.parentNode;
    }
    else if (target.parentNode.parentNode.parentNode.getAttribute('square-id') !== null) {
        console.log("target is the icon");
        targetId = Number(target.parentNode.parentNode.parentNode.getAttribute('square-id'));
        trueTargetSquare = target.parentNode.parentNode.parentNode;
    }
    else if (target.parentNode.parentNode.parentNode.getAttribute('square-id') !== null) {
        console.log("target is the icon");
        targetId = Number(target.parentNode.parentNode.parentNode.getAttribute('square-id'));
        trueTargetSquare = target.parentNode.parentNode.parentNode;
    }
    else if (target.parentNode.parentNode.parentNode.getAttribute('square-id') !== null) {
        console.log("target is the icon");
        targetId = Number(target.parentNode.parentNode.parentNode.getAttribute('square-id'));
        trueTargetSquare = target.parentNode.parentNode.parentNode;
    }
    //30th parent
    else if (target.parentNode.parentNode.parentNode.getAttribute('square-id') !== null) {
        console.log("target is the icon");
        targetId = Number(target.parentNode.parentNode.parentNode.getAttribute('square-id'));
        trueTargetSquare = target.parentNode.parentNode.parentNode;
    }
    //31st parent
    else if (target.parentNode.parentNode.parentNode.getAttribute('square-id') !== null) {
        console.log("target is the icon");
        targetId = Number(target.parentNode.parentNode.parentNode.getAttribute('square-id'));
        trueTargetSquare = target.parentNode.parentNode.parentNode;
    }
    */

    const startId = Number(startPositionId)
    const piece = draggedElement.id
    console.log('target', target);
    console.log("target's parent", target.parentNode);
    console.log("target's grandparent", target.parentNode.parentNode);
    console.log('startId', startId);
    console.log('targetId', targetId);
    console.log('piece', piece);

    switch (piece) {
        case 'pawn':
            const starterRow = [8, 9, 10, 11, 12, 13, 14, 15]

            //checks if the pawn is at starting position, and wants to move 2 squares forward
            if (starterRow.includes(startId) && (startId + width * 2 === targetId || startId + width === targetId)) {
                return true;
            }

            //checks if the pawn wants to move one square forward
            if (startId + width === targetId) {
                return true;
            }
            
            //checks if the pawn wants to take diagonally to the right
            if (startId + width - 1 === targetId && trueTargetSquare.firstChild.classList.contains('piece')) {
                return true;
            }

            //checks if the pawn wants to take diagonally to the left
            if (startId + width + 1 === targetId && trueTargetSquare.firstChild.classList.contains('piece')) {
                return true;
            }
            return false;

            /*
            const starterRow = [8, 9, 10, 11, 12, 13, 14, 15]
            if (starterRow.includes(startId) && startId + width * 2 === targetId 
            || startId + width === targetId
            || startId + width - 1 === targetId && document.querySelector('[square-id="${startId + width - 1}"]')
            || startId + width + 1 === targetId && document.querySelector('[square-id="${startId + width + 1}"]')) 
            {
                return true
            } else {
                return false;
            }
        /*
            console.log("PAWN HAS BEEN MOVED");
            const starterRow = [8, 9, 10, 11, 12, 13, 14, 15]
            if (
            starterRow.includes(startId) && startId + width * 2 === targetId
            || startId + width === targetId
            || startId + width - 1 === targetId && document.querySelector('[square-id="${startId + width - 1}"]').firstChild
            || startId + width + 1 === targetId && document.querySelector('[square-id="${startId + width + 1}"]').firstChild) 
            {
                return true
            } 
            const newRow = [48, 49, 50, 51, 52, 53, 54, 55]
            if (
            newRow.includes(startId) && startId - width * 2 === targetId
            || startId - width === targetId
            || startId - width - 1 === targetId && document.querySelector('[square-id="${startId + width - 1}"]').firstChild
            || startId - width + 1 === targetId && document.querySelector('[square-id="${startId + width + 1}"]').firstChild) 
            {
                return true
            } 
            break; 
            */

        case 'knight':
            console.log("KNIGHT HAS BEEN MOVED");
            if (
                startId + width * 2 + 1 === targetId ||
                startId + width * 2 - 1 === targetId ||
                startId + width - 2 === targetId ||
                startId + width + 2 === targetId ||
                startId - width * 2 + 1 === targetId ||
                startId - width * 2 - 1 === targetId ||
                startId - width - 2 === targetId ||
                startId - width + 2 === targetId
                ) {
                    return true
            }
            break;
            
        case 'bishop':
            console.log("BISHOP MOVEMENT: ");
            const isDiagonalMove = Math.abs(targetId % width - startId % width) === Math.abs(Math.floor(targetId / width) - Math.floor(startId / width))
            if (isDiagonalMove) {
                const directionX = targetId % width > startId % width ? 1 : -1;
                const directionY = Math.floor(targetId / width) > Math.floor(startId / width) ? 1 : -1;

                let currentSquare = startId + width * directionY + directionX;
                while (currentSquare !== targetId) {

                    const currentSquareElement = document.querySelector(`[square-id="${currentSquare}"]`);

                    console.log("currently on: " + currentSquareElement.firstChild);
                    if (!currentSquareElement) {
                        return false;
                    }

                    const squareContent = currentSquareElement.firstChild;
                    console.log(squareContent);
                    if (squareContent && currentSquare !== targetId) {
                        return false;
                    }
                    currentSquare += width * directionY + directionX;
                    console.log("moved to: " + currentSquare)
                }
                return true
            } 
            break;

        case 'rook':
            console.log("ROOK HAS BEEN MOVED");
            const isVerticalMove = startId % width === targetId % width;
            const isHorizontalMove = Math.floor(startId / width) === Math.floor(targetId / width);
            if (isVerticalMove) {
                const direction = targetId > startId ? 1 : -1;
                const increment = width * direction;

                let currentSquare = startId + increment;

                while (currentSquare !== targetId) {
                    const currentSquareElement = document.querySelector(`[square-id="${currentSquare}"]`);
                    if (!currentSquareElement) {
                        return false;
                    }

                    const squareContent = currentSquareElement.firstChild;
                    if (squareContent) {
                        return false;
                    }
                    currentSquare += increment;
                }
                return true;
            } else if (isHorizontalMove) {
                const direction = targetId > startId ? 1 : -1;
                const increment = direction;

                let currentSquare = startId + increment;

                while (currentSquare !== targetId) {
                    const currentSquareElement = document.querySelector(`[square-id="${currentSquare}"]`);
                    if (!currentSquareElement) {
                        return false;
                    }

                    const squareContent = currentSquareElement.firstChild;
                    if (squareContent) {
                        return false;
                    }
                    currentSquare += increment;
                }
                return true;
            } else {
                break;
            }
        case 'queen':
            console.log("QUEEN HAS BEEN MOVED");
            const isDiagonalMove_Queen = Math.abs(targetId % width - startId % width) === Math.abs(Math.floor(targetId / width) - Math.floor(startId / width))
            const isVerticalMove_Queen = startId % width === targetId % width;
            const isHorizontalMove_Queen = Math.floor(startId / width) === Math.floor(targetId / width);
            if (isDiagonalMove_Queen) {
                const directionX = targetId % width > startId % width ? 1 : -1;
                const directionY = Math.floor(targetId / width) > Math.floor(startId / width) ? 1 : -1;

                let currentSquare = startId + width * directionY + directionX;

                while (currentSquare !== targetId) {
                    const currentSquareElement = document.querySelector(`[square-id="${currentSquare}"]`);
                    if (!currentSquareElement) {
                        return false;
                    }
                    const squareContent = currentSquareElement.firstChild;
                    if (squareContent) {
                        return false;
                    }
                    currentSquare += width * directionY + directionX;
                }
                return true
            } else if (isVerticalMove_Queen) {
                const direction = targetId > startId ? 1 : -1;
                const increment = width * direction;

                let currentSquare = startId + increment;

                while (currentSquare !== targetId) {
                    const currentSquareElement = document.querySelector(`[square-id="${currentSquare}"]`);
                    if (!currentSquareElement) {
                        return false;
                    }

                    const squareContent = currentSquareElement.firstChild;
                    if (squareContent) {
                        return false;
                    }
                    currentSquare += increment;
                }
                return true;
            } else if (isHorizontalMove_Queen) {
                const direction = targetId > startId ? 1 : -1;
                const increment = direction;

                let currentSquare = startId + increment;

                while (currentSquare !== targetId) {
                    const currentSquareElement = document.querySelector(`[square-id="${currentSquare}"]`);
                    if (!currentSquareElement) {
                        return false;
                    }

                    const squareContent = currentSquareElement.firstChild;
                    if (squareContent) {
                        return false;
                    }
                    currentSquare += increment;
                }
                return true;
            } else {
                break;
            }
        case 'king':
            if (
                startId + 1 === targetId ||
                startId - 1 === targetId ||
                startId + width === targetId ||
                startId - width === targetId ||
                startId + width - 1 === targetId ||
                startId + width + 1 === targetId ||
                startId - width - 1 === targetId ||
                startId - width + 1 === targetId
            ) {
                return true
            }
            break;
    }
}

function changePlayer() {
    if (playerGo === 'black') {
        reverseIds()
        playerGo = 'white'
        playerDisplay.textContent = "white"
    } else {
        revertIds()
        playerGo = 'black'
        playerDisplay.textContent = "black"
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

function checkForWin() {
    const kings = Array.from(document.querySelectorAll('#king'))
    console.log(kings);
    if (!kings.some(king => king.firstChild.classList.contains('white'))) {
        infoDisplay.innerHTML = "Black player wins!"
        const allSquares = document.querySelectorAll('.square')
        allSquares.forEach(square => square.firstChild?.setAttribute('draggable', false))
    }
    if (kings.some(king => king.firstChild.classList.contains('black'))) {
        infoDisplay.innerHTML = "White player wins!"
        const allSquares = document.querySelectorAll('.square')
        allSquares.forEach(square => square.firstChild?.setAttribute('draggable', false))
    }
}

    /*
    switch (piece) {
        case 'pawn' :
            const starterRow = [8, 9, 10, 11, 12, 13, 14, 15]
            if (starterRow.includes(startId) && startId + width * 2 === targetId
            || startId + width === targetId
            || startId + width - 1 === targetId && document.querySelector('[square-id="${startId + width - 1}"]').firstChild
            || startId + width + 1 === targetId && document.querySelector('[square-id="${startId + width + 1}"]').firstChild) 
            {
                return true
            }
            break; 
        case 'knight' :
            if (
                startId + width * 2 + 1 === targetId ||
                startId + width * 2 - 1 === targetId ||
                startId + width - 2 === targetId ||
                startId + width + 2 === targetId ||
                startId - width * 2 + 1 === targetId ||
                startId - width * 2 - 1 === targetId ||
                startId - width - 2 === targetId ||
                startId - width + 2 === targetId
                ) {
                    return true
            }
            break;
        case 'bishop' :
            if (
                //moving in the rightward direction
                startId + width + 1 === targetId ||
                startId + width * 2 + 2 === targetId && !document.querySelector('[square-id="${startId + width + 1}"]').firstChild === targetId ||
                startId + width * 3 + 3 === targetId && !document.querySelector('[square-id="${startId + width + 1}"]').firstChild && !document.querySelector('[square-id="${startId + width * 2 + 2}"]').firstChild ||
                startId + width * 4 + 4 === targetId && !document.querySelector('[square-id="${startId + width + 1}"]').firstChild && !document.querySelector('[square-id="${startId + width * 2 + 2}"]').firstChild && !document.querySelector('[square-id="${startId + width * 3 + 3}"]').firstChild ||
                startId + width * 5 + 5 === targetId && !document.querySelector('[square-id="${startId + width + 1}"]').firstChild && !document.querySelector('[square-id="${startId + width * 2 + 2}"]').firstChild && !document.querySelector('[square-id="${startId + width * 3 + 3}"]').firstChild && !document.querySelector('[square-id="${startId + width * 4 + 4}"]').firstChild ||
                startId + width * 6 + 6 === targetId && !document.querySelector('[square-id="${startId + width + 1}"]').firstChild && !document.querySelector('[square-id="${startId + width * 2 + 2}"]').firstChild && !document.querySelector('[square-id="${startId + width * 3 + 3}"]').firstChild && !document.querySelector('[square-id="${startId + width * 4 + 4}"]').firstChild && !document.querySelector('[square-id="${startId + width * 5 + 5}"]').firstChild ||
                startId + width * 7 + 7 === targetId && !document.querySelector('[square-id="${startId + width + 1}"]').firstChild && !document.querySelector('[square-id="${startId + width * 2 + 2}"]').firstChild && !document.querySelector('[square-id="${startId + width * 3 + 3}"]').firstChild && !document.querySelector('[square-id="${startId + width * 4 + 4}"]').firstChild && !document.querySelector('[square-id="${startId + width * 5 + 5}"]').firstChild && !document.querySelector('[square-id="${startId + width * 6 + 6}"]').firstChild ||
                //moving in the leftward direction
                startId - width - 1 === targetId ||
                startId - width * 3 - 3 === targetId && !document.querySelector('[square-id="${startId - width - 1}"]').firstChild && !document.querySelector('[square-id="${startId - width * 2 - 2}"]').firstChild ||
                startId - width * 2 - 2 === targetId && !document.querySelector('[square-id="${startId - width - 1}"]').firstChild ||
                startId - width * 4 - 4 === targetId && !document.querySelector('[square-id="${startId - width - 1}"]').firstChild && !document.querySelector('[square-id="${startId - width * 2 - 2}"]').firstChild && !document.querySelector('[square-id="${startId - width * 3 - 3}"]').firstChild ||
                startId - width * 5 - 5 === targetId && !document.querySelector('[square-id="${startId - width - 1}"]').firstChild && !document.querySelector('[square-id="${startId - width * 2 - 2}"]').firstChild && !document.querySelector('[square-id="${startId - width * 3 - 3}"]').firstChild && !document.querySelector('[square-id="${startId - width * 4 - 4}"]').firstChild ||
                startId - width * 6 - 6 === targetId && !document.querySelector('[square-id="${startId - width - 1}"]').firstChild && !document.querySelector('[square-id="${startId - width * 2 - 2}"]').firstChild && !document.querySelector('[square-id="${startId - width * 3 - 3}"]').firstChild && !document.querySelector('[square-id="${startId - width * 4 - 4}"]').firstChild && !document.querySelector('[square-id="${startId - width * 5 - 5}"]').firstChild ||
                startId - width * 7 - 7 === targetId && !document.querySelector('[square-id="${startId - width - 1}"]').firstChild && !document.querySelector('[square-id="${startId - width * 2 - 2}"]').firstChild && !document.querySelector('[square-id="${startId - width * 3 - 3}"]').firstChild && !document.querySelector('[square-id="${startId - width * 4 - 4}"]').firstChild && !document.querySelector('[square-id="${startId - width * 5 - 5}"]').firstChild && !document.querySelector('[square-id="${startId - width * 6 - 6}"]').firstChild ||

                //moving backwards in the rightward direction
                startId - width + 1 === targetId ||
                startId - width * 2 + 2 === targetId && !document.querySelector('[square-id="${startId - width + 1}"]').firstChild ||
                startId - width * 3 + 3 === targetId && !document.querySelector('[square-id="${startId - width + 1}"]').firstChild && !document.querySelector('[square-id="${startId - width * 2 + 2}"]').firstChild ||
                startId - width * 4 + 4 === targetId && !document.querySelector('[square-id="${startId - width + 1}"]').firstChild && !document.querySelector('[square-id="${startId - width * 2 + 2}"]').firstChild && !document.querySelector('[square-id="${startId - width * 3 + 3}"]').firstChild ||
                startId - width * 5 + 5 === targetId && !document.querySelector('[square-id="${startId - width + 1}"]').firstChild && !document.querySelector('[square-id="${startId - width * 2 + 2}"]').firstChild && !document.querySelector('[square-id="${startId - width * 3 + 3}"]').firstChild && !document.querySelector('[square-id="${startId - width * 4 + 4}"]').firstChild ||
                startId - width * 6 + 6 === targetId && !document.querySelector('[square-id="${startId - width + 1}"]').firstChild && !document.querySelector('[square-id="${startId - width * 2 + 2}"]').firstChild && !document.querySelector('[square-id="${startId - width * 3 + 3}"]').firstChild && !document.querySelector('[square-id="${startId - width * 4 + 4}"]').firstChild && !document.querySelector('[square-id="${startId - width * 5 + 5}"]').firstChild ||
                startId - width * 7 + 7 === targetId && !document.querySelector('[square-id="${startId - width + 1}"]').firstChild && !document.querySelector('[square-id="${startId - width * 2 + 2}"]').firstChild && !document.querySelector('[square-id="${startId - width * 3 + 3}"]').firstChild && !document.querySelector('[square-id="${startId - width * 4 + 4}"]').firstChild && !document.querySelector('[square-id="${startId - width * 5 + 5}"]').firstChild && !document.querySelector('[square-id="${startId - width * 6 + 6}"]').firstChild ||

                //moving backwards in the leftward direction
                startId + width - 1 === targetId ||
                startId + width * 2 - 2 === targetId && !document.querySelector('[square-id="${startId + width - 1}"]').firstChild ||
                startId + width * 3 - 3 === targetId && !document.querySelector('[square-id="${startId + width - 1}"]').firstChild && !document.querySelector('[square-id="${startId + width * 2 - 2}"]').firstChild ||
                startId + width * 4 - 4 === targetId && !document.querySelector('[square-id="${startId + width - 1}"]').firstChild && !document.querySelector('[square-id="${startId + width * 2 - 2}"]').firstChild && !document.querySelector('[square-id="${startId + width * 3 - 3}"]').firstChild ||
                startId + width * 5 - 5 === targetId && !document.querySelector('[square-id="${startId + width - 1}"]').firstChild && !document.querySelector('[square-id="${startId + width * 2 - 2}"]').firstChild && !document.querySelector('[square-id="${startId + width * 3 - 3}"]').firstChild && !document.querySelector('[square-id="${startId + width * 4 - 4}"]').firstChild ||
                startId + width * 6 - 6 === targetId && !document.querySelector('[square-id="${startId + width - 1}"]').firstChild && !document.querySelector('[square-id="${startId + width * 2 - 2}"]').firstChild && !document.querySelector('[square-id="${startId + width * 3 - 3}"]').firstChild && !document.querySelector('[square-id="${startId + width * 4 - 4}"]').firstChild && !document.querySelector('[square-id="${startId + width * 5 - 5}"]').firstChild ||
                startId + width * 7 - 7 === targetId && !document.querySelector('[square-id="${startId + width - 1}"]').firstChild && !document.querySelector('[square-id="${startId + width * 2 - 2}"]').firstChild && !document.querySelector('[square-id="${startId + width * 3 - 3}"]').firstChild && !document.querySelector('[square-id="${startId + width * 4 - 4}"]').firstChild && !document.querySelector('[square-id="${startId + width * 5 - 5}"]').firstChild && !document.querySelector('[square-id="${startId + width * 6 - 6}"]').firstChild
            ) {
                return true
            }
            break;
    }
    */

    /*  const isHorizontalMove = Math.floor(startId / width) === Math.floor(targetId / width);
            if (isHorizontalMove) {
                const direction = targetId > startId ? 1 : -1;
                const increment = direction;

                let currentSquare = startId + increment;

                while (currentSquare !== targetId) {
                    const currentSquareElement = document.querySelector(`[square-id="${currentSquare}"]`);
                    if (!currentSquareElement) {
                        return false;
                    }

                    const squareContent = currentSquareElement.firstChild;
                    if (squareContent) {
                        return false;
                    }
                    currentSquare += increment;
                }
                return true;
            }*/

/*

            const starterRow = [8, 9, 10, 11, 12, 13, 14, 15]

            //checking if the targetId for the starting pawn is one or two spaces up
            if (starterRow.includes(startId) && startId + width * 2 === targetId || startId + width === targetId)
            {
                return true
            }
            const newRow = [48, 49, 50, 51, 52, 53, 54, 55]

            //checks if the targetId is one space up for pawns
            if (newRow.includes(startId) || startId - width * 2 === targetId || startId - width === targetId) {

                var finalSpot = startId - width
                console.log(finalSpot);
                console.log(document.querySelector(`[square-id="${finalSpot}"]`));

                //checking is the finalspot contains a piece
                if (document.querySelector(`[square-id="${finalSpot}"]`).firstChild !== null 
                && document.querySelector(`[square-id="${finalSpot}"]`).firstChild.classList.contains('piece')) {
                    return false
                } 
                return true
            
            } else if (newRow.includes(startId) || startId - width - 1 === targetId || startId - width + 1 === targetId) {

                if (targetId === startId - width - 1) {
                    var finalSpot = startId - width - 1
                    console.log(finalSpot);
                    console.log(document.querySelector(`[square-id="${finalSpot}"]`));

                    //checks if a piece exists
                    if (document.querySelector(`[square-id="${finalSpot}"]`).classList.contains('piece')) {
                        takePiece(document.querySelector(`[square-id="${finalSpot}"]`))
                        return true
                    } 
                    return true;
                }

                if (targetId === startId - width + 1) {
                    var finalSpot = startId - width + 1
                    console.log(finalSpot);
                    console.log(document.querySelector(`[square-id="${finalSpot}"]`));

                    //checks if a piece exists
                    if (document.querySelector(`[square-id="${finalSpot}"]`).classList.contains('piece')) {
                        takePiece(document.querySelector('[square-id="${finalSpot}"]'))
                        return true
                    } 
                    return true;
                }

            }
            break; 
            */