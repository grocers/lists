Helpers = {
  expired: function (date) {
    return new Date().getTime() > new Date(date).getTime();
  },
  createHash: function createHash(len) {
    var hashLength = len || 16;
    var crypto = Meteor.npmRequire('crypto');

    var buffer = crypto.randomBytes(hashLength);
    return buffer.toString('hex');
  },
  resetForm: function (form) {
    $(form).trigger('reset');
  }
};
