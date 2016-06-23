const _ = require('lodash');
const Backtrace = require('../backtrace');

/**
 * Parses out information about each thread and includes
 * the backtrace of each thread. We also include the name
 * of the thread and where it was dispatched from (if that
 * information is available).
 *
 * @param report the JSON crash report we're working on.
 * @param [crash] a custom crash to work against.
 * @param [threads] a custom set of threads to work with.
 * @returns {Array} an array of output.
 */
function parse(report, crash, threads) {
  crash   = crash || report['crash'] || {};
  threads = threads || crash['threads'] || [];

  var rows = [];
  var idx  = 0;

  _.each(threads, function (thread) {
    if (idx++ !== 0) {
      rows.push('');
    }

    var index = thread['index'];
    var name  = thread['name'];
    var queue = thread['dispatch_queue'];

    if (name) {
      rows.push(`Thread ${index} name:  ${name}`);
    }
    else if (queue) {
      rows.push(`Thread ${index} name:  Dispatch queue: ${queue}`);
    }

    if (thread['crashed']) {
      rows.push(`Thread ${index} Crashed:`);
    } else {
      rows.push(`Thread ${index}:`);
    }

    var backtrace = thread['backtrace'];
    var trace_log = Backtrace.parse_backtrace(backtrace);

    rows = rows.concat(trace_log);
  });

  return rows;
}

/*
 Exports.
 */

exports.parse = parse;
