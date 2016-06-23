const CPU = require('../cpu');
const Utils = require('../util');

/**
 * Parses out the CPU registers dump from the crash. This is
 * reused internally and so you can pass a custom thread to
 * work against as needed.
 *
 * @param report the JSON crash report.
 * @param [thread] an optional thread object.
 * @returns {string[]} an array of output.
 */
function parse(report, thread) {
  var rows = [''];
  var crashed = thread || Utils.get_crash_thread(report);

  if (!crashed) {
    return rows;
  }

  var index = crashed['index'];
  var sys   = report['system'] || {};
  var type  = sys['binary_cpu_type'];
  var sub   = sys['binary_cpu_subtype'];

  var arch;
  if (!type && !sub) {
    arch = sys['cpu_arch'];
  } else {
    arch = CPU.get_cpu_arch(type, sub);
  }

  var cpu = CPU.get_cpu_type(arch);

  rows.push(`Thread ${index} crashed with ${cpu} Thread State:`);

  var registers = (crashed['registers'] || {})['basic'] || {};
  var reg_order = CPU.get_registers(cpu);

  var line = '';

  for (var i = 0, j = reg_order.length; i < j; i++) {
    if (i % 4 === 0 && i !== 0) {
      rows.push(line);
      line = '';
    }

    var register      = reg_order[i];
    var register_addr = registers[register] || 0;
    var register_name = Utils.pad_left(register, ' ', 6);
    var register_loc  = Utils.pad_hex(register_addr, '0', 8);
    var register_pad  = Utils.pad_right(register_loc, ' ', 9);

    line += `${register_name}: 0x${register_pad}`;
  }

  if (line) {
    rows.push(line);
  }

  return rows;
}

/*
 Exports.
 */

exports.parse = parse;
