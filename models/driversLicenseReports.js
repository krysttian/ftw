const bookshelf = require('./bookshelf');
// DL in florida beging with one letter followed by 12 digits the nubmer is split in 5 fields ****-***-**-***-*
const DriversLicenseReports = bookshelf.Model.extend({
    tableName: 'drivers_license_report',
    uuid: true,
})

module.exports = DriversLicenseReports;