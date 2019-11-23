export interface SubscriptionType {
    id: string;
    emailAddress: string;
    phoneNumber: string;
    driversLicenseId: string;
    createdOn: Date;
    subscribedOn: Date;
    unsubscribedOn?:  Date;
    modifiedOn?: Date;
}


export interface SubscriptionRequestType {
    emailAddressClient: string;
    phoneNumberClient: string;
    driversLicenseIdClient: string;
    dobClient?: string;
    countyClient: string;
}

export interface DriversLicenseType {
    id: string;
    dob: string;
    driversLicenseNumber: string;
    county: string;
    created_on: Date;
    modifiedOn?: Date;
}