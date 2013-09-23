'use strict';
var _  = require('lodash');
var svg2ttf = require('svg2ttf');

function base64encode(str) {
  var b64chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefg'+
    'hijklmnopqrstuvwxyz0123456789+/=';
  var b64encoded = '';
  var chr1, chr2, chr3;
  var enc1, enc2, enc3, enc4;

  for (var i=0; i<str.length;) {
    chr1 = str.charCodeAt(i++);
    chr2 = str.charCodeAt(i++);
    chr3 = str.charCodeAt(i++);

    enc1 = chr1 >> 2;
    enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);

    enc3 = isNaN(chr2) ? 64:(((chr2 & 15) << 2) | (chr3 >> 6));
    enc4 = isNaN(chr3) ? 64:(chr3 & 63);

    b64encoded += b64chars.charAt(enc1) + b64chars.charAt(enc2) +
      b64chars.charAt(enc3) + b64chars.charAt(enc4);
  }
  return b64encoded;
}

module.exports = function(svg, fontId) {
  if (!svg) return;

  var cfg = {
    svgDataUri : 'data:image/svg+xml,' + encodeURIComponent(svg),
    ttfDataUri : 'data:image/truetype;base64,' + encodeURIComponent(base64encode(svg2ttf(svg, {}).buffer)),
    fontId : fontId
  };

  var list =
  '  @font-face {\n' +
  '    font-family: "fml_customFont";\n' +
  '    src: url("${ttfDataUri}") format("truetype");\n' +
  '    src: url("${svgDataUri}") format("svg");\n' +
  '    font-weight: normal;\n' +
  '    font-style: normal;\n' +
  '  }\n';
  return _.template(list, cfg);
};