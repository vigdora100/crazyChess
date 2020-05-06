

export const useWeapon =(weaponType,weaponOptions)=> {

    return {
        type: "USE_WEAPON",
        weaponType: weaponType,
        weaponOptions: weaponOptions
    }

}


export const removeWeapon =(weaponType)=> {

    return {
        type: "REMOVE_WEAPON",
        weaponType: weaponType,
    }

}


