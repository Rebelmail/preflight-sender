var nodemailer = require('nodemailer'),
	Random = require('meteor-random');

function checkEnv(){
	if (!process || !process.env || !process.env.MAILGUN_USER || !process.env.MAILGUN_PASS || !process.env.MAILGUN_DOMAIN){
		return false
	} else {
		return true
	}
};

if (!checkEnv()){
	var dotenv = require('dotenv');
	dotenv._getKeysAndValuesFromEnvFilePath(__dirname + '/.env');
	dotenv._setEnvs();
	if (!checkEnv()) throw new Error('Missing required enviornment variables!');
};

var transporter = nodemailer.createTransport({
   service: "Mailgun",
   auth: {
     user: process.env.MAILGUN_USER,
     pass: process.env.MAILGUN_PASS,
     domain:process.env.MAILGUN_DOMAIN
   }
});

var Sender = function(){
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

module.exports = new Sender();