
export const addWeapon =(weaponType,weaponOptions)=> {

    return {
        type: "ADD_WEAPON",
        weaponType: weaponType,
        weaponOptions: weaponOptions
    }

}

export const removeWeapon =(index)=> {

    return {
        type: "REMOVE_WEAPON",
        weaponIndex: index
    }

}


