let initialState = {currentWeapon: {name: "", option: ""}, weaponCollection: ['REMOVE_PIECE','ADD_PIECE']};


const BonusCardsReducer = (state = initialState, action) => {

    switch (action.type) {

        case('USE_WEAPON') : {
            return Object.assign({},state, {currentWeapon: {name: action.weaponType, options: action.weaponOptions }})
        }
        default:
            return initialState;
    }
}


export default BonusCardsReducer


