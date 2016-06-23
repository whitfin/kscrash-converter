const Converter = require('./lib/converter');

/**
 * Converts a crash file to Apple format.
 *
 * @param path the file path.
 * @returns {string} an Apple crash report.
 */
function convert_file(path) {
  return convert_json(require(path));
}

/**
 * Converts a JSON crash report to Apple format.
 *
 * @param json the JSON object.
 * @returns {string} an Apple crash report.
 */
function convert_json(json) {
  return Converter.convert(json);
}

/**
 * Converts a raw JSON string to Apple format.
 *
 * @param str the JSON string.
 * @returns {string} an Apple crash report.
 */
function convert_string(str) {
  return convert_json(JSON.parse(str));
}

/*
  Exports.
 */
exports.convert_file = convert_file;
exports.convert_json = convert_json;
exports.convert_string = convert_string;
