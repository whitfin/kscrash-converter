const cliff = require('cliff');
const moment = require('moment-timezone');

const CPU = require('../cpu');
const Errors = require('../errors');
const Utils = require('../util');

/**
 * Parses out the Utils.headers of a crash report. The  Utils.headers
 * are the bulk of the meta information at the top of a
 * crash report.
 *
 * @param report the JSON crash report.
 * @returns {string[]} an array of Utils.headers.
 */
function parse(report) {
  var sys  = report['system'] || {};
  var info = report['report'] || {};

  function _i(x) {
    return info[x] || '';
  }

  function _s(x) {
    return sys[x] || '';
  }

  var error  = report['crash']['error'];
  var thread = Utils.get_crash_thread(report);

  return [
    Utils.header('Incident Identifier:', _i('id'), 4),
    Utils.header('CrashReporter Key:'  , _s('device_app_hash'), 4),
    Utils.header('Hardware Model:'     , _s('machine'), 4),
    Utils.header('Process:'            , `${_s('process_name')} [${_s('process_id')}]`),
    Utils.header('Path:'               , _s('CFBundleExecutablePath')),
    Utils.header('Identifier:'         , _s('CFBundleIdentifier')),
    Utils.header('Version:'            , `${_s('CFBundleShortVersionString')} (${_s('CFBundleVersion')})`),
    Utils.header('Code Type:'          , get_cpu_arch(report)),
    Utils.header('Parent Process:'     , `${_s('parent_process_name')} [${_s('parent_process_id')}]`),
    Utils.header(''                    , ''),
    Utils.header('Date/Time:'          , get_time(report)),
    Utils.header('OS Version:'         , `${_s('system_name')} ${_s('system_version')} (${_s('os_version')})`),
    Utils.header('Report Version:'     , 104),
    Utils.header(''                    , '')
  ].concat(
    Errors.parse_errors(error, thread)
  );
}

/*
  Exports.
 */

exports.parse = parse;

/*
  Private functions.
 */

function get_cpu_arch(report) {
  return CPU.get_cpu_type((report['system'] || {})['cpu_arch']);
}

function get_time(report) {
  var info  = report['report'] || {};
  var sys   = report.system;
  var ts    = info.timestamp || '';
  var tz    = sys['time_zone'] || 'utc';
  var zones = moment.tz._zones;

  var zone = Object.keys(zones).find(function (key) {
    var entry = zones[key];
    if (typeof zones[key] !== 'string') {
      entry = entry.abbrs;
    }
    return !!~entry.indexOf(tz);
  });

  return moment(ts)
    .tz(zone || 'utc')
    .format('YYYY-MM-DD HH:mm:ss.000 ZZ');
}
