const guid = require('objection-guid')();
import { Model } from 'objection';
import {Subscription} from './subscription'
// DL in florida beging with one letter followed by 12 digits the nubmer is split in 5 fields ****-***-**-***-*
export class Notification extends guid(Model) {

    static get tableName() {
        return 'notifications';
      }

      static relationMappings = {
        subscription: {
          relation: Model.BelongsToOneRelation,
          modelClass: Subscription,
          join: {
            from: 'notifications.subscription_id',
            to: 'subscription.id'
          }
        }
      };

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
