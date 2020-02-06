export interface Subscription {
    // id: string;
    // emailAddress: string;
    // phoneNumber: string;
    // caseNumber: string;
    // actionCode: string;
    // actionDescription: string;
    // amountDue:  string;
    // issueDate: string;
    // violationCode: string;
    // violationDescription: string;
    // table.uuid('id').primary();
    // table.string('email_address').notNullable().comment('This is the email field');
    // table.string('phone_number').notNullable().comment('This is the phone number field');
    // table.uuid('drivers_license_id').notNullable().unsigned();
    // table.foreign('drivers_license_id').references('drivers_license.id').onDelete('CASCADE');
    // table.timestamp('created_on').defaultTo(knex.fn.now());
    // table.timestamp('subscribed_on').defaultTo(knex.fn.now());
    // table.timestamp('unsubscribed_on');
    // table.timestamp('modified_on');
}


export interface SubscriptionRequest {
    emailAddressClient: string;
    phoneNumberClient: string;
    driversLicenseIdClient: string;
    countyClient: string;
}