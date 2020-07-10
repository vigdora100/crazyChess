
export const opponentColor = (color) => {
     let opponentColor = color == 'w' ? 'b' : 'w'
     return opponentColor;
}

export const opponentPlayerNumber = (playerNumber) => {
     let opponentNumber = playerNumber == 'p1' ? 'p2' : 'p1'
     return opponentNumber;
}