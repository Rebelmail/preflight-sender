var nodemailer = require('nodemailer');
var	Random = require('meteor-random');

var Sender = function(config){

  if (!config.MAILGUN_USER) throw new Error('Missing MAILGUN_USER key');
  if (!config.MAILGUN_PASS) throw new Error('Missing MAILGUN_PASS key');
  if (!config.MAILGUN_DOMAIN) throw new Error('Missing MAILGUN_DOMAIN key');

  this.transporter = nodemailer.createTransport({
    service: "Mailgun",
    auth: {
      user: config.MAILGUN_USER,
      pass: config.MAILGUN_PASS,
      domain: config.MAILGUN_DOMAIN
    }
  });

  this.config = config;
  return this;
};

Sender.prototype.run = function(html, cb) {
  return this.send(html, cb);
};


Sender.prototype.send = function(doc, cb) {
  if (!this.config.to) {
    return cb(new Error('missing destination emails'), null);
  }
  var mailOptions = {
    from: this.config.from || "postmaster@engageinbox.mailgun.org",
    bcc: this.config.to,
    subject: this.subject || Random.id(),
    html: doc
  };
  this.transporter.sendMail(mailOptions, function(err, info){
    if (err) return cb(err, null);
    return cb(null, doc);
  });
};

module.exports = Sender;
