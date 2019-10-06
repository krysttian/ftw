const bookshelf = require('./bookshelf');
// DL in florida beging with one letter followed by 12 digits the nubmer is split in 5 fields ****-***-**-***-*
const EmailSubscriber = bookshelf.Model.extend({
    tableName: 'subscriber',
    uuid: true,
})

module.exports = EmailSubscriber;