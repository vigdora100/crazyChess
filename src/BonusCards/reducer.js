let initialState = {bonusCard: ''};


const BonusCardsReducer = (state = initialState, action) => {

    switch (action.type) {

        case('REMOVE_PIECE') : {
            return Object.assign({},state, {bonusCard: 'remove_piece'})
        }
        default:
            return initialState;
    }
}


export default BonusCardsReducer


