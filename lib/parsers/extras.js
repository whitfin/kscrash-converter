const Errors = require('../errors');
const Utils = require('../util');

const cpu = require('./cpu');
const threads = require('./threads');

/**
 * Parses out the extra information available against the
 * crash. this includes any referenced objects, application
 * statistics and diagnoses.
 *
 * @param report the JSON crash report.
 * @returns {string[]} an array of output.
 */
function parse(report) {
  var system = report['system'] || {};
  var crash  = report['crash'] || {};

  return [ '', 'Extra Information:' ].concat(
    parse_nsexception(crash),
    parse_crash_thread(report),
    parse_last_exception(report),
    parse_diagnosis(crash),
    parse_recrash(report)
  );
}

/*
  Exports.
 */

exports.parse = parse;

/*
  Private functions.
 */

function dump_json(obj) {
  return JSON.stringify(obj, null, 4);
}

function parse_nsexception(crash) {
  var rows = [];
  var nexc = crash['error']['nsexception'];

  if (nexc && nexc['referenced_object']) {
    rows.push('Object referenced by NSException:');
    rows.push(dump_json(nexc['referenced_object']));
  }

  return rows;
}

function parse_crash_thread(report) {
  var crashed = Utils.get_crash_thread(report);

  if (!crashed) {
    return [];
  }

  var rows  = [];
  var stack = crashed['stack'];
  var naddr = crashed['notable_addresses'];

  if (stack) {
    var start = Utils.pad_hex(stack['dump_start'], '0', 8);
    var end   = Utils.pad_hex(stack['dump_end'], '0', 8);

    rows.push('');
    rows.push(`Stack Dump (0x${start}-0x${end}):`);
    rows.push('');
    rows.push(stack['contents'] || '(null)');
  }

  if (naddr) {
    rows.push('');
    rows.push('Notable Addresses:');
    rows.push(dump_json(naddr));
  }

  return rows;
}

function parse_last_exception(report) {
  var last_exception = Utils.get_last_exception(report);

  if (!last_exception) {
    return [];
  }

  var rows   = [];
  var addr   = last_exception['address'];
  var name   = last_exception['name'];
  var reason = last_exception['reason'];
  var paddr  = Utils.pad_hex(addr, '0', 8);

  rows.push('');
  rows.push(`Last deallocated NSException (0x${paddr}): ${name}: ${reason}`);

  if (last_exception['referenced_object']) {
    rows.push('Referenced object:');
    rows.push(dump_json(last_exception['referenced_object']));
  }

  return rows;
}

function parse_diagnosis(crash) {
  var diagnosis = crash['diagnosis'];

  return diagnosis
    ? [ '', `${crash['crashed_thread'] ? 'Recrash' : 'CrashDoctor'} Diagnosis: ${diagnosis}` ]
    : [ ];
}

function parse_recrash(report) {
  var recrash = report['recrash_report'];

  if (!recrash) {
    return [];
  }

  var rows = [
    '',
    'Handler crashed while reporting:',
    ''
  ];

  var crash  = recrash['crash'];
  var error  = crash['error'];
  var thread = crash['crashed_thread'];

  var error_report  = Errors.parse_errors(error, thread);
  var thread_report = threads.parse(report, recrash, [ thread ]);
  var cpu_report    = cpu.parse(report, thread);
  var diagnosis_rep = parse_diagnosis(crash);

  return rows.concat(
    error_report,
    '',
    thread_report,
    cpu_report,
    diagnosis_rep
  );
}
