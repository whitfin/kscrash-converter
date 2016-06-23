const parsers = {
  cpu: require('./parsers/cpu'),
  extras: require('./parsers/extras'),
  headers: require('./parsers/headers'),
  images: require('./parsers/images'),
  reason: require('./parsers/reason'),
  threads: require('./parsers/threads')
};

/**
 * Parses a provided report using the provided parser.
 * We fail safely (returning no output) to avoid crashing.
 *
 * @param parser the parser to work with.
 * @param report the input report.
 * @returns {*} a list of output.
 */
function parse(parser, report) {
  if (parsers[parser]) {
    return parsers[parser].parse(report);
  }
  return [];
}

/*
 Exports.
 */

exports.parse = parse;
