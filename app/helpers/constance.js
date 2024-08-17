export const BASE_URL = "https://api.bidsinfoglobal.com/";

export const ADMIN_EMAIL = [
    {
        email_address: {
            address: "kp848309@gmail.com",
            name: "Ketan Parmar",
        },
        email_address: {
            address: "bidsinfoglobal@gmail.com",
            name: "Bidsinfoglobal",
        },
    }
]

export const customerStatus = {
    INACTIVE: "inactive",
    ACTIVE: 'active',
    BLOCKED: "blocked"
}

export const userRoles = {
    CUSTOMERS: "customers",
    IT_SUPPORT: "it",
    SUPER_ADMIN: "super_admin",
    SALES: "sales",
    CONTENT_DEPARTMENT: "content_department",
}

export const searchType = {
    ANY: "Any Word",
    EXACT: "Exact Phrase",
    RELEVENT: "Relevent Word"
}

export const mailSubject = {
    tendersToCustomer: "Bidsinfoglobal Tenders and RFPs"
}

export const subscribePlanReq = {
    REQUESTED: "Requested",
    PROCESSED: "Processed",
}

export const startingBigRefNo = 1001;

export const roleArray = [userRoles.ADMIN, userRoles.CUSTOMERS, userRoles.SUPER_ADMIN]