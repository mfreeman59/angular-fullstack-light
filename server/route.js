'use strict';

//
// エラー処理をどこかしらのタイミングで実装
//

module.exports = function(app) {
  app.use('/api/girls', require('./api/girls'));

  // app.route('/:url(api|auth|components|app|bower_components|assets)/*')
  //   .get(error[404]);
  
  app.route('/*')
    .get(function(req, res) {
      res.sendfile(app.get('appPath') + '/index.html');
    });
};



