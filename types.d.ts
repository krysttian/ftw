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
    countyClient: string;
}

export interface DriverLicenseType {
    id: string;
    driversLicenseNumber: string;
    county: string;
    created_on: Date;
    modifiedOn?: Date;
}