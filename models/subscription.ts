const guid = require('objection-guid')();
import { Model } from 'objection';

// DL in florida beging with one letter followed by 12 digits the nubmer is split in 5 fields ****-***-**-***-*
export class Subscription extends guid(Model) {

    static get tableName() {
        return 'subscription';
      }
      readonly id!: string;
      emailAddress: string;
      phoneNumber: string;
      driverLicenseId: string;
      county: Counties;
      createdOn: Date;
      subscribedOn: Date;
      unsubscribedOn?: Date;
      modifiedOn?: Date;

}

export enum Counties {
  'MIAMI-DADE' = 'MIAMI-DADE', 'BROWARD' = 'BROWARD', 'PALM-BEACH' = 'PALM-BEACH', 'ORANGE' = 'ORANGE'
}
