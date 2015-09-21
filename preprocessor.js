var ReactTools = require('react-tools');
//var to5 = require('6to5-jest').process;

module.exports = {
  process: function(src) {
      return ReactTools.transform(src);
  }
};