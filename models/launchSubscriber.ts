const guid = require('objection-guid')();
import { Model } from 'objection';

// DL in florida beging with one letter followed by 12 digits the nubmer is split in 5 fields ****-***-**-***-*
export class LaunchSubscriber extends guid(Model) {

    static get tableName() {
        return 'launchSubscriber';
      }

    readonly id!: string;
    emailAddress: string;
    county: Counties;
    subscribedOn?: Date;
    unsubscribedOn?: Date;
    modifiedOn?: Date;

}

export enum Counties {
  'MIAMI-DADE' = 'MIAMI-DADE', 'BROWARD' = 'BROWARD', 'PALM-BEACH' = 'PALM-BEACH', 'ORANGE' = 'ORANGE'
}