const Parsers = require('./parsers');

/**
 * Converts an input JSON report to an Apple style crash
 * report using the internal parses in sequence.
 *
 * @param report the JSON report.
 * @returns {string} an Apple style report.
 */
function convert(report) {
  return []
    .concat(
      Parsers.parse('headers', report),
      Parsers.parse('reason',  report),
      Parsers.parse('threads', report),
      Parsers.parse('cpu',     report),
      Parsers.parse('images',  report),
      Parsers.parse('extras',  report)
    )
    .join('\n')
}

/*
 Exports.
 */

exports.convert = convert;
