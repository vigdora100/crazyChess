

export const useWeapon =(weaponType,weaponOptions)=> {

    return {
        type: "USE_WEAPON",
        weaponType: weaponType,
        weaponOptions: weaponOptions
    }

}