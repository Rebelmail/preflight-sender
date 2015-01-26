var nodemailer = require('nodemailer'),
	Random = require('meteor-random');



var transporter;

var Sender = function(config){
	if (!config.MAILGUN_USER) throw new Error('Missing MAILGUN_USER key');
	if (!config.MAILGUN_PASS) throw new Error('Missing MAILGUN_PASS key');
	if (!config.MAILGUN_DOMAIN) throw new Error('Missing MAILGUN_DOMAIN key');

	transporter = nodemailer.createTransport({
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

Sender.prototype.send = function(doc, options, cb){
	this.html = doc;

	var mailOptions = {
	    from: options.from || "postmaster@engageinbox.mailgun.org",
		bcc: options.to || this._throwError('Missing To Emails'),
		subject: options.subject || Random.id(),
		html: this.html
	};
	transporter.sendMail(mailOptions, function(error, info){
	    if (error) return cb(error, nulll);
	    return cb(null, info);
	});
};

Sender.prototype._throwError = function(error){
	throw new Error(error);
};

module.exports = Sender;