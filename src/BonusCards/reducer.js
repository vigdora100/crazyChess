let initialState = {currentWeapon: '', weaponCollection: ['REMOVE_PIECE','ADD_PIECE']};


const BonusCardsReducer = (state = initialState, action) => {

    switch (action.type) {

        case('USE_WEAPON') : {
            return Object.assign({},state, {currentWeapon: action.weaponType})
        }
        default:
            return initialState;
    }
}


export default BonusCardsReducer


