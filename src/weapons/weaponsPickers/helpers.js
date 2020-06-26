
export const piecePointsMap = (
    {
        'Q': 90,
        'R': 50,
        'B': 30,
        'K': 30,
        'P': 10,
    }
)

export const weaponPointsCalc = (piecePoints, turnPoints) =>{
    return piecePoints + 10*turnPoints;
}