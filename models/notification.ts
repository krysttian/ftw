const guid = require('objection-guid')();
import { Model } from 'objection';

// DL in florida beging with one letter followed by 12 digits the nubmer is split in 5 fields ****-***-**-***-*
export class Notification extends guid(Model) {

    static get tableName() {
        return 'notifications';
      }

      readonly id!: string;
      subscriptionId: string;
      driverLicenseId: string;
      notificationRequestResponse: string;
      county: Counties;
      contactMethod: string;
      createdOn: Date;
      sentOn: Date;
      status: Date;
      modifiedOn?: Date;
}

export enum Counties {
  'MIAMI-DADE' = 'MIAMI-DADE', 'BROWARD' = 'BROWARD', 'PALM-BEACH' = 'PALM-BEACH', 'ORANGE' = 'ORANGE'
}
