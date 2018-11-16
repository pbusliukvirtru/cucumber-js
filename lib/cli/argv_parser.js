'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _commander = require('commander');

var _package = require('../../package.json');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _gherkin = require('gherkin');

var _gherkin2 = _interopRequireDefault(_gherkin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ArgvParser = function () {
  function ArgvParser() {
    (0, _classCallCheck3.default)(this, ArgvParser);
  }

  (0, _createClass3.default)(ArgvParser, null, [{
    key: 'collect',
    value: function collect(val, memo) {
      memo.push(val);
      return memo;
    }
  }, {
    key: 'mergeJson',
    value: function mergeJson(option) {
      return function (str, memo) {
        var val = void 0;
        try {
          val = JSON.parse(str);
        } catch (error) {
          throw new Error(option + ' passed invalid JSON: ' + error.message + ': ' + str);
        }
        if (!_lodash2.default.isPlainObject(val)) {
          throw new Error(option + ' must be passed JSON of an object: ' + str);
        }
        return _lodash2.default.merge(memo, val);
      };
    }
  }, {
    key: 'mergeTags',
    value: function mergeTags(val, memo) {
      return memo === '' ? '(' + val + ')' : memo + ' and (' + val + ')';
    }
  }, {
    key: 'validateCountOption',
    value: function validateCountOption(val, optionName) {
      val = parseInt(val);
      if (isNaN(val) || val < 0) {
        throw new Error(optionName + ' must be a non negative integer');
      }
      return val;
    }
  }, {
    key: 'validateLanguage',
    value: function validateLanguage(val) {
      if (!_lodash2.default.includes(_lodash2.default.keys(_gherkin2.default.DIALECTS), val)) {
        throw new Error('Unsupported ISO 639-1: ' + val);
      }
      return val;
    }
  }, {
    key: 'validateRetryOptions',
    value: function validateRetryOptions(options) {
      if (options.retryTagFilter && !options.retry) {
        throw new Error('a positive --retry count must be specified when setting --retryTagFilter');
      }
    }
  }, {
    key: 'parse',
    value: function parse(argv) {
      var program = new _commander.Command(_path2.default.basename(argv[1]));

      program.usage('[options] [<GLOB|DIR|FILE[:LINE]>...]').version(_package.version, '-v, --version').option('-b, --backtrace', 'show full backtrace for errors').option('-d, --dry-run', 'invoke formatters without executing steps').option('--exit', 'force shutdown of the event loop when the test run has finished: cucumber will call process.exit').option('--fail-fast', 'abort the run on first failure').option('-f, --format <TYPE[:PATH]>', 'specify the output format, optionally supply PATH to redirect formatter output (repeatable)', ArgvParser.collect, []).option('--format-options <JSON>', 'provide options for formatters (repeatable)', ArgvParser.mergeJson('--format-options'), {}).option('--i18n-keywords <ISO 639-1>', 'list language keywords', ArgvParser.validateLanguage, '').option('--i18n-languages', 'list languages').option('--language <ISO 639-1>', 'provide the default language for feature files', '').option('--name <REGEXP>', 'only execute the scenarios with name matching the expression (repeatable)', ArgvParser.collect, []).option('--no-strict', 'succeed even if there are pending steps').option('--order <TYPE[:SEED]>', 'run scenarios in the specified order. Type should be `defined` or `random`', 'defined').option('-p, --profile <NAME>', 'specify the profile to use (repeatable)', ArgvParser.collect, []).option('--parallel <NUMBER_OF_SLAVES>', 'run in parallel with the given number of slaves', function (val) {
        return ArgvParser.validateCountOption(val, '--parallel');
      }, 0).option('-r, --require <GLOB|DIR|FILE>', 'require files before executing features (repeatable)', ArgvParser.collect, []).option('--require-module <NODE_MODULE>', 'require node modules before requiring files (repeatable)', ArgvParser.collect, []).option('--retry <NUMBER_OF_RETRIES>', 'specify the number of times to retry failing test cases (default: 0)', function (val) {
        return ArgvParser.validateCountOption(val, '--retry');
      }, 0).option('--retryTagFilter <EXPRESSION>', 'only retries the features or scenarios with tags matching the expression (repeatable).\n        This option requires \'--retry\' to be specified.', ArgvParser.mergeTags, '').option('-t, --tags <EXPRESSION>', 'only execute the features or scenarios with tags matching the expression (repeatable)', ArgvParser.mergeTags, '').option('--world-parameters <JSON>', 'provide parameters that will be passed to the world constructor (repeatable)', ArgvParser.mergeJson('--world-parameters'), {});

      program.on('--help', function () {
        /* eslint-disable no-console */
        console.log('  For more details please visit https://github.com/cucumber/cucumber-js#cli\n');
        /* eslint-enable no-console */
      });

      program.parse(argv);
      var options = program.opts();
      ArgvParser.validateRetryOptions(options);

      return {
        options: options,
        args: program.args
      };
    }
  }]);
  return ArgvParser;
}();

exports.default = ArgvParser;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jbGkvYXJndl9wYXJzZXIuanMiXSwibmFtZXMiOlsiQXJndlBhcnNlciIsInZhbCIsIm1lbW8iLCJwdXNoIiwib3B0aW9uIiwic3RyIiwiSlNPTiIsInBhcnNlIiwiZXJyb3IiLCJFcnJvciIsIm1lc3NhZ2UiLCJpc1BsYWluT2JqZWN0IiwibWVyZ2UiLCJvcHRpb25OYW1lIiwicGFyc2VJbnQiLCJpc05hTiIsImluY2x1ZGVzIiwia2V5cyIsIkRJQUxFQ1RTIiwib3B0aW9ucyIsInJldHJ5VGFnRmlsdGVyIiwicmV0cnkiLCJhcmd2IiwicHJvZ3JhbSIsImJhc2VuYW1lIiwidXNhZ2UiLCJ2ZXJzaW9uIiwiY29sbGVjdCIsIm1lcmdlSnNvbiIsInZhbGlkYXRlTGFuZ3VhZ2UiLCJ2YWxpZGF0ZUNvdW50T3B0aW9uIiwibWVyZ2VUYWdzIiwib24iLCJjb25zb2xlIiwibG9nIiwib3B0cyIsInZhbGlkYXRlUmV0cnlPcHRpb25zIiwiYXJncyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOztBQUNBOztBQUNBOzs7O0FBQ0E7Ozs7OztJQUVxQkEsVTs7Ozs7Ozs0QkFDSkMsRyxFQUFLQyxJLEVBQU07QUFDeEJBLFdBQUtDLElBQUwsQ0FBVUYsR0FBVjtBQUNBLGFBQU9DLElBQVA7QUFDRDs7OzhCQUVnQkUsTSxFQUFRO0FBQ3ZCLGFBQU8sVUFBU0MsR0FBVCxFQUFjSCxJQUFkLEVBQW9CO0FBQ3pCLFlBQUlELFlBQUo7QUFDQSxZQUFJO0FBQ0ZBLGdCQUFNSyxLQUFLQyxLQUFMLENBQVdGLEdBQVgsQ0FBTjtBQUNELFNBRkQsQ0FFRSxPQUFPRyxLQUFQLEVBQWM7QUFDZCxnQkFBTSxJQUFJQyxLQUFKLENBQ0RMLE1BREMsOEJBQzhCSSxNQUFNRSxPQURwQyxVQUNnREwsR0FEaEQsQ0FBTjtBQUdEO0FBQ0QsWUFBSSxDQUFDLGlCQUFFTSxhQUFGLENBQWdCVixHQUFoQixDQUFMLEVBQTJCO0FBQ3pCLGdCQUFNLElB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QUFXOEIsbUJBQVgsQ0FBK0I3QixHQUEvQixFQUFvQyxTQUFwQyxDQUFQO0FBQUEsT0F6RUosRUEwRUksQ0ExRUosRUE0RUdHLE1BNUVILENBNkVJLCtCQTdFSix1SkFnRklKLFdBQVcrQixTQWhGZixFQWlGSSxFQWpGSixFQW1GRzNCLE1BbkZILENBb0ZJLHlCQXBGSixFQXFGSSx1RkFyRkosRUFzRklKLFdBQVcrQixTQXRGZixFQXVGSSxFQXZGSixFQXlGRzNCLE1BekZILENBMEZJLDJCQTFGSixFQTJGSSw4RUEzRkosRUE0RklKLFdBQVc0QixTQUFYLENBQXFCLG9CQUFyQixDQTVGSixFQTZGSSxFQTdGSjs7QUFnR0FMLGNBQVFTLEVBQVIsQ0FBVyxRQUFYLEVBQXFCLFlBQU07QUFDekI7QUFDQUMsZ0JBQVFDLEdBQVIsQ0FDRSwrRUFERjtBQUdBO0FBQ0QsT0FORDs7QUFRQVgsY0FBUWhCLEtBQVIsQ0FBY2UsSUFBZDtBQUNBLFVBQU1ILFVBQVVJLFFBQVFZLElBQVIsRUFBaEI7QUFDQW5DLGlCQUFXb0Msb0JBQVgsQ0FBZ0NqQixPQUFoQzs7QUFFQSxhQUFPO0FBQ0xBLHdCQURLO0FBRUxrQixjQUFNZCxRQUFRYztBQUZULE9BQVA7QUFJRDs7Ozs7a0JBcktrQnJDLFUiLCJmaWxlIjoiYXJndl9wYXJzZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgXyBmcm9tICdsb2Rhc2gnXG5pbXBvcnQgeyBDb21tYW5kIH0gZnJvbSAnY29tbWFuZGVyJ1xuaW1wb3J0IHsgdmVyc2lvbiB9IGZyb20gJy4uLy4uL3BhY2thZ2UuanNvbidcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnXG5pbXBvcnQgR2hlcmtpbiBmcm9tICdnaGVya2luJ1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBcmd2UGFyc2VyIHtcbiAgc3RhdGljIGNvbGxlY3QodmFsLCBtZW1vKSB7XG4gICAgbWVtby5wdXNoKHZhbClcbiAgICByZXR1cm4gbWVtb1xuICB9XG5cbiAgc3RhdGljIG1lcmdlSnNvbihvcHRpb24pIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oc3RyLCBtZW1vKSB7XG4gICAgICBsZXQgdmFsXG4gICAgICB0cnkge1xuICAgICAgICB2YWwgPSBKU09OLnBhcnNlKHN0cilcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICBgJHtvcHRpb259IHBhc3NlZCBpbnZhbGlkIEpTT046ICR7ZXJyb3IubWVzc2FnZX06ICR7c3RyfWBcbiAgICAgICAgKVxuICAgICAgfVxuICAgICAgaWYgKCFfLmlzUGxhaW5PYmplY3QodmFsKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7b3B0aW9ufSBtdXN0IGJlIHBhc3NlZCBKU09OIG9mIGFuIG9iamVjdDogJHtzdHJ9YClcbiAgICAgIH1cbiAgICAgIHJldHVybiBfLm1lcmdlKG1lbW8sIHZhbClcbiAgICB9XG4gIH1cblxuICBzdGF0aWMgbWVyZ2VUYWdzKHZhbCwgbWVtbykge1xuICAgIHJldHVybiBtZW1vID09PSAnJyA/IGAoJHt2YWx9KWAgOiBgJHttZW1vfSBhbmQgKCR7dmFsfSlgXG4gIH1cblxuICBzdGF0aWMgdmFsaWRhdGVDb3VudE9wdGlvbih2YWwsIG9wdGlvbk5hbWUpIHtcbiAgICB2YWwgPSBwYXJzZUludCh2YWwpXG4gICAgaWYgKGlzTmFOKHZhbCkgfHwgdmFsIDwgMCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGAke29wdGlvbk5hbWV9IG11c3QgYmUgYSBub24gbmVnYXRpdmUgaW50ZWdlcmApXG4gICAgfVxuICAgIHJldHVybiB2YWxcbiAgfVxuXG4gIHN0YXRpYyB2YWxpZGF0ZUxhbmd1YWdlKHZhbCkge1xuICAgIGlmICghXy5pbmNsdWRlcyhfLmtleXMoR2hlcmtpbi5ESUFMRUNUUyksIHZhbCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgVW5zdXBwb3J0ZWQgSVNPIDYzOS0xOiAke3ZhbH1gKVxuICAgIH1cbiAgICByZXR1cm4gdmFsXG4gIH1cblxuICBzdGF0aWMgdmFsaWRhdGVSZXRyeU9wdGlvbnMob3B0aW9ucykge1xuICAgIGlmIChvcHRpb25zLnJldHJ5VGFnRmlsdGVyICYmICFvcHRpb25zLnJldHJ5KSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgIGBhIHBvc2l0aXZlIC0tcmV0cnkgY291bnQgbXVzdCBiZSBzcGVjaWZpZWQgd2hlbiBzZXR0aW5nIC0tcmV0cnlUYWdGaWx0ZXJgXG4gICAgICApXG4gICAgfVxuICB9XG5cbiAgc3RhdGljIHBhcnNlKGFyZ3YpIHtcbiAgICBjb25zdCBwcm9ncmFtID0gbmV3IENvbW1hbmQocGF0aC5iYXNlbmFtZShhcmd2WzFdKSlcblxuICAgIHByb2dyYW1cbiAgICAgIC51c2FnZSgnW29wdGlvbnNdIFs8R0xPQnxESVJ8RklMRVs6TElORV0+Li4uXScpXG4gICAgICAudmVyc2lvbih2ZXJzaW9uLCAnLXYsIC0tdmVyc2lvbicpXG4gICAgICAub3B0aW9uKCctYiwgLS1iYWNrdHJhY2UnLCAnc2hvdyBmdWxsIGJhY2t0cmFjZSBmb3IgZXJyb3JzJylcbiAgICAgIC5vcHRpb24oJy1kLCAtLWRyeS1ydW4nLCAnaW52b2tlIGZvcm1hdHRlcnMgd2l0aG91dCBleGVjdXRpbmcgc3RlcHMnKVxuICAgICAgLm9wdGlvbihcbiAgICAgICAgJy0tZXhpdCcsXG4gICAgICAgICdmb3JjZSBzaHV0ZG93biBvZiB0aGUgZXZlbnQgbG9vcCB3aGVuIHRoZSB0ZXN0IHJ1biBoYXMgZmluaXNoZWQ6IGN1Y3VtYmVyIHdpbGwgY2FsbCBwcm9jZXNzLmV4aXQnXG4gICAgICApXG4gICAgICAub3B0aW9uKCctLWZhaWwtZmFzdCcsICdhYm9ydCB0aGUgcnVuIG9uIGZpcnN0IGZhaWx1cmUnKVxuICAgICAgLm9wdGlvbihcbiAgICAgICAgJy1mLCAtLWZvcm1hdCA8VFlQRVs6UEFUSF0+JyxcbiAgICAgICAgJ3NwZWNpZnkgdGhlIG91dHB1dCBmb3JtYXQsIG9wdGlvbmFsbHkgc3VwcGx5IFBBVEggdG8gcmVkaXJlY3QgZm9ybWF0dGVyIG91dHB1dCAocmVwZWF0YWJsZSknLFxuICAgICAgICBBcmd2UGFyc2VyLmNvbGxlY3QsXG4gICAgICAgIFtdXG4gICAgICApXG4gICAgICAub3B0aW9uKFxuICAgICAgICAnLS1mb3JtYXQtb3B0aW9ucyA8SlNPTj4nLFxuICAgICAgICAncHJvdmlkZSBvcHRpb25zIGZvciBmb3JtYXR0ZXJzIChyZXBlYXRhYmxlKScsXG4gICAgICAgIEFyZ3ZQYXJzZXIubWVyZ2VKc29uKCctLWZvcm1hdC1vcHRpb25zJyksXG4gICAgICAgIHt9XG4gICAgICApXG4gICAgICAub3B0aW9uKFxuICAgICAgICAnLS1pMThuLWtleXdvcmRzIDxJU08gNjM5LTE+JyxcbiAgICAgICAgJ2xpc3QgbGFuZ3VhZ2Uga2V5d29yZHMnLFxuICAgICAgICBBcmd2UGFyc2VyLnZhbGlkYXRlTGFuZ3VhZ2UsXG4gICAgICAgICcnXG4gICAgICApXG4gICAgICAub3B0aW9uKCctLWkxOG4tbGFuZ3VhZ2VzJywgJ2xpc3QgbGFuZ3VhZ2VzJylcbiAgICAgIC5vcHRpb24oXG4gICAgICAgICctLWxhbmd1YWdlIDxJU08gNjM5LTE+JyxcbiAgICAgICAgJ3Byb3ZpZGUgdGhlIGRlZmF1bHQgbGFuZ3VhZ2UgZm9yIGZlYXR1cmUgZmlsZXMnLFxuICAgICAgICAnJ1xuICAgICAgKVxuICAgICAgLm9wdGlvbihcbiAgICAgICAgJy0tbmFtZSA8UkVHRVhQPicsXG4gICAgICAgICdvbmx5IGV4ZWN1dGUgdGhlIHNjZW5hcmlvcyB3aXRoIG5hbWUgbWF0Y2hpbmcgdGhlIGV4cHJlc3Npb24gKHJlcGVhdGFibGUpJyxcbiAgICAgICAgQXJndlBhcnNlci5jb2xsZWN0LFxuICAgICAgICBbXVxuICAgICAgKVxuICAgICAgLm9wdGlvbignLS1uby1zdHJpY3QnLCAnc3VjY2VlZCBldmVuIGlmIHRoZXJlIGFyZSBwZW5kaW5nIHN0ZXBzJylcbiAgICAgIC5vcHRpb24oXG4gICAgICAgICctLW9yZGVyIDxUWVBFWzpTRUVEXT4nLFxuICAgICAgICAncnVuIHNjZW5hcmlvcyBpbiB0aGUgc3BlY2lmaWVkIG9yZGVyLiBUeXBlIHNob3VsZCBiZSBgZGVmaW5lZGAgb3IgYHJhbmRvbWAnLFxuICAgICAgICAnZGVmaW5lZCdcbiAgICAgIClcbiAgICAgIC5vcHRpb24oXG4gICAgICAgICctcCwgLS1wcm9maWxlIDxOQU1FPicsXG4gICAgICAgICdzcGVjaWZ5IHRoZSBwcm9maWxlIHRvIHVzZSAocmVwZWF0YWJsZSknLFxuICAgICAgICBBcmd2UGFyc2VyLmNvbGxlY3QsXG4gICAgICAgIFtdXG4gICAgICApXG4gICAgICAub3B0aW9uKFxuICAgICAgICAnLS1wYXJhbGxlbCA8TlVNQkVSX09GX1NMQVZFUz4nLFxuICAgICAgICAncnVuIGluIHBhcmFsbGVsIHdpdGggdGhlIGdpdmVuIG51bWJlciBvZiBzbGF2ZXMnLFxuICAgICAgICB2YWwgPT4gQXJndlBhcnNlci52YWxpZGF0ZUNvdW50T3B0aW9uKHZhbCwgJy0tcGFyYWxsZWwnKSxcbiAgICAgICAgMFxuICAgICAgKVxuICAgICAgLm9wdGlvbihcbiAgICAgICAgJy1yLCAtLXJlcXVpcmUgPEdMT0J8RElSfEZJTEU+JyxcbiAgICAgICAgJ3JlcXVpcmUgZmlsZXMgYmVmb3JlIGV4ZWN1dGluZyBmZWF0dXJlcyAocmVwZWF0YWJsZSknLFxuICAgICAgICBBcmd2UGFyc2VyLmNvbGxlY3QsXG4gICAgICAgIFtdXG4gICAgICApXG4gICAgICAub3B0aW9uKFxuICAgICAgICAnLS1yZXF1aXJlLW1vZHVsZSA8Tk9ERV9NT0RVTEU+JyxcbiAgICAgICAgJ3JlcXVpcmUgbm9kZSBtb2R1bGVzIGJlZm9yZSByZXF1aXJpbmcgZmlsZXMgKHJlcGVhdGFibGUpJyxcbiAgICAgICAgQXJndlBhcnNlci5jb2xsZWN0LFxuICAgICAgICBbXVxuICAgICAgKVxuICAgICAgLm9wdGlvbihcbiAgICAgICAgJy0tcmV0cnkgPE5VTUJFUl9PRl9SRVRSSUVTPicsXG4gICAgICAgICdzcGVjaWZ5IHRoZSBudW1iZXIgb2YgdGltZXMgdG8gcmV0cnkgZmFpbGluZyB0ZXN0IGNhc2VzIChkZWZhdWx0OiAwKScsXG4gICAgICAgIHZhbCA9PiBBcmd2UGFyc2VyLnZhbGlkYXRlQ291bnRPcHRpb24odmFsLCAnLS1yZXRyeScpLFxuICAgICAgICAwXG4gICAgICApXG4gICAgICAub3B0aW9uKFxuICAgICAgICAnLS1yZXRyeVRhZ0ZpbHRlciA8RVhQUkVTU0lPTj4nLFxuICAgICAgICBgb25seSByZXRyaWVzIHRoZSBmZWF0dXJlcyBvciBzY2VuYXJpb3Mgd2l0aCB0YWdzIG1hdGNoaW5nIHRoZSBleHByZXNzaW9uIChyZXBlYXRhYmxlKS5cbiAgICAgICAgVGhpcyBvcHRpb24gcmVxdWlyZXMgJy0tcmV0cnknIHRvIGJlIHNwZWNpZmllZC5gLFxuICAgICAgICBBcmd2UGFyc2VyLm1lcmdlVGFncyxcbiAgICAgICAgJydcbiAgICAgIClcbiAgICAgIC5vcHRpb24oXG4gICAgICAgICctdCwgLS10YWdzIDxFWFBSRVNTSU9OPicsXG4gICAgICAgICdvbmx5IGV4ZWN1dGUgdGhlIGZlYXR1cmVzIG9yIHNjZW5hcmlvcyB3aXRoIHRhZ3MgbWF0Y2hpbmcgdGhlIGV4cHJlc3Npb24gKHJlcGVhdGFibGUpJyxcbiAgICAgICAgQXJndlBhcnNlci5tZXJnZVRhZ3MsXG4gICAgICAgICcnXG4gICAgICApXG4gICAgICAub3B0aW9uKFxuICAgICAgICAnLS13b3JsZC1wYXJhbWV0ZXJzIDxKU09OPicsXG4gICAgICAgICdwcm92aWRlIHBhcmFtZXRlcnMgdGhhdCB3aWxsIGJlIHBhc3NlZCB0byB0aGUgd29ybGQgY29uc3RydWN0b3IgKHJlcGVhdGFibGUpJyxcbiAgICAgICAgQXJndlBhcnNlci5tZXJnZUpzb24oJy0td29ybGQtcGFyYW1ldGVycycpLFxuICAgICAgICB7fVxuICAgICAgKVxuXG4gICAgcHJvZ3JhbS5vbignLS1oZWxwJywgKCkgPT4ge1xuICAgICAgLyogZXNsaW50LWRpc2FibGUgbm8tY29uc29sZSAqL1xuICAgICAgY29uc29sZS5sb2coXG4gICAgICAgICcgIEZvciBtb3JlIGRldGFpbHMgcGxlYXNlIHZpc2l0IGh0dHBzOi8vZ2l0aHViLmNvbS9jdWN1bWJlci9jdWN1bWJlci1qcyNjbGlcXG4nXG4gICAgICApXG4gICAgICAvKiBlc2xpbnQtZW5hYmxlIG5vLWNvbnNvbGUgKi9cbiAgICB9KVxuXG4gICAgcHJvZ3JhbS5wYXJzZShhcmd2KVxuICAgIGNvbnN0IG9wdGlvbnMgPSBwcm9ncmFtLm9wdHMoKVxuICAgIEFyZ3ZQYXJzZXIudmFsaWRhdGVSZXRyeU9wdGlvbnMob3B0aW9ucylcblxuICAgIHJldHVybiB7XG4gICAgICBvcHRpb25zLFxuICAgICAgYXJnczogcHJvZ3JhbS5hcmdzLFxuICAgIH1cbiAgfVxufVxuIl19