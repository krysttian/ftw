export interface SubscriptionType {
    id: string;
    emailAddress: string;
    phoneNumber: string;
    driverLicenseId: string;
    createdOn: Date;
    subscribedOn: Date;
    unsubscribedOn?:  Date;
    modifiedOn?: Date;
}


export interface SubscriptionRequestType {
    emailAddressClient: string;
    phoneNumberClient: string;
    driverLicenseIdClient: string;
    countyClient: string;
}

export interface DriverLicenseType {
    id: string;
    driverLicenseNumber: string;
    county: string;
    created_on: Date;
    modifiedOn?: Date;
}