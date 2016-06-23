const Utils = require('./util');

/**
 * Parses out the exception section of a Crash report.
 *
 * @param error the error object to deal with.
 * @param thread the crashed thread.
 * @returns {*[]} an array of output.
 */
function parse_errors(error, thread) {
  var signal = error['signal'];
  var mach   = error['mach'];

  var exc_name  = mach['exception_name'] || '0';
  var code_name = mach['code_name'] || '0x00000000';
  var sig_name  = signal['name'] || signal['signal'] || '0';
  var addr_name = Utils.pad_hex(error['address'] || 0, '0', 8);

  var index  = 0;

  if (thread) {
    index = thread['index'];
  }

  return [
    Utils.header('Exception Type:'     , `${exc_name} (${sig_name})`),
    Utils.header('Exception Codes:'    , `${code_name} at 0x${addr_name}`),
    Utils.header('Crashed Thread:'     , index)
  ];
}

/*
 Exports.
 */

exports.parse_errors = parse_errors;
