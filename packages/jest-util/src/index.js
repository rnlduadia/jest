/**
 * Copyright (c) 2014, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @flow
 */

'use strict';

const Console = require('./Console');
const FakeTimers = require('./FakeTimers');
const JasmineFormatter = require('./JasmineFormatter');
const NullConsole = require('./NullConsole');

const {
  formatExecError,
  formatResultsErrors,
  formatStackTrace,
} = require('./messages');
const clearLine = require('./clearLine');
const fileExists = require('jest-file-exists');
const installCommonGlobals = require('./installCommonGlobals');
const mkdirp = require('mkdirp');
const path = require('path');
const separateMessageFromStack = require('./separateMessageFromStack');

const escapePathForRegex = (dir: string) => {
  if (path.sep === '\\') {
    // Replace "\" with "/" so it's not escaped by escapeStrForRegex.
    // replacePathSepForRegex will convert it back.
    dir = dir.replace(/\\/g, '/');
  }
  return replacePathSepForRegex(escapeStrForRegex(dir));
};

const escapeStrForRegex =
  (string: string) => string.replace(/[[\]{}()*+?.,\\^$|#\s]/g, '\\$&');

const replacePathSepForRegex = (string: string) => {
  if (path.sep === '\\') {
    return string.replace(/(\/|\\(?!\.))/g, '\\\\');
  }
  return string;
};

const createDirectory = (path: string) => {
  try {
    mkdirp.sync(path, '777');
  } catch (e) {
    if (e.code !== 'EEXIST') {
      throw e;
    }
  }
};

const getPackageRoot = () => {
  const cwd = process.cwd();

  // Is the cwd somewhere within an npm package?
  let root = cwd;
  while (!fileExists(path.join(root, 'package.json'))) {
    if (root === '/' || root.match(/^[A-Z]:\\/)) {
      root = cwd;
      break;
    }
    root = path.resolve(root, '..');
  }

  return root;
};

const warnAboutUnrecognizedOptions  = (argv: Object, options: Object) => {
  const yargsSpecialOptions = ['$0', '_', 'help'];
  const allowedOptions = Object.keys(options).reduce((acc, option) => (
    acc
      .add(option)
      .add(options[option].alias)
  ), new Set(yargsSpecialOptions));
  const unrecognizedOptions = Object.keys(argv).filter(arg => (
    !allowedOptions.has(arg)
  ));
  if (unrecognizedOptions.length) {
    console.warn('Unrecognized options: ' + unrecognizedOptions.join(', '));
  }
};

module.exports = {
  Console,
  FakeTimers,
  JasmineFormatter,
  NullConsole,
  clearLine,
  createDirectory,
  escapePathForRegex,
  escapeStrForRegex,
  formatStackTrace,
  formatResultsErrors,
  formatExecError,
  getPackageRoot,
  installCommonGlobals,
  replacePathSepForRegex,
  separateMessageFromStack,
  warnAboutUnrecognizedOptions,
};
