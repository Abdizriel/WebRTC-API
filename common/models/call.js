'use strict';

var OpenTok = require('opentok'),
opentok = new OpenTok(process.env.opentok_key, process.env.opentok_secret);

module.exports = function (Call) {

  Call.new= function (req, res, cb) {
    opentok.createSession(function(err, session) {
        if (err) {
            cb(err);
        }
      // save the sessionId
      var data = {
        'status':'Incoming',
        'caller_id':1,
        'token':opentok.generateToken(session.sessionId)
      };
      Call.updateOrCreate(data, function (err, list) {
        cb(null, data);
      });
    });
  };

  Call.remoteMethod('new', {
    http: {path: '/new', verb: 'get'},
    accepts: [
     {arg: 'req', type: 'object', 'http': {source: 'req'}},
     {arg: 'res', type: 'object', 'http': {source: 'res'}}
    ],
    returns: {arg:'call',type:'object'}
  });

};
