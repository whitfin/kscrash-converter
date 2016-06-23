const fs = require('fs');
const path = require('path');
const should = require('should');

const Converter = require('..');

const RESOURCE_ROOT = path
  .join(__dirname, 'resources');

const examples = fs
  .readdirSync(RESOURCE_ROOT)
  .filter(function (file) {
    return file.endsWith('.json');
  })
  .map(function (file) {
    return path.join(RESOURCE_ROOT, file);
  });

describe('KSCrash Example Reports', function () {

  examples.forEach(function (example) {

    it(`Converting ${path.basename(example)}`, function () {
      var report = require(example);
      var result = fs
        .readFileSync(example.replace('.json', '.txt'))
        .toString();

      var converted = Converter
        .convert_json(report);

      var result_lines = result
        .replace(/\r/g, '')   // remove \r returns
        .split('\n')          // convert to lines
        .slice(0, -1);        // trim a trailing line

      var convert_lines = converted
        .split('\n');

      for (var i = 0, j = result_lines.length; i < j; i++) {
        should(convert_lines[i]).eql(result_lines[i]);
      }
    });

  });

});
