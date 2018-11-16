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

var _helpers = require('../../formatter/helpers');

var _command_types = require('./command_types');

var _command_types2 = _interopRequireDefault(_command_types);

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

var _serializeError = require('serialize-error');

var _serializeError2 = _interopRequireDefault(_serializeError);

var _stack_trace_filter = require('../stack_trace_filter');

var _stack_trace_filter2 = _interopRequireDefault(_stack_trace_filter);

var _support_code_library_builder = require('../../support_code_library_builder');

var _support_code_library_builder2 = _interopRequireDefault(_support_code_library_builder);

var _test_case_runner = require('../test_case_runner');

var _test_case_runner2 = _interopRequireDefault(_test_case_runner);

var _user_code_runner = require('../../user_code_runner');

var _user_code_runner2 = _interopRequireDefault(_user_code_runner);

var _verror = require('verror');

var _verror2 = _interopRequireDefault(_verror);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var EVENTS = ['test-case-prepared', 'test-case-started', 'test-step-started', 'test-step-attachment', 'test-step-finished', 'test-case-finished'];

function serializeResultExceptionIfNecessary(data) {
  if (data.result && data.result.exception && _lodash2.default.isError(data.result.exception)) {
    data.result.exception = (0, _serializeError2.default)(data.result.exception);
  }
}

var Slave = function () {
  function Slave(_ref) {
    var _this = this;

    var cwd = _ref.cwd,
        exit = _ref.exit,
        sendMessage = _ref.sendMessage;
    (0, _classCallCheck3.default)(this, Slave);

    this.initialized = false;
    this.cwd = cwd;
    this.exit = exit;
    this.sendMessage = sendMessage;
    this.eventBroadcaster = new _events2.default();
    this.stackTraceFilter = new _stack_trace_filter2.default();
    EVENTS.forEach(function (name) {
      _this.eventBroadcaster.on(name, function (data) {
        serializeResultExceptionIfNecessary(data);
        _this.sendMessage({ command: _command_types2.default.EVENT, name: name, data: data });
      });
    });
  }

  (0, _createClass3.default)(Slave, [{
    key: 'initialize',
    value: function () {
      var _ref3 = (0, _bluebird.coroutine)(function* (_ref2) {
        var filterStacktraces = _ref2.filterStacktraces,
            supportCodeRequiredModules = _ref2.supportCodeRequiredModules,
            supportCodePaths = _ref2.supportCodePaths,
            worldParameters = _ref2.worldParameters;

        supportCodeRequiredModules.map(function (module) {
          return require(module);
        });
        _support_code_library_builder2.default.reset(this.cwd);
        supportCodePaths.forEach(function (codePath) {
          return require(codePath);
        });
        this.supportCodeLibrary = _support_code_library_builder2.default.finalize();
        this.worldParameters = worldParameters;
        this.filterStacktraces = filterStacktraces;
        if (this.filterStacktraces) {
          this.stackTraceFilter.filter();
        }
        yield this.runTestRunHooks('beforeTestRunHookDefinitions', 'a BeforeAll');
        this.sendMessage({ command: _command_types2.default.READY });
      });

      function initialize(_x) {
        return _ref3.apply(this, arguments);
      }

      return initialize;
    }()
  }, {
    key: 'finalize',
    value: function () {
      var _ref4 = (0, _bluebird.coroutine)(function* () {
        yield this.runTestRunHooks('afterTestRunHookDefinitions', 'an AfterAll');
        if (this.filterStacktraces) {
          this.stackTraceFilter.unfilter();
        }
        this.exit();
      });

      function finalize() {
        return _ref4.apply(this, arguments);
      }

      return finalize;
    }()
  }, {
    key: 'receiveMessage',
    value: function receiveMessage(message) {
      if (message.command === 'initialize') {
        this.initialize(message);
      } else if (message.command === 'finalize') {
        this.finalize();
      } else if (message.command === 'run') {
        this.runTestCase(message);
      }
    }
  }, {
    key: 'runTestCase',
    value: function () {
      var _ref6 = (0, _bluebird.coroutine)(function* (_ref5) {
        var testCase = _ref5.testCase,
            retries = _ref5.retries,
            skip = _ref5.skip;

        var testCaseRunner = new _test_case_runner2.default({
          eventBroadcaster: this.eventBroadcaster,
          retries: retries,
          skip: skip,
          supportCodeLibrary: this.supportCodeLibrary,
          testCase: testCase,
          worldParameters: this.worldParameters
        });
        yield testCaseRunner.run();
        this.sendMessage({ command: _command_types2.default.READY });
      });

      function runTestCase(_x2) {
        return _ref6.apply(this, arguments);
      }

      return runTestCase;
    }()
  }, {
    key: 'runTestRunHooks',
    value: function () {
      var _ref7 = (0, _bluebird.coroutine)(function* (key, name) {
        var _this2 = this;

        yield _bluebird2.default.each(this.supportCodeLibrary[key], function () {
          var _ref8 = (0, _bluebird.coroutine)(function* (hookDefinition) {
            var _ref9 = yield _user_code_runner2.default.run({
              argsArray: [],
              fn: hookDefinition.code,
              thisArg: null,
              timeoutInMilliseconds: hookDefinition.options.timeout || _this2.supportCodeLibrary.defaultTimeout
            }),
                error = _ref9.error;

            if (error) {
              var location = (0, _helpers.formatLocation)(hookDefinition);
              throw new _verror2.default(error, name + ' hook errored, process exiting: ' + location);
            }
          });

          return function (_x5) {
            return _ref8.apply(this, arguments);
          };
        }());
      });

      function runTestRunHooks(_x3, _x4) {
        return _ref7.apply(this, arguments);
      }

      return runTestRunHooks;
    }()
  }]);
  return Slave;
}();

exports.default = Slave;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9ydW50aW1lL3BhcmFsbGVsL3NsYXZlLmpzIl0sIm5hbWVzIjpbIkVWRU5UUyIsInNlcmlhbGl6ZVJlc3VsdEV4Y2VwdGlvbklmTmVjZXNzYXJ5IiwiZGF0YSIsInJlc3VsdCIsImV4Y2VwdGlvbiIsImlzRXJyb3IiLCJTbGF2ZSIsImN3ZCIsImV4aXQiLCJzZW5kTWVzc2FnZSIsImluaXRpYWxpemVkIiwiZXZlbnRCcm9hZGNhc3RlciIsInN0YWNrVHJhY2VGaWx0ZXIiLCJmb3JFYWNoIiwib24iLCJuYW1lIiwiY29tbWFuZCIsIkVWRU5UIiwiZmlsdGVyU3RhY2t0cmFjZXMiLCJzdXBwb3J0Q29kZVJlcXVpcmVkTW9kdWxlcyIsInN1cHBvcnRDb2RlUGF0aHMiLCJ3b3JsZFBhcmFtZXRlcnMiLCJtYXAiLCJyZXF1aXJlIiwibW9kdWxlIiwicmVzZXQiLCJjb2RlUGF0aCIsInN1cHBvcnRDb2RlTGlicmFyeSIsImZpbmFsaXplIiwiZmlsdGVyIiwicnVuVGVzdFJ1bkhvb2tzIiwiUkVBRFkiLCJ1bmZpbHRlciIsIm1lc3NhZ2UiLCJpbml0aWFsaXplIiwicnVuVGVzdENhc2UiLCJ0ZXN0Q2FzZSIsInJldHJpZXMiLCJza2lwIiwidGVzdENhc2VSdW5uZXIiLCJydW4iLCJrZXkiLCJlYWNoIiwiaG9va0RlZmluaXRpb24iLCJhcmdzQXJyYXkiLCJmbiIsImNvZGUiLCJ0aGlzQXJnIiwidGltZW91dEluTWlsbGlzZWNvbmRzIiwib3B0aW9ucyIsInRpbWVvdXQiLCJkZWZhdWx0VGltZW91dCIsImVycm9yIiwibG9jYXRpb24iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7O0FBQ0E7Ozs7QUFDQTs7OztBQUVBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBRUEsSUFBTUEsU0FBUyxDQUNiLG9CQURhLEVBRWIsbUJBRmEsRUFHYixtQkFIYSxFQUliLHNCQUphLEVBS2Isb0JBTGEsRUFNYixvQkFOYSxDQUFmOztBQVNBLFNBQVNDLG1DQUFULENBQTZDQyxJQUE3QyxFQUFtRDtBQUNqRCxNQUNFQSxLQUFLQyxNQUFMLElBQ0FELEtBQUtDLE1BQUwsQ0FBWUMsU0FEWixJQUVBLGlCQUFFQyxPQUFGLENBQVVILEtBQUtDLE1BQUwsQ0FBWUMsU0FBdEIsQ0FIRixFQUlFO0FBQ0FGLFNBQUtDLE1BQUwsQ0FBWUMsU0FBWixHQUF3Qiw4QkFBZUYsS0FBS0MsTUFBTCxDQUFZQyxTQUEzQixDQUF4QjtBQUNEO0FBQ0Y7O0lBRW9CRSxLO0FBQ25CLHVCQUF3QztBQUFBOztBQUFBLFFBQTFCQyxHQUEwQixRQUExQkEsR0FBMEI7QUFBQSxRQUFyQkMsSUFBcUIsUUFBckJBLElBQXFCO0FBQUEsUUFBZkMsV0FBZSxRQUFmQSxXQUFlO0FBQUE7O0FBQ3RDLFNBQUtDLFdBQUwsR0FBbUIsS0FBbkI7QUFDQSxTQUFLSCxHQUFMLEdBQVdBLEdBQVg7QUFDQSxTQUFLQyxJQUFMLEdBQVlBLElBQVo7QUFDQSxTQUFLQyxXQUFMLEdBQW1CQSxXQUFuQjtBQUNBLFNBQUtFLGdCQUFMLEdBQXdCLHNCQUF4QjtBQUNBLFNBQUtDLGdCQUFMLEdBQXdCLGtDQUF4QjtBQUNBWixXQUFPYSxPQUFQLENBQWUsZ0JBQVE7QUFDckIsWUFBS0YsZ0JBQUwsQ0FBc0JHLEVBQXRCLENBQXlCQyxJQUF6QixFQUErQixnQkFBUTtBQUNyQ2QsNENBQW9DQyxJQUFwQztBQUNBLGNBQUtPLFdBQUwsQ0FBaUIsRUFBRU8sU0FBUyx3QkFBYUMsS0FBeEIsRUFBK0JGLFVBQS9CLEVBQXFDYixVQUFyQyxFQUFqQjtBQUNELE9BSEQ7QUFJRCxLQUxEO0FBTUQ7Ozs7OzZEQU9FO0FBQUEsWUFKRGdCLGlCQUlDLFNBSkRBLGlCQUlDO0FBQUEsWUFIREMsMEJBR0MsU0FIREEsMEJBR0M7QUFBQSxZQUZEQyxnQkFFQyxTQUZEQSxnQkFFQztBQUFBLFlBRERDLGVBQ0MsU0FEREEsZUFDQzs7QUFDREYsbUNBQTJCRyxHQUEzQixDQUErQjtBQUFBLGlCQUFVQyxRQUFRQyxNQUFSLENBQVY7QUFBQSxTQUEvQjtBQUNBLCtDQUEwQkMsS0FBMUIsQ0FBZ0MsS0FBS2xCLEdBQXJDO0FBQ0FhLHlCQUFpQlAsT0FBakIsQ0FBeUI7QUFBQSxpQkFBWVUsUUFBUUcsUUFBUixDQUFaO0FBQUEsU0FBekI7QUFDQSxhQUFLQyxrQkFBTCxHQUEwQix1Q0FBMEJDLFFBQTFCLEVBQTFCO0FBQ0EsYUFBS1AsZUFBTCxHQUF1QkEsZUFBdkI7QUFDQSxhQUFLSCxpQkFBTCxHQUF5QkEsaUJBQXpCO0FBQ0EsWUFBSSxLQUFLQSxpQkFBVCxFQUE0QjtBQUMxQixlQUFLTixnQkFBTCxDQUFzQmlCLE1BQXRCO0FBQ0Q7QUFDRCxjQUFNLEtBQUtDLGVBQUwsQ0FBcUIsOEJBQXJCLEVBQXFELGFBQXJELENBQU47QUFDQSxhQUFLckIsV0FBTCxDQUFpQixFQUFFTyxTQUFTLHdCQUFhZSxLQUF4QixFQUFqQjtBQUNELE87Ozs7Ozs7Ozs7O3dEQUVnQjtBQUNmLGNBQU0sS0FBS0QsZUFBTCxDQUFxQiw2QkFBckIsRUFBb0QsYUFBcEQsQ0FBTjtBQUNBLFlBQUksS0FBS1osaUJBQVQsRUFBNEI7QUFDMUIsZUFBS04sZ0JBQUwsQ0FBc0JvQixRQUF0QjtBQUNEO0FBQ0QsYUFBS3hCLElBQUw7QUFDRCxPOzs7Ozs7Ozs7O21DQUVjeUIsTyxFQUFTO0FBQ3RCLFVBQUlBLFFBQVFqQixPQUFSLEtBQW9CLFlBQXhCLEVBQXNDO0FBQ3BDLGFBQUtrQixVQUFMLENBQWdCRCxPQUFoQjtBQUNELE9BRkQsTUFFTyxJQUFJQSxRQUFRakIsT0FBUixLQUFvQixVQUF4QixFQUFvQztBQUN6QyxhQUFLWSxRQUFMO0FBQ0QsT0FGTSxNQUVBLElBQUlLLFFBQVFqQixPQUFSLEtBQW9CLEtBQXhCLEVBQStCO0FBQ3BDLGFBQUttQixXQUFMLENBQWlCRixPQUFqQjtBQUNEO0FBQ0Y7Ozs7NkRBRThDO0FBQUEsWUFBM0JHLFFBQTJCLFNBQTNCQSxRQUEyQjtBQUFBLFlBQWpCQyxPQUFpQixTQUFqQkEsT0FBaUI7QUFBQSxZQUFSQyxJQUFRLFNBQVJBLElBQVE7O0FBQzdDLFlBQU1DLGlCQUFpQiwrQkFBbUI7QUFDeEM1Qiw0QkFBa0IsS0FBS0EsZ0JBRGlCO0FBRXhDMEIsMEJBRndDO0FBR3hDQyxvQkFId0M7QUFJeENYLDhCQUFvQixLQUFLQSxrQkFKZTtBQUt4Q1MsNEJBTHdDO0FBTXhDZiwyQkFBaUIsS0FBS0E7QUFOa0IsU0FBbkIsQ0FBdkI7QUFRQSxjQUFNa0IsZUFBZUMsR0FBZixFQUFOO0FBQ0EsYUFBSy9CLFdBQUwsQ0FBaUIsRUFBRU8sU0FBUyx3QkFBYWUsS0FBeEIsRUFBakI7QUFDRCxPOzs7Ozs7Ozs7OztzREFFcUJVLEcsRUFBSzFCLEksRUFBTTtBQUFBOztBQUMvQixjQUFNLG1CQUFRMkIsSUFBUixDQUFhLEtBQUtmLGtCQUFMLENBQXdCYyxHQUF4QixDQUFiO0FBQUEsK0NBQTJDLFdBQU1FLGNBQU4sRUFBd0I7QUFBQSx3QkFDckQsTUFBTSwyQkFBZUgsR0FBZixDQUFtQjtBQUN6Q0kseUJBQVcsRUFEOEI7QUFFekNDLGtCQUFJRixlQUFlRyxJQUZzQjtBQUd6Q0MsdUJBQVMsSUFIZ0M7QUFJekNDLHFDQUNFTCxlQUFlTSxPQUFmLENBQXVCQyxPQUF2QixJQUNBLE9BQUt2QixrQkFBTCxDQUF3QndCO0FBTmUsYUFBbkIsQ0FEK0M7QUFBQSxnQkFDL0RDLEtBRCtELFNBQy9EQSxLQUQrRDs7QUFTdkUsZ0JBQUlBLEtBQUosRUFBVztBQUNULGtCQUFNQyxXQUFXLDZCQUFlVixjQUFmLENBQWpCO0FBQ0Esb0JBQU0scUJBQ0pTLEtBREksRUFFRHJDLElBRkMsd0NBRXNDc0MsUUFGdEMsQ0FBTjtBQUlEO0FBQ0YsV0FoQks7O0FBQUE7QUFBQTtBQUFBO0FBQUEsWUFBTjtBQWlCRCxPOzs7Ozs7Ozs7Ozs7a0JBcEZrQi9DLEsiLCJmaWxlIjoic2xhdmUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgXyBmcm9tICdsb2Rhc2gnXG5pbXBvcnQgeyBmb3JtYXRMb2NhdGlvbiB9IGZyb20gJy4uLy4uL2Zvcm1hdHRlci9oZWxwZXJzJ1xuaW1wb3J0IGNvbW1hbmRUeXBlcyBmcm9tICcuL2NvbW1hbmRfdHlwZXMnXG5pbXBvcnQgRXZlbnRFbWl0dGVyIGZyb20gJ2V2ZW50cydcbmltcG9ydCBQcm9taXNlIGZyb20gJ2JsdWViaXJkJ1xuaW1wb3J0IHNlcmlhbGl6ZUVycm9yIGZyb20gJ3NlcmlhbGl6ZS1lcnJvcidcbmltcG9ydCBTdGFja1RyYWNlRmlsdGVyIGZyb20gJy4uL3N0YWNrX3RyYWNlX2ZpbHRlcidcbmltcG9ydCBzdXBwb3J0Q29kZUxpYnJhcnlCdWlsZGVyIGZyb20gJy4uLy4uL3N1cHBvcnRfY29kZV9saWJyYXJ5X2J1aWxkZXInXG5pbXBvcnQgVGVzdENhc2VSdW5uZXIgZnJvbSAnLi4vdGVzdF9jYXNlX3J1bm5lcidcbmltcG9ydCBVc2VyQ29kZVJ1bm5lciBmcm9tICcuLi8uLi91c2VyX2NvZGVfcnVubmVyJ1xuaW1wb3J0IFZFcnJvciBmcm9tICd2ZXJyb3InXG5cbmNvbnN0IEVWRU5UUyA9IFtcbiAgJ3Rlc3QtY2FzZS1wcmVwYXJlZCcsXG4gICd0ZXN0LWNhc2Utc3RhcnRlZCcsXG4gICd0ZXN0LXN0ZXAtc3RhcnRlZCcsXG4gICd0ZXN0LXN0ZXAtYXR0YWNobWVudCcsXG4gICd0ZXN0LXN0ZXAtZmluaXNoZWQnLFxuICAndGVzdC1jYXNlLWZpbmlzaGVkJyxcbl1cblxuZnVuY3Rpb24gc2VyaWFsaXplUmVzdWx0RXhjZXB0aW9uSWZOZWNlc3NhcnkoZGF0YSkge1xuICBpZiAoXG4gICAgZGF0YS5yZXN1bHQgJiZcbiAgICBkYXRhLnJlc3VsdC5leGNlcHRpb24gJiZcbiAgICBfLmlzRXJyb3IoZGF0YS5yZXN1bHQuZXhjZXB0aW9uKVxuICApIHtcbiAgICBkYXRhLnJlc3VsdC5leGNlcHRpb24gPSBzZXJpYWxpemVFcnJvcihkYXRhLnJlc3VsdC5leGNlcHRpb24pXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2xhdmUge1xuICBjb25zdHJ1Y3Rvcih7IGN3ZCwgZXhpdCwgc2VuZE1lc3NhZ2UgfSkge1xuICAgIHRoaXMuaW5pdGlhbGl6ZWQgPSBmYWxzZVxuICAgIHRoaXMuY3dkID0gY3dkXG4gICAgdGhpcy5leGl0ID0gZXhpdFxuICAgIHRoaXMuc2VuZE1lc3NhZ2UgPSBzZW5kTWVzc2FnZVxuICAgIHRoaXMuZXZlbnRCcm9hZGNhc3RlciA9IG5ldyBFdmVudEVtaXR0ZXIoKVxuICAgIHRoaXMuc3RhY2tUcmFjZUZpbHRlciA9IG5ldyBTdGFja1RyYWNlRmlsdGVyKClcbiAgICBFVkVOVFMuZm9yRWFjaChuYW1lID0+IHtcbiAgICAgIHRoaXMuZXZlbnRCcm9hZGNhc3Rlci5vbihuYW1lLCBkYXRhID0+IHtcbiAgICAgICAgc2VyaWFsaXplUmVzdWx0RXhjZXB0aW9uSWZOZWNlc3NhcnkoZGF0YSlcbiAgICAgICAgdGhpcy5zZW5kTWVzc2FnZSh7IGNvbW1hbmQ6IGNvbW1hbmRUeXBlcy5FVkVOVCwgbmFtZSwgZGF0YSB9KVxuICAgICAgfSlcbiAgICB9KVxuICB9XG5cbiAgYXN5bmMgaW5pdGlhbGl6ZSh7XG4gICAgZmlsdGVyU3RhY2t0cmFjZXMsXG4gICAgc3VwcG9ydENvZGVSZXF1aXJlZE1vZHVsZXMsXG4gICAgc3VwcG9ydENvZGVQYXRocyxcbiAgICB3b3JsZFBhcmFtZXRlcnMsXG4gIH0pIHtcbiAgICBzdXBwb3J0Q29kZVJlcXVpcmVkTW9kdWxlcy5tYXAobW9kdWxlID0+IHJlcXVpcmUobW9kdWxlKSlcbiAgICBzdXBwb3J0Q29kZUxpYnJhcnlCdWlsZGVyLnJlc2V0KHRoaXMuY3dkKVxuICAgIHN1cHBvcnRDb2RlUGF0aHMuZm9yRWFjaChjb2RlUGF0aCA9PiByZXF1aXJlKGNvZGVQYXRoKSlcbiAgICB0aGlzLnN1cHBvcnRDb2RlTGlicmFyeSA9IHN1cHBvcnRDb2RlTGlicmFyeUJ1aWxkZXIuZmluYWxpemUoKVxuICAgIHRoaXMud29ybGRQYXJhbWV0ZXJzID0gd29ybGRQYXJhbWV0ZXJzXG4gICAgdGhpcy5maWx0ZXJTdGFja3RyYWNlcyA9IGZpbHRlclN0YWNrdHJhY2VzXG4gICAgaWYgKHRoaXMuZmlsdGVyU3RhY2t0cmFjZXMpIHtcbiAgICAgIHRoaXMuc3RhY2tUcmFjZUZpbHRlci5maWx0ZXIoKVxuICAgIH1cbiAgICBhd2FpdCB0aGlzLnJ1blRlc3RSdW5Ib29rcygnYmVmb3JlVGVzdFJ1bkhvb2tEZWZpbml0aW9ucycsICdhIEJlZm9yZUFsbCcpXG4gICAgdGhpcy5zZW5kTWVzc2FnZSh7IGNvbW1hbmQ6IGNvbW1hbmRUeXBlcy5SRUFEWSB9KVxuICB9XG5cbiAgYXN5bmMgZmluYWxpemUoKSB7XG4gICAgYXdhaXQgdGhpcy5ydW5UZXN0UnVuSG9va3MoJ2FmdGVyVGVzdFJ1bkhvb2tEZWZpbml0aW9ucycsICdhbiBBZnRlckFsbCcpXG4gICAgaWYgKHRoaXMuZmlsdGVyU3RhY2t0cmFjZXMpIHtcbiAgICAgIHRoaXMuc3RhY2tUcmFjZUZpbHRlci51bmZpbHRlcigpXG4gICAgfVxuICAgIHRoaXMuZXhpdCgpXG4gIH1cblxuICByZWNlaXZlTWVzc2FnZShtZXNzYWdlKSB7XG4gICAgaWYgKG1lc3NhZ2UuY29tbWFuZCA9PT0gJ2luaXRpYWxpemUnKSB7XG4gICAgICB0aGlzLmluaXRpYWxpemUobWVzc2FnZSlcbiAgICB9IGVsc2UgaWYgKG1lc3NhZ2UuY29tbWFuZCA9PT0gJ2ZpbmFsaXplJykge1xuICAgICAgdGhpcy5maW5hbGl6ZSgpXG4gICAgfSBlbHNlIGlmIChtZXNzYWdlLmNvbW1hbmQgPT09ICdydW4nKSB7XG4gICAgICB0aGlzLnJ1blRlc3RDYXNlKG1lc3NhZ2UpXG4gICAgfVxuICB9XG5cbiAgYXN5bmMgcnVuVGVzdENhc2UoeyB0ZXN0Q2FzZSwgcmV0cmllcywgc2tpcCB9KSB7XG4gICAgY29uc3QgdGVzdENhc2VSdW5uZXIgPSBuZXcgVGVzdENhc2VSdW5uZXIoe1xuICAgICAgZXZlbnRCcm9hZGNhc3RlcjogdGhpcy5ldmVudEJyb2FkY2FzdGVyLFxuICAgICAgcmV0cmllcyxcbiAgICAgIHNraXAsXG4gICAgICBzdXBwb3J0Q29kZUxpYnJhcnk6IHRoaXMuc3VwcG9ydENvZGVMaWJyYXJ5LFxuICAgICAgdGVzdENhc2UsXG4gICAgICB3b3JsZFBhcmFtZXRlcnM6IHRoaXMud29ybGRQYXJhbWV0ZXJzLFxuICAgIH0pXG4gICAgYXdhaXQgdGVzdENhc2VSdW5uZXIucnVuKClcbiAgICB0aGlzLnNlbmRNZXNzYWdlKHsgY29tbWFuZDogY29tbWFuZFR5cGVzLlJFQURZIH0pXG4gIH1cblxuICBhc3luYyBydW5UZXN0UnVuSG9va3Moa2V5LCBuYW1lKSB7XG4gICAgYXdhaXQgUHJvbWlzZS5lYWNoKHRoaXMuc3VwcG9ydENvZGVMaWJyYXJ5W2tleV0sIGFzeW5jIGhvb2tEZWZpbml0aW9uID0+IHtcbiAgICAgIGNvbnN0IHsgZXJyb3IgfSA9IGF3YWl0IFVzZXJDb2RlUnVubmVyLnJ1bih7XG4gICAgICAgIGFyZ3NBcnJheTogW10sXG4gICAgICAgIGZuOiBob29rRGVmaW5pdGlvbi5jb2RlLFxuICAgICAgICB0aGlzQXJnOiBudWxsLFxuICAgICAgICB0aW1lb3V0SW5NaWxsaXNlY29uZHM6XG4gICAgICAgICAgaG9va0RlZmluaXRpb24ub3B0aW9ucy50aW1lb3V0IHx8XG4gICAgICAgICAgdGhpcy5zdXBwb3J0Q29kZUxpYnJhcnkuZGVmYXVsdFRpbWVvdXQsXG4gICAgICB9KVxuICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgIGNvbnN0IGxvY2F0aW9uID0gZm9ybWF0TG9jYXRpb24oaG9va0RlZmluaXRpb24pXG4gICAgICAgIHRocm93IG5ldyBWRXJyb3IoXG4gICAgICAgICAgZXJyb3IsXG4gICAgICAgICAgYCR7bmFtZX0gaG9vayBlcnJvcmVkLCBwcm9jZXNzIGV4aXRpbmc6ICR7bG9jYXRpb259YFxuICAgICAgICApXG4gICAgICB9XG4gICAgfSlcbiAgfVxufVxuIl19