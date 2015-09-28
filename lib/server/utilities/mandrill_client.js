var Mandrill        = Meteor.npmRequire('mandrill-api/mandrill');

MandrillMailer = {
  send: function send(options, callback) {
    //Helper Functions
    function createMessage(options) {
      options = options || {};
      var message = {};

      if (!!Object.keys(options)) { // Options passeed
        if ('to' in options && 'subject' in options) { // to and subject options need to be specified
          options.merge = options.merge || false;
          options.merge_vars = (options.merge) ? ((options.merge_vars) ? options.merge_vars : []) : []; // Default to empty array if no merge vars were passed (and merge was set to true)
          options.to = (options.to instanceof Array) ? options.to : [options.to];
          options.tags = options.tags || [];

          // Create the Mandrill message object
          message = {
            "subject": options.subject,
            "from_email": "admin@grocers.com.gh",
            "from_name": "Grocers Support",
            "to": options.to,
            "headers": {
              "Reply-To": "admin@grocers.com.gh"
            },
            "important": false,
            "track_opens": true,
            "track_clicks": true,
            "inline_css": true,
            "url_strip_qs": false,
            "preserve_recipients": false,
            "view_content_link": true,
            "merge": options.merge,
            "merge_vars": options.merge_vars,
            "tags": options.tags
          };
        } else {
          message = null;
        }
      } else {
        message = null;
      }
      return message;
    }

    function prepareMergeVars(varNames, recipient) {
      var mergeVars = [],
        mergeVar = {};

      mergeVar.rcpt = recipient.email;
      mergeVar.vars = [];

      varNames.forEach(function (varName) {
        mergeVar.vars.push({
          name: varName,
          content: recipient[varName]
        });
      });

      mergeVars.push(mergeVar);
      return mergeVars;
    } // End of helpers

    // Continue
    if (!options.recipient) return callback(new Error('Recipient information missing'));
    var sendOptions = {
      to: [{
        name: options.recipient.name,
        email: options.recipient.email
      }],
      subject: options.subject,
      merge: !!options.merge,
      merge_vars: prepareMergeVars((options.merge_vars || []), options.recipient)
    };

    // var MandrillClient  = new Mandrill.Mandrill(process.env.MANDRILL_API_KEY || require('../.env.json').MANDRILL_API_KEY),
    var MandrillClient  = new Mandrill.Mandrill("MAuLRixIZLpqSAPY62zxOw"),
      message = createMessage(sendOptions),
      async = false,
      ip_pool = "Main Pool";

    console.log('Sending email to ' + options.recipient.name);
    if (options.template) { // Send template
      var template_name = options.template,
        template_content = [];

      MandrillClient.messages.sendTemplate({"template_name": template_name, "template_content": template_content, "message": message, "async": async, "ip_pool": ip_pool}, function(result) {
        console.log(result[0]);
        callback(null, result[0]);
      }, function(e) {
        console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
        callback(e);
      });
    } else { // Send plain text/html
      message.html = '<p>' + options.text + '<p>';
      MandrillClient.messages.send({"message": message, "async": async, "ip_pool": ip_pool}, function(result) {
        console.log(result[0]);
        callback(null, result[0]);
      }, function(e) {
        console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
        callback(e);
      });
    }
  }
};

