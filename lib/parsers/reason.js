const Utils = require('../util');

/**
 * Parses out the reason for why the error occurred. We take
 * this from the error sub-object, unless a user exception is
 * provided and if so we use that.
 *
 * @param report the JSON crash report.
 * @returns {string[]} an array of output.
 */
function parse(report) {
  var rows = [''];

  var crash  = report['crash'] || {};
  var error  = crash['error'];
  var type   = error['type'];
  var reason = error['reason'];

  var user_exception = error['user_reported'];
  var ns_exception   = error['nsexception'];

  if (ns_exception) {
    rows.push(format(ns_exception));
    rows.push('');
    return rows;
  }

  if (zombie_exception(report)) {
    var last_exception = Utils
      .get_last_exception(report);

    if (last_exception) {
      rows.push(format(last_exception, reason));
      rows.push('NOTE: This exception has been deallocated! ' +
        'Stack trace is crash from attempting to access this zombie exception.');
      rows.push('');
    }

    return rows;
  }

  if (user_exception) {
    rows.push(format(user_exception, reason));

    var line = user_exception['line_of_code'];
    var back = user_exception['backtrace'] || [];

    if (line || back) {
      rows.push('Custom Backtrace:');
    }

    if (line) {
      rows.push(`Line: ${line}`);
    }

    return rows.concat(back);
  }

  if (type == 'cpp_exception') {
    return rows.concat(format(error['cppexception'], reason));
  }

  if (type == 'deadlock') {
    rows.push('Application main thread deadlocked');
    rows.push('');
  }

  return rows;
}

/*
 Exports.
 */

exports.parse = parse;

/*
 Private functions.
 */

function format(exception, reason) {
  return `Application Specific Information:
*** Terminating app due to uncaught exception '${exception['name']}', reason: '${reason || exception['reason']}'`;
}

function zombie_exception(report) {
  var crash  = report['crash'] || {};
  var error  = crash['error'];
  var mach   = error['mach'];

  var exc_name = mach['exception_name'] || '0';
  var code_name = mach['code_name'] || '0x00000000';

  if (exc_name !== 'EXC_BAD_ACCESS' || code_name !== 'KERN_INVALID_ADDRESS') {
    return false;
  }

  return !!Utils.get_last_exception(report);
}
