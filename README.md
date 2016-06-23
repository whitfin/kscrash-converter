# KSCrash Converter

This module provides a small tool for converting [KSCrash](https://github.com/kstenerud/KSCrash) JSON crash reports for iOS to the Apple Crash Format described [here](https://developer.apple.com/library/ios/technotes/tn2151/_index.html).

### Setup

You can grab this module from npm easily:

```
$ npm install kscrash-converter
```

### Usage

The API is very small as the scope of the module is pretty straightforward:

```javascript
var Converter = require('kscrash-converter');

// convert a JSON file
Converter.convert_file('../crash.json');

// convert a JSON object
Converter.convert_json(my_json_crash_obj);

// convert a JSON string
Converter.convert_string(my_raw_json_string);
```

These three functions should provide all you need to get going.

### Testing

Inside the `test/resources` directory you'll find a number of example JSON/Apple crash reports (taken from the KSCrash repo). All JSON crashes will translate to their corresponding Apple crash format in the test suites (again in the `test/` repo). Assuming all of these tests pass, this tool will be deemed fully functional. The intent is to keep full compatibility with the reports from KSCrash.

There is also a small file in `bin/` named `cli` which will accept a single filename as first argument to the script, parse it, and then spit out the converted crash to stdout. This is just for convenience when testing and shouldn't really be used for anything beyond that.
