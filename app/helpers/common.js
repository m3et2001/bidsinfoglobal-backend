'use strict';

import { userRoles } from "./constance.js";

export const GenerateUserName = (email) => {
    try {
        var nameMatch = email.match(/^([^@]*)@/);
        var name = nameMatch ? nameMatch[1] : makeid(5);

        return name;
    } catch (error) {
        throw new Error(error);
    }
}

function makeid(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}

export const isSuperAdmin = async (session) => {
    try {
        if (session?.role && session?.role === userRoles.SUPER_ADMIN)
            return true;
        else
            return false;

    } catch (error) {
        throw new Error(error);
    }
}
export function zeroPad(num, places) {
    var zero = places - num.toString().length + 1;
    return Array(+(zero > 0 && zero)).join("0") + num;
}