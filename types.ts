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

export enum Counties {
    'ALACHUA' = 'ALACHUA', 'BAKER' = 'BAKER', 'BAY' = 'BAY', 'BRADFORD' = 'BRADFORD', 'BREVARD' = 'BREVARD', 'BROWARD' = 'BROWARD', 'CALHOUN' = 'CALHOUN', 'CHARLOTTE' = 'CHARLOTTE', 'CITRUS' = 'CITRUS', 'CLAY' = 'CLAY', 'COLLIER' = 'COLLIER', 'COLUMBIA' = 'COLUMBIA', 'DE SOTO' = 'DE SOTO', 'DIXIE' = 'DIXIE', 'DUVAL' = 'DUVAL', 'ESCAMBIA' = 'ESCAMBIA', 'FLAGLER' = 'FLAGLER', 'FRANKLIN' = 'FRANKLIN', 'GADSDEN' = 'GADSDEN', 'GILCHRIST' = 'GILCHRIST', 'GLADES' = 'GLADES', 'GULF' = 'GULF', 'HAMILTON' = 'HAMILTON', 'HARDEE' = 'HARDEE', 'HENDRY' = 'HENDRY', 'HERNANDO' = 'HERNANDO', 'HIGHLANDS' = 'HIGHLANDS', 'HILLSBOROUGH' = 'HILLSBOROUGH', 'HOLMES' = 'HOLMES', 'INDIAN RIVER' = 'INDIAN RIVER', 'JACKSON' = 'JACKSON', 'JEFFERSON' = 'JEFFERSON', 'LAFAYETTE' = 'LAFAYETTE', 'LAKE' = 'LAKE', 'LEE' = 'LEE', 'LEON' = 'LEON', 'LEVY' = 'LEVY', 'LIBERTY' = 'LIBERTY', 'MADISON' = 'MADISON', 'MANATEE' = 'MANATEE', 'MARION' = 'MARION', 'MARTIN' = 'MARTIN', 'MIAMI-DADE' = 'MIAMI-DADE', 'MONROE' = 'MONROE', 'NASSAU' = 'NASSAU', 'OKALOOSA' = 'OKALOOSA', 'OKEECHOBEE' = 'OKEECHOBEE', 'ORANGE' = 'ORANGE', 'OSCEOLA' = 'OSCEOLA', 'PALM BEACH' = 'PALM BEACH', 'PASCO' = 'PASCO', 'PINELLAS' = 'PINELLAS', 'POLK' = 'POLK', 'PUTNAM' = 'PUTNAM', 'ST. JOHNS' = 'ST. JOHNS', 'ST. LUCIE' = 'ST. LUCIE', 'SANTA ROSA' = 'SANTA ROSA', 'SARASOTA' = 'SARASOTA', 'SEMINOLE' = 'SEMINOLE', 'SUMTER' = 'SUMTER', 'SUWANNEE' = 'SUWANNEE', 'TAYLOR' = 'TAYLOR', 'UNION' = 'UNION', 'VOLUSIA' = 'VOLUSIA', 'WAKULLA' = 'WAKULLA', 'WALTON' = 'WALTON', 'WASHINGTON' = 'WASHINGTON'
  }