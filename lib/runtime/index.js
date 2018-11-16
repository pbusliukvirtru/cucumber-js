'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _helpers = require('../formatter/helpers');

var _stack_trace_filter = require('./stack_trace_filter');

var _stack_trace_filter2 = _interopRequireDefault(_stack_trace_filter);

var _status = require('../status');

var _status2 = _interopRequireDefault(_status);

var _test_case_runner = require('./test_case_runner');

var _test_case_runner2 = _interopRequireDefault(_test_case_runner);

var _user_code_runner = require('../user_code_runner');

var _user_code_runner2 = _interopRequireDefault(_user_code_runner);

var _verror = require('verror');

var _verror2 = _interopRequireDefault(_verror);

var _helpers2 = require('./helpers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Runtime = function () {
  // options - {dryRun, failFast, filterStacktraces, retry, retryTagFilter, strict}
  function Runtime(_ref) {
    var eventBroadcaster = _ref.eventBroadcaster,
        options = _ref.options,
        supportCodeLibrary = _ref.supportCodeLibrary,
        testCases = _ref.testCases;
    (0, _classCallCheck3.default)(this, Runtime);

    this.eventBroadcaster = eventBroadcaster;
    this.options = options || {};
    this.stackTraceFilter = new _stack_trace_filter2.default();
    this.supportCodeLibrary = supportCodeLibrary;
    this.testCases = testCases || [];
    this.result = {
      duration: 0,
      success: true
    };
  }

  (0, _createClass3.default)(Runtime, [{
    key: 'runTestRunHooks',
    value: function () {
      var _ref2 = (0, _bluebird.coroutine)(function* (key, name) {
        var _this = this;

        yield _bluebird2.default.each(this.supportCodeLibrary[key], function () {
          var _ref3 = (0, _bluebird.coroutine)(function* (hookDefinition) {
            var _ref4 = yield _user_code_runner2.default.run({
              argsArray: [],
              fn: hookDefinition.code,
              thisArg: null,
              timeoutInMilliseconds: hookDefinition.options.timeout || _this.supportCodeLibrary.defaultTimeout
            }),
                error = _ref4.error;

            if (error) {
              var location = (0, _helpers.formatLocation)(hookDefinition);
              throw new _verror2.default(error, name + ' hook errored, process exiting: ' + location);
            }
          });

          return function (_x3) {
            return _ref3.apply(this, arguments);
          };
        }());
      });

      function runTestRunHooks(_x, _x2) {
        return _ref2.apply(this, arguments);
      }

      return runTestRunHooks;
    }()
  }, {
    key: 'runTestCase',
    value: function () {
      var _ref5 = (0, _bluebird.coroutine)(function* (testCase) {
        var retries = (0, _helpers2.retriesForTestCase)(testCase, this.options);
        var skip = this.options.dryRun || this.options.failFast && !this.result.success;
        var testCaseRunner = new _test_case_runner2.default({
          eventBroadcaster: this.eventBroadcaster,
          retries: retries,
          skip: skip,
          supportCodeLibrary: this.supportCodeLibrary,
          testCase: testCase,
          worldParameters: this.options.worldParameters
        });
        var testCaseResult = yield testCaseRunner.run();
        if (testCaseResult.duration) {
          this.result.duration += testCaseResult.duration;
        }
        if (this.shouldCauseFailure(testCaseResult.status)) {
          this.result.success = false;
        }
      });

      function runTestCase(_x4) {
        return _ref5.apply(this, arguments);
      }

      return runTestCase;
    }()
  }, {
    key: 'start',
    value: function () {
      var _ref6 = (0, _bluebird.coroutine)(function* () {
        if (this.options.filterStacktraces) {
          this.stackTraceFilter.filter();
        }
        this.eventBroadcaster.emit('test-run-started');
        yield this.runTestRunHooks('beforeTestRunHookDefinitions', 'a BeforeAll');
        yield _bluebird2.default.each(this.testCases, this.runTestCase.bind(this));
        yield this.runTestRunHooks('afterTestRunHookDefinitions', 'an AfterAll');
        this.eventBroadcaster.emit('test-run-finished', { result: this.result });
        if (this.options.filterStacktraces) {
          this.stackTraceFilter.unfilter();
        }
        return this.result.success;
      });

      function start() {
        return _ref6.apply(this, arguments);
      }

      return start;
    }()
  }, {
    key: 'shouldCauseFailure',
    value: function shouldCauseFailure(status) {
      return _lodash2.default.includes([_status2.default.AMBIGUOUS, _status2.default.FAILED, _status2.default.UNDEFINED], status) || status === _status2.default.PENDING && this.options.strict;
    }
  }]);
  return Runtime;
}();

exports.default = Runtime;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ydW50aW1lL2luZGV4LmpzIl0sIm5hbWVzIjpbIlJ1bnRpbWUiLCJldmVudEJyb2FkY2FzdGVyIiwib3B0aW9ucyIsInN1cHBvcnRDb2RlTGlicmFyeSIsInRlc3RDYXNlcyIsInN0YWNrVHJhY2VGaWx0ZXIiLCJyZXN1bHQiLCJkdXJhdGlvbiIsInN1Y2Nlc3MiLCJrZXkiLCJuYW1lIiwiZWFjaCIsImhvb2tEZWZpbml0aW9uIiwicnVuIiwiYXJnc0FycmF5IiwiZm4iLCJjb2RlIiwidGhpc0FyZyIsInRpbWVvdXRJbk1pbGxpc2Vjb25kcyIsInRpbWVvdXQiLCJkZWZhdWx0VGltZW91dCIsImVycm9yIiwibG9jYXRpb24iLCJ0ZXN0Q2FzZSIsInJldHJpZXMiLCJza2lwIiwiZHJ5UnVuIiwiZmFpbEZhc3QiLCJ0ZXN0Q2FzZVJ1bm5lciIsIndvcmxkUGFyYW1ldGVycyIsInRlc3RDYXNlUmVzdWx0Iiwic2hvdWxkQ2F1c2VGYWlsdXJlIiwic3RhdHVzIiwiZmlsdGVyU3RhY2t0cmFjZXMiLCJmaWx0ZXIiLCJlbWl0IiwicnVuVGVzdFJ1bkhvb2tzIiwicnVuVGVzdENhc2UiLCJ1bmZpbHRlciIsImluY2x1ZGVzIiwiQU1CSUdVT1VTIiwiRkFJTEVEIiwiVU5ERUZJTkVEIiwiUEVORElORyIsInN0cmljdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7QUFFQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7SUFFcUJBLE87QUFDbkI7QUFDQSx5QkFBMEU7QUFBQSxRQUE1REMsZ0JBQTRELFFBQTVEQSxnQkFBNEQ7QUFBQSxRQUExQ0MsT0FBMEMsUUFBMUNBLE9BQTBDO0FBQUEsUUFBakNDLGtCQUFpQyxRQUFqQ0Esa0JBQWlDO0FBQUEsUUFBYkMsU0FBYSxRQUFiQSxTQUFhO0FBQUE7O0FBQ3hFLFNBQUtILGdCQUFMLEdBQXdCQSxnQkFBeEI7QUFDQSxTQUFLQyxPQUFM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QixNLEVBQVE7QUFDekIsYUFDRSxpQkFBRU8sUUFBRixDQUFXLENBQUMsaUJBQU9DLFNBQVIsRUFBbUIsaUJBQU9DLE1BQTFCLEVBQWtDLGlCQUFPQyxTQUF6QyxDQUFYLEVBQWdFVixNQUFoRSxLQUNDQSxXQUFXLGlCQUFPVyxPQUFsQixJQUE2QixLQUFLekMsT0FBTCxDQUFhMEMsTUFGN0M7QUFJRDs7Ozs7a0JBM0VrQjVDLE8iLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgXyBmcm9tICdsb2Rhc2gnXG5pbXBvcnQgeyBmb3JtYXRMb2NhdGlvbiB9IGZyb20gJy4uL2Zvcm1hdHRlci9oZWxwZXJzJ1xuaW1wb3J0IFByb21pc2UgZnJvbSAnYmx1ZWJpcmQnXG5pbXBvcnQgU3RhY2tUcmFjZUZpbHRlciBmcm9tICcuL3N0YWNrX3RyYWNlX2ZpbHRlcidcbmltcG9ydCBTdGF0dXMgZnJvbSAnLi4vc3RhdHVzJ1xuaW1wb3J0IFRlc3RDYXNlUnVubmVyIGZyb20gJy4vdGVzdF9jYXNlX3J1bm5lcidcbmltcG9ydCBVc2VyQ29kZVJ1bm5lciBmcm9tICcuLi91c2VyX2NvZGVfcnVubmVyJ1xuaW1wb3J0IFZFcnJvciBmcm9tICd2ZXJyb3InXG5pbXBvcnQgeyByZXRyaWVzRm9yVGVzdENhc2UgfSBmcm9tICcuL2hlbHBlcnMnXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJ1bnRpbWUge1xuICAvLyBvcHRpb25zIC0ge2RyeVJ1biwgZmFpbEZhc3QsIGZpbHRlclN0YWNrdHJhY2VzLCByZXRyeSwgcmV0cnlUYWdGaWx0ZXIsIHN0cmljdH1cbiAgY29uc3RydWN0b3IoeyBldmVudEJyb2FkY2FzdGVyLCBvcHRpb25zLCBzdXBwb3J0Q29kZUxpYnJhcnksIHRlc3RDYXNlcyB9KSB7XG4gICAgdGhpcy5ldmVudEJyb2FkY2FzdGVyID0gZXZlbnRCcm9hZGNhc3RlclxuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnMgfHwge31cbiAgICB0aGlzLnN0YWNrVHJhY2VGaWx0ZXIgPSBuZXcgU3RhY2tUcmFjZUZpbHRlcigpXG4gICAgdGhpcy5zdXBwb3J0Q29kZUxpYnJhcnkgPSBzdXBwb3J0Q29kZUxpYnJhcnlcbiAgICB0aGlzLnRlc3RDYXNlcyA9IHRlc3RDYXNlcyB8fCBbXVxuICAgIHRoaXMucmVzdWx0ID0ge1xuICAgICAgZHVyYXRpb246IDAsXG4gICAgICBzdWNjZXNzOiB0cnVlLFxuICAgIH1cbiAgfVxuXG4gIGFzeW5jIHJ1blRlc3RSdW5Ib29rcyhrZXksIG5hbWUpIHtcbiAgICBhd2FpdCBQcm9taXNlLmVhY2godGhpcy5zdXBwb3J0Q29kZUxpYnJhcnlba2V5XSwgYXN5bmMgaG9va0RlZmluaXRpb24gPT4ge1xuICAgICAgY29uc3QgeyBlcnJvciB9ID0gYXdhaXQgVXNlckNvZGVSdW5uZXIucnVuKHtcbiAgICAgICAgYXJnc0FycmF5OiBbXSxcbiAgICAgICAgZm46IGhvb2tEZWZpbml0aW9uLmNvZGUsXG4gICAgICAgIHRoaXNBcmc6IG51bGwsXG4gICAgICAgIHRpbWVvdXRJbk1pbGxpc2Vjb25kczpcbiAgICAgICAgICBob29rRGVmaW5pdGlvbi5vcHRpb25zLnRpbWVvdXQgfHxcbiAgICAgICAgICB0aGlzLnN1cHBvcnRDb2RlTGlicmFyeS5kZWZhdWx0VGltZW91dCxcbiAgICAgIH0pXG4gICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgY29uc3QgbG9jYXRpb24gPSBmb3JtYXRMb2NhdGlvbihob29rRGVmaW5pdGlvbilcbiAgICAgICAgdGhyb3cgbmV3IFZFcnJvcihcbiAgICAgICAgICBlcnJvcixcbiAgICAgICAgICBgJHtuYW1lfSBob29rIGVycm9yZWQsIHByb2Nlc3MgZXhpdGluZzogJHtsb2NhdGlvbn1gXG4gICAgICAgIClcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgYXN5bmMgcnVuVGVzdENhc2UodGVzdENhc2UpIHtcbiAgICBjb25zdCByZXRyaWVzID0gcmV0cmllc0ZvclRlc3RDYXNlKHRlc3RDYXNlLCB0aGlzLm9wdGlvbnMpXG4gICAgY29uc3Qgc2tpcCA9XG4gICAgICB0aGlzLm9wdGlvbnMuZHJ5UnVuIHx8ICh0aGlzLm9wdGlvbnMuZmFpbEZhc3QgJiYgIXRoaXMucmVzdWx0LnN1Y2Nlc3MpXG4gICAgY29uc3QgdGVzdENhc2VSdW5uZXIgPSBuZXcgVGVzdENhc2VSdW5uZXIoe1xuICAgICAgZXZlbnRCcm9hZGNhc3RlcjogdGhpcy5ldmVudEJyb2FkY2FzdGVyLFxuICAgICAgcmV0cmllcyxcbiAgICAgIHNraXAsXG4gICAgICBzdXBwb3J0Q29kZUxpYnJhcnk6IHRoaXMuc3VwcG9ydENvZGVMaWJyYXJ5LFxuICAgICAgdGVzdENhc2UsXG4gICAgICB3b3JsZFBhcmFtZXRlcnM6IHRoaXMub3B0aW9ucy53b3JsZFBhcmFtZXRlcnMsXG4gICAgfSlcbiAgICBjb25zdCB0ZXN0Q2FzZVJlc3VsdCA9IGF3YWl0IHRlc3RDYXNlUnVubmVyLnJ1bigpXG4gICAgaWYgKHRlc3RDYXNlUmVzdWx0LmR1cmF0aW9uKSB7XG4gICAgICB0aGlzLnJlc3VsdC5kdXJhdGlvbiArPSB0ZXN0Q2FzZVJlc3VsdC5kdXJhdGlvblxuICAgIH1cbiAgICBpZiAodGhpcy5zaG91bGRDYXVzZUZhaWx1cmUodGVzdENhc2VSZXN1bHQuc3RhdHVzKSkge1xuICAgICAgdGhpcy5yZXN1bHQuc3VjY2VzcyA9IGZhbHNlXG4gICAgfVxuICB9XG5cbiAgYXN5bmMgc3RhcnQoKSB7XG4gICAgaWYgKHRoaXMub3B0aW9ucy5maWx0ZXJTdGFja3RyYWNlcykge1xuICAgICAgdGhpcy5zdGFja1RyYWNlRmlsdGVyLmZpbHRlcigpXG4gICAgfVxuICAgIHRoaXMuZXZlbnRCcm9hZGNhc3Rlci5lbWl0KCd0ZXN0LXJ1bi1zdGFydGVkJylcbiAgICBhd2FpdCB0aGlzLnJ1blRlc3RSdW5Ib29rcygnYmVmb3JlVGVzdFJ1bkhvb2tEZWZpbml0aW9ucycsICdhIEJlZm9yZUFsbCcpXG4gICAgYXdhaXQgUHJvbWlzZS5lYWNoKHRoaXMudGVzdENhc2VzLCA6OnRoaXMucnVuVGVzdENhc2UpXG4gICAgYXdhaXQgdGhpcy5ydW5UZXN0UnVuSG9va3MoJ2FmdGVyVGVzdFJ1bkhvb2tEZWZpbml0aW9ucycsICdhbiBBZnRlckFsbCcpXG4gICAgdGhpcy5ldmVudEJyb2FkY2FzdGVyLmVtaXQoJ3Rlc3QtcnVuLWZpbmlzaGVkJywgeyByZXN1bHQ6IHRoaXMucmVzdWx0IH0pXG4gICAgaWYgKHRoaXMub3B0aW9ucy5maWx0ZXJTdGFja3RyYWNlcykge1xuICAgICAgdGhpcy5zdGFja1RyYWNlRmlsdGVyLnVuZmlsdGVyKClcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMucmVzdWx0LnN1Y2Nlc3NcbiAgfVxuXG4gIHNob3VsZENhdXNlRmFpbHVyZShzdGF0dXMpIHtcbiAgICByZXR1cm4gKFxuICAgICAgXy5pbmNsdWRlcyhbU3RhdHVzLkFNQklHVU9VUywgU3RhdHVzLkZBSUxFRCwgU3RhdHVzLlVOREVGSU5FRF0sIHN0YXR1cykgfHxcbiAgICAgIChzdGF0dXMgPT09IFN0YXR1cy5QRU5ESU5HICYmIHRoaXMub3B0aW9ucy5zdHJpY3QpXG4gICAgKVxuICB9XG59XG4iXX0=