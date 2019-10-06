const bookshelf = require('./bookshelf');

import {BaseModel} from './BaseModel';
// DL in florida beging with one letter followed by 12 digits the nubmer is split in 5 fields ****-***-**-***-*

class DriversLicense extends BaseModel {
    static get tableName() {
        return 'drivers_license'
    }
}

module.exports = DriversLicense;