declare module NodeJS {
  interface Global {
    myModule:any;
  }
}
global.myModule = (function() {
  let service:any = {};

  service.init = function() {
    console.log('I initialized');
    let java = require('java');
    java.newInstance("java.util.ArrayList", function(err:any, list:any) {
      list.addSync("item1");
      list.addSync("item2");
      console.log(list.toStringSync()); // [item1, item2]
    });
  };

  return service;
})();