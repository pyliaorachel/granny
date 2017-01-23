/*
  Converting hex color value to RGB representation.

  Sample Input:
    #ffffff (or #fff)
  Sample Output:
    {
      'r': 255,
      'g': 255,
      'b': 255
    }

  reference: http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
*/
const hexToRgb = (hex) => {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        'r': parseInt(result[1], 16),
        'g': parseInt(result[2], 16),
        'b': parseInt(result[3], 16)
    } : null;
}

module.exports = {
  hexToRgb,
};