/**
 * Finds a crashed thread by iterating all threads and checking
 * whether they've crashed. If they have we short circuit and
 * return the thread. Otherwise we return the crashed_thread entry.
 *
 * @param report the JSON report structure.
 * @returns {*} the entry of the crashed thread.
 */
function get_crash_thread(report) {
  var crash   = report['crash'] || {};
  var threads = crash['threads'] || [];

  var thread = threads.find(function (thread) {
    return !!thread['crashed'];
  });

  return thread || crash['crashed_thread'];
}

/**
 * Retrieves the last exception if there is one.
 *
 * @param report the JSON report structure.
 * @returns {*} the last exception entry.
 */
function get_last_exception(report) {
  var process = report['process'];

  if (!process) {
    return undefined;
  }

  return process['last_dealloced_nsexception'];
}

function header(left, right, extra) {
  if (!left) {
    return left;
  }
  var amount = 16 + (extra || 0);
  var padded_left = pad_right(left, ' ', amount);
  return `${padded_left} ${right}`;
}

/**
 * Pads a provided number to the left, converting it to a Hex
 * format before the padding.
 *
 * @param input the input to pad.
 * @param char the char to pad with.
 * @param count the length of the String.
 */
function pad_hex(input, char, count) {
  return pad_left(to_hex(input), char, count);
}

/**
 * Pads a given input to a provided number of characters
 * using the provided char. This will right justify the input.
 *
 * @param input the input to pad.
 * @param char the char to pad with.
 * @param count the length of the String.
 */
function pad_left(input, char, count) {
  return pad(input, char, count, 'left');
}

/**
 * Pads a given input to a provided number of characters
 * using the provided char. This will left justify the input.
 *
 * @param input the input to pad.
 * @param char the char to pad with.
 * @param count the length of the String.
 */
function pad_right(input, char, count) {
  return pad(input, char, count, 'right');
}

/**
 * Converts a given number to a Hex String.
 *
 * @param number the number to convert.
 * @returns {String} a Hex String.
 */
function to_hex(number) {
  return number.toString(16);
}

/*
 Exports.
 */

exports.get_crash_thread = get_crash_thread;
exports.get_last_exception = get_last_exception;
exports.header = header;
exports.pad_hex = pad_hex;
exports.pad_left = pad_left;
exports.pad_right = pad_right;
exports.to_hex = to_hex;

/*
  Private functions.
 */

function pad(input, char, count, direction) {
  var ipt = '' + (input);
  var rem = count - ipt.length;
  if (rem < 1) {
    return ipt;
  }
  var padding = char.repeat(count - ipt.length);
  return direction === 'left' ? padding + ipt : ipt + padding;
}
