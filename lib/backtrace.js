const _ = require('lodash');
const Utils = require('./util');

/**
 * Traces down a thread to provide a backtrace of actions.
 * This will output memory addresses and method names (if
 * available).
 *
 * @param backtrace the thread to go down.
 * @returns {Array} an array of output.
 */
function parse_backtrace(backtrace) {
  if (!backtrace) {
    return [];
  }

  var num = 0;
  var rows = [];
  var contents = backtrace['contents'] || [];

  _.each(contents, function (trace) {
    // addresses
    var ist_addr = trace['instruction_addr'] || 0;
    var obj_addr = trace['object_addr'] || 0;
    var sym_addr = trace['symbol_addr'] || 0;

    // names
    var obj_name =  trace['object_name'];
    var sym_name =  trace['symbol_name'];

    // padded fields
    var padded_num  = Utils.pad_right(num++, ' ', 3);
    var padded_name = Utils.pad_right(obj_name, ' ', 31);
    var padded_addr = Utils.pad_hex(ist_addr, '0', 8);

    // output fields
    var preamble = `${padded_num} ${padded_name} 0x${padded_addr}`;
    var unparsed = `0x${Utils.to_hex(obj_addr)} + ${ist_addr - obj_addr}`;

    // output without symbols
    var base_output = `${preamble} ${unparsed}`;

    // adding symbols
    if (sym_name && sym_name !== '<redacted>') {
      base_output += ` (${sym_name} + ${ist_addr - sym_addr})`;
    }

    // pushing output
    rows.push(base_output);
  });

  return rows;
}

/*
  Exports.
 */

exports.parse_backtrace = parse_backtrace;
