const guid = require('objection-guid')();
import { Model } from 'objection';

// DL in florida beging with one letter followed by 12 digits the nubmer is split in 5 fields ****-***-**-***-*
export class Notification extends guid(Model) {

    static get tableName() {
        return 'notifications';
      }

}