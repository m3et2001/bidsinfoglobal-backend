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
export function convertRegexToString(pipeline) {
    return JSON.parse(JSON.stringify(pipeline, (key, value) => {
      if (value instanceof RegExp) {
        return value.toString(); // Converts RegExp to string
      }
      return value;
    }, 2));
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

export function convertToQueryObject(queryString) {
    // List of MongoDB comparison operators for dates
    const dateOperators = ['$gte', '$lte', '$gt', '$lt', '$eq', '$ne'];
  
    return JSON.parse(queryString, (key, value) => {
        // Handle regex patterns
        if (typeof value === 'string') {
            const regexMatch = value.match(/^\/(.*?)\/([gimsuy]*)$/);
            if (regexMatch) {
                // Convert string that looks like a regex to RegExp object
                return new RegExp(regexMatch[1], regexMatch[2]);
            }
  
            // Check if the current context should trigger date conversion
            if (dateOperators.includes(key) && value.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/)) {
                // Convert ISO 8601 date strings to JavaScript Date objects
                return new Date(value);
            }
        }
        return value;
    });
  }