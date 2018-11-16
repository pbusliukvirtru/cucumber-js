'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _helpers = require('./helpers');

var _attachment_manager = require('./attachment_manager');

var _attachment_manager2 = _interopRequireDefault(_attachment_manager);

var _status = require('../status');

var _status2 = _interopRequireDefault(_status);

var _step_runner = require('./step_runner');

var _step_runner2 = _interopRequireDefault(_step_runner);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TestCaseRunner = function () {
  function TestCaseRunner(_ref) {
    var _this = this;

    var eventBroadcaster = _ref.eventBroadcaster,
        _ref$retries = _ref.retries,
        retries = _ref$retries === undefined ? 0 : _ref$retries,
        skip = _ref.skip,
        testCase = _ref.testCase,
        supportCodeLibrary = _ref.supportCodeLibrary,
        worldParameters = _ref.worldParameters;
    (0, _classCallCheck3.default)(this, TestCaseRunner);

    var attachmentManager = new _attachment_manager2.default(function (_ref2) {
      var data = _ref2.data,
          media = _ref2.media;

      if (_this.testStepIndex > _this.maxTestStepIndex) {
        throw new Error('Cannot attach after all steps/hooks have finished running. Ensure your step/hook waits for the attach to finish.');
      }
      _this.emit('test-step-attachment', {
        index: _this.testStepIndex,
        data: data,
        media: media
      });
    });
    this.eventBroadcaster = eventBroadcaster;
    this.maxAttempts = 1 + (skip ? 0 : retries);
    this.skip = skip;
    this.testCase = testCase;
    this.supportCodeLibrary = supportCodeLibrary;
    this.world = new supportCodeLibrary.World({
      attach: attachmentManager.create.bind(attachmentManager),
      parameters: worldParameters
    });
    this.beforeHookDefinitions = this.getBeforeHookDefinitions();
    this.afterHookDefinitions = this.getAfterHookDefinitions();
    this.maxTestStepIndex = this.beforeHookDefinitions.length + this.testCase.pickle.steps.length + this.afterHookDefinitions.length - 1;
    this.testCaseSourceLocation = {
      uri: this.testCase.uri,
      line: this.testCase.pickle.locations[0].line
    };
    this.resetTestProgressData();
  }

  (0, _createClass3.default)(TestCaseRunner, [{
    key: 'resetTestProgressData',
    value: function resetTestProgressData() {
      this.testStepIndex = 0;
      this.result = {
        duration: 0,
        status: this.skip ? _status2.default.SKIPPED : _status2.default.PASSED
      };
    }
  }, {
    key: 'emit',
    value: function emit(name, data) {
      var eventData = (0, _extends3.default)({}, data);
      if (_lodash2.default.startsWith(name, 'test-case')) {
        eventData.sourceLocation = this.testCaseSourceLocation;
      } else {
        eventData.testCase = { sourceLocation: this.testCaseSourceLocation };
      }
      this.eventBroadcaster.emit(name, eventData);
    }
  }, {
    key: 'emitPrepared',
    value: function emitPrepared() {
      var _this2 = this;

      var steps = [];
      this.beforeHookDefinitions.forEach(function (definition) {
        var actionLocation = { uri: definition.uri, line: definition.line };
        steps.push({ actionLocation: actionLocation });
      });
      this.testCase.pickle.steps.forEach(function (step) {
        var actionLocations = _this2.getStepDefinitions(step).map(function (definition) {
          return {
            uri: definition.uri,
            line: definition.line
          };
        });
        var sourceLocation = {
          uri: _this2.testCase.uri,
          line: _lodash2.default.last(step.locations).line
        };
        var data = { sourceLocation: sourceLocation };
        if (actionLocations.length === 1) {
          data.actionLocation = actionLocations[0];
        }
        steps.push(data);
      });
      this.afterHookDefinitions.forEach(function (definition) {
        var actionLocation = { uri: definition.uri, line: definition.line };
        steps.push({ actionLocation: actionLocation });
      });
      this.emit('test-case-prepared', { steps: steps });
    }
  }, {
    key: 'getAfterHookDefinitions',
    value: function getAfterHookDefinitions() {
      var _this3 = this;

      return this.supportCodeLibrary.afterTestCaseHookDefinitions.filter(function (hookDefinition) {
        return hookDefinition.appliesToTestCase(_this3.testCase);
      });
    }
  }, {
    key: 'getBeforeHookDefinitions',
    value: function getBeforeHookDefinitions() {
      var _this4 = this;

      return this.supportCodeLibrary.beforeTestCaseHookDefinitions.filter(function (hookDefinition) {
        return hookDefinition.appliesToTestCase(_this4.testCase);
      });
    }
  }, {
    key: 'getStepDefinitions',
    value: function getStepDefinitions(step) {
      var _this5 = this;

      return this.supportCodeLibrary.stepDefinitions.filter(function (stepDefinition) {
        return stepDefinition.matchesStepName({
          stepName: step.text,
          parameterTypeRegistry: _this5.supportCodeLibrary.parameterTypeRegistry
        });
      });
    }
  }, {
    key: 'invokeStep',
    value: function invokeStep(step, stepDefinition, hookParameter) {
      return _step_runner2.default.run({
        defaultTimeout: this.supportCodeLibrary.defaultTimeout,
        hookParameter: hookParameter,
        parameterTypeRegistry: this.supportCodeLibrary.parameterTypeRegistry,
        step: step,
        stepDefinition: stepDefinition,
        world: this.world
      });
    }
  }, {
    key: 'isSkippingSteps',
    value: function isSkippingSteps() {
      return this.result.status !== _status2.default.PASSED;
    }
  }, {
    key: 'shouldSkipHook',
    value: function shouldSkipHook(isBeforeHook) {
      return this.skip || this.isSkippingSteps() && isBeforeHook;
    }
  }, {
    key: 'shouldUpdateStatus',
    value: function shouldUpdateStatus(testStepResult) {
      switch (testStepResult.status) {
        case _status2.default.FAILED:
        case _status2.default.AMBIGUOUS:
          return this.result.status !== _status2.default.FAILED || this.result.status !== _status2.default.AMBIGUOUS;
        default:
          return this.result.status === _status2.default.PASSED || this.result.status === _status2.default.SKIPPED;
      }
    }
  }, {
    key: 'aroundTestStep',
    value: function () {
      var _ref3 = (0, _bluebird.coroutine)(function* (runStepFn) {
        this.emit('test-step-started', { index: this.testStepIndex });
        var testStepResult = yield runStepFn();
        if (testStepResult.duration) {
          this.result.duration += testStepResult.duration;
        }
        if (this.shouldUpdateStatus(testStepResult)) {
          this.result.status = testStepResult.status;
        }
        if (testStepResult.exception) {
          this.result.exception = testStepResult.exception;
        }
        this.emit('test-step-finished', {
          index: this.testStepIndex,
          result: testStepResult
        });
        this.testStepIndex += 1;
      });

      function aroundTestStep(_x) {
        return _ref3.apply(this, arguments);
      }

      return aroundTestStep;
    }()
  }, {
    key: 'run',
    value: function () {
      var _ref4 = (0, _bluebird.coroutine)(function* () {
        this.emitPrepared();
        for (var attemptNumber = 1; attemptNumber <= this.maxAttempts; attemptNumber++) {
          this.emit('test-case-started', { attemptNumber: attemptNumber });
          yield this.runHooks(this.beforeHookDefinitions, {
            sourceLocation: this.testCaseSourceLocation,
            pickle: this.testCase.pickle
          }, true);
          yield this.runSteps();
          yield this.runHooks(this.afterHookDefinitions, {
            sourceLocation: this.testCaseSourceLocation,
            pickle: this.testCase.pickle,
            result: this.result
          }, false);
          var shouldRetry = this.result.status === _status2.default.FAILED && attemptNumber < this.maxAttempts;
          if (!shouldRetry) {
            this.emit('test-case-finished', { attemptNumber: attemptNumber, result: this.result });
            break;
          }
          this.result.status = _status2.default.RETRY;
          this.emit('test-case-finished', { attemptNumber: attemptNumber, result: this.result });
          this.resetTestProgressData();
        }
        return this.result;
      });

      function run() {
        return _ref4.apply(this, arguments);
      }

      return run;
    }()
  }, {
    key: 'runHook',
    value: function () {
      var _ref5 = (0, _bluebird.coroutine)(function* (hookDefinition, hookParameter, isBeforeHook) {
        if (this.shouldSkipHook(isBeforeHook)) {
          return { status: _status2.default.SKIPPED };
        }
        return this.invokeStep(null, hookDefinition, hookParameter);
      });

      function runHook(_x2, _x3, _x4) {
        return _ref5.apply(this, arguments);
      }

      return runHook;
    }()
  }, {
    key: 'runHooks',
    value: function () {
      var _ref6 = (0, _bluebird.coroutine)(function* (hookDefinitions, hookParameter, isBeforeHook) {
        var _this6 = this;

        yield _bluebird2.default.each(hookDefinitions, function () {
          var _ref7 = (0, _bluebird.coroutine)(function* (hookDefinition) {
            yield _this6.aroundTestStep(function () {
              return _this6.runHook(hookDefinition, hookParameter, isBeforeHook);
            });
          });

          return function (_x8) {
            return _ref7.apply(this, arguments);
          };
        }());
      });

      function runHooks(_x5, _x6, _x7) {
        return _ref6.apply(this, arguments);
      }

      return runHooks;
    }()
  }, {
    key: 'runStep',
    value: function () {
      var _ref8 = (0, _bluebird.coroutine)(function* (step) {
        var stepDefinitions = this.getStepDefinitions(step);
        if (stepDefinitions.length === 0) {
          return { status: _status2.default.UNDEFINED };
        } else if (stepDefinitions.length > 1) {
          return {
            exception: (0, _helpers.getAmbiguousStepException)(stepDefinitions),
            status: _status2.default.AMBIGUOUS
          };
        } else if (this.isSkippingSteps()) {
          return { status: _status2.default.SKIPPED };
        }
        return this.invokeStep(step, stepDefinitions[0]);
      });

      function runStep(_x9) {
        return _ref8.apply(this, arguments);
      }

      return runStep;
    }()
  }, {
    key: 'runSteps',
    value: function () {
      var _ref9 = (0, _bluebird.coroutine)(function* () {
        var _this7 = this;

        yield _bluebird2.default.each(this.testCase.pickle.steps, function () {
          var _ref10 = (0, _bluebird.coroutine)(function* (step) {
            yield _this7.aroundTestStep(function () {
              return _this7.runStep(step);
            });
          });

          return function (_x10) {
            return _ref10.apply(this, arguments);
          };
        }());
      });

      function runSteps() {
        return _ref9.apply(this, arguments);
      }

      return runSteps;
    }()
  }]);
  return TestCaseRunner;
}();

exports.default = TestCaseRunner;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ydW50aW1lL3Rlc3RfY2FzZV9ydW5uZXIuanMiXSwibmFtZXMiOlsiVGVzdENhc2VSdW5uZXIiLCJldmVudEJyb2FkY2FzdGVyIiwicmV0cmllcyIsInNraXAiLCJ0ZXN0Q2FzZSIsInN1cHBvcnRDb2RlTGlicmFyeSIsIndvcmxkUGFyYW1ldGVycyIsImF0dGFjaG1lbnRNYW5hZ2VyIiwiZGF0YSIsIm1lZGlhIiwidGVzdFN0ZXBJbmRleCIsIm1heFRlc3RTdGVwSW5kZXgiLCJFcnJvciIsImVtaXQiLCJpbmRleCIsIm1heEF0dGVtcHRzIiwid29ybGQiLCJXb3JsZCIsImF0dGFjaCIsImNyZWF0ZSIsInBhcmFtZXRlcnMiLCJiZWZvcmVIb29rRGVmaW5pdGlvbnMiLCJnZXRCZWZvcmVIb29rRGVmaW5pdGlvbnMiLCJhZnRlckhvb2tEZWZpbml0aW9ucyIsImdldEFmdGVySG9va0RlZmluaXRpb25zIiwibGVuZ3RoIiwicGlja2xlIiwic3RlcHMiLCJ0ZXN0Q2FzZVNvdXJjZUxvY2F0aW9uIiwidXJpIiwibGluZSIsImxvY2F0aW9ucyIsInJlc2V0VGVzdFByb2dyZXNzRGF0YSIsInJlc3VsdCIsImR1cmF0aW9uIiwic3RhdHVzIiwiU0tJUFBFRCIsIlBBU1NFRCIsIm5hbWUiLCJldmVudERhdGEiLCJzdGFydHNXaXRoIiwic291cmNlTG9jYXRpb24iLCJmb3JFYWNoIiwiYWN0aW9uTG9jYXRpb24iLCJkZWZpbml0aW9uIiwicHVzaCIsImFjdGlvbkxvY2F0aW9ucyIsImdldFN0ZXBEZWZpbml0aW9ucyIsInN0ZXAiLCJtYXAiLCJsYXN0IiwiYWZ0ZXJUZXN0Q2FzZUhvb2tEZWZpbml0aW9ucyIsImZpbHRlciIsImhvb2tEZWZpbml0aW9uIiwiYXBwbGllc1RvVGVzdENhc2UiLCJiZWZvcmVUZXN0Q2FzZUhvb2tEZWZpbml0aW9ucyIsInN0ZXBEZWZpbml0aW9ucyIsInN0ZXBEZWZpbml0aW9uIiwibWF0Y2hlc1N0ZXBOYW1lIiwic3RlcE5hbWUiLCJ0ZXh0IiwicGFyYW1ldGVyVHlwZVJlZ2lzdHJ5IiwiaG9va1BhcmFtZXRlciIsInJ1biIsImRlZmF1bHRUaW1lb3V0IiwiaXNCZWZvcmVIb29rIiwiaXNTa2lwcGluZ1N0ZXBzIiwidGVzdFN0ZXBSZXN1bHQiLCJGQUlMRUQiLCJBTUJJR1VPVVMiLCJydW5TdGVwRm4iLCJzaG91bGRVcGRhdGVTdGF0dXMiLCJleGNlcHRpb24iLCJlbWl0UHJlcGFyZWQiLCJhdHRlbXB0TnVtYmVyIiwicnVuSG9va3MiLCJydW5TdGVwcyIsInNob3VsZFJldHJ5IiwiUkVUUlkiLCJzaG91bGRTa2lwSG9vayIsImludm9rZVN0ZXAiLCJob29rRGVmaW5pdGlvbnMiLCJlYWNoIiwiYXJvdW5kVGVzdFN0ZXAiLCJydW5Ib29rIiwiVU5ERUZJTkVEIiwicnVuU3RlcCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7O0FBQ0E7Ozs7QUFFQTs7OztBQUNBOzs7Ozs7SUFFcUJBLGM7QUFDbkIsZ0NBT0c7QUFBQTs7QUFBQSxRQU5EQyxnQkFNQyxRQU5EQSxnQkFNQztBQUFBLDRCQUxEQyxPQUtDO0FBQUEsUUFMREEsT0FLQyxnQ0FMUyxDQUtUO0FBQUEsUUFKREMsSUFJQyxRQUpEQSxJQUlDO0FBQUEsUUFIREMsUUFHQyxRQUhEQSxRQUdDO0FBQUEsUUFGREMsa0JBRUMsUUFGREEsa0JBRUM7QUFBQSxRQUREQyxlQUNDLFFBRERBLGVBQ0M7QUFBQTs7QUFDRCxRQUFNQyxvQkFBb0IsaUNBQXNCLGlCQUFxQjtBQUFBLFVBQWxCQyxJQUFrQixTQUFsQkEsSUFBa0I7QUFBQSxVQUFaQyxLQUFZLFNBQVpBLEtBQVk7O0FBQ25FLFVBQUksTUFBS0MsYUFBTCxHQUFxQixNQUFLQyxnQkFBOUIsRUFBZ0Q7QUFDOUMsY0FBTSxJQUFJQyxLQUFKLENBQ0osa0hBREksQ0FBTjtBQUdEO0FBQ0QsWUFBS0MsSUFBTCxDQUFVLHNCQUFWLEVBQWtDO0FBQ2hDQyxlQUFPLE1BQUtKLGFBRG9C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S0EsSUFBSSxLQUFLSCxlQUFMLEVBQUosRUFBNEI7QUFDakMsaUJBQU8sRUFBRS9CLFFBQVEsaUJBQU9DLE9BQWpCLEVBQVA7QUFDRDtBQUNELGVBQU8sS0FBSzRDLFVBQUwsQ0FBZ0JoQyxJQUFoQixFQUFzQlEsZ0JBQWdCLENBQWhCLENBQXRCLENBQVA7QUFDRCxPOzs7Ozs7Ozs7Ozt3REFFZ0I7QUFBQTs7QUFDZixjQUFNLG1CQUFRMEIsSUFBUixDQUFhLEtBQUs5RSxRQUFMLENBQWNzQixNQUFkLENBQXFCQyxLQUFsQztBQUFBLGdEQUF5QyxXQUFNcUIsSUFBTixFQUFjO0FBQzNELGtCQUFNLE9BQUttQyxjQUFMLENBQW9CO0FBQUEscUJBQU0sT0FBS0csT0FBTCxDQUFhdEMsSUFBYixDQUFOO0FBQUEsYUFBcEIsQ0FBTjtBQUNELFdBRks7O0FBQUE7QUFBQTtBQUFBO0FBQUEsWUFBTjtBQUdELE87Ozs7Ozs7Ozs7OztrQkE5T2tCaEQsYyIsImZpbGUiOiJ0ZXN0X2Nhc2VfcnVubmVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IF8gZnJvbSAnbG9kYXNoJ1xuaW1wb3J0IHsgZ2V0QW1iaWd1b3VzU3RlcEV4Y2VwdGlvbiB9IGZyb20gJy4vaGVscGVycydcbmltcG9ydCBBdHRhY2htZW50TWFuYWdlciBmcm9tICcuL2F0dGFjaG1lbnRfbWFuYWdlcidcbmltcG9ydCBQcm9taXNlIGZyb20gJ2JsdWViaXJkJ1xuaW1wb3J0IFN0YXR1cyBmcm9tICcuLi9zdGF0dXMnXG5pbXBvcnQgU3RlcFJ1bm5lciBmcm9tICcuL3N0ZXBfcnVubmVyJ1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUZXN0Q2FzZVJ1bm5lciB7XG4gIGNvbnN0cnVjdG9yKHtcbiAgICBldmVudEJyb2FkY2FzdGVyLFxuICAgIHJldHJpZXMgPSAwLFxuICAgIHNraXAsXG4gICAgdGVzdENhc2UsXG4gICAgc3VwcG9ydENvZGVMaWJyYXJ5LFxuICAgIHdvcmxkUGFyYW1ldGVycyxcbiAgfSkge1xuICAgIGNvbnN0IGF0dGFjaG1lbnRNYW5hZ2VyID0gbmV3IEF0dGFjaG1lbnRNYW5hZ2VyKCh7IGRhdGEsIG1lZGlhIH0pID0+IHtcbiAgICAgIGlmICh0aGlzLnRlc3RTdGVwSW5kZXggPiB0aGlzLm1heFRlc3RTdGVwSW5kZXgpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgICdDYW5ub3QgYXR0YWNoIGFmdGVyIGFsbCBzdGVwcy9ob29rcyBoYXZlIGZpbmlzaGVkIHJ1bm5pbmcuIEVuc3VyZSB5b3VyIHN0ZXAvaG9vayB3YWl0cyBmb3IgdGhlIGF0dGFjaCB0byBmaW5pc2guJ1xuICAgICAgICApXG4gICAgICB9XG4gICAgICB0aGlzLmVtaXQoJ3Rlc3Qtc3RlcC1hdHRhY2htZW50Jywge1xuICAgICAgICBpbmRleDogdGhpcy50ZXN0U3RlcEluZGV4LFxuICAgICAgICBkYXRhLFxuICAgICAgICBtZWRpYSxcbiAgICAgIH0pXG4gICAgfSlcbiAgICB0aGlzLmV2ZW50QnJvYWRjYXN0ZXIgPSBldmVudEJyb2FkY2FzdGVyXG4gICAgdGhpcy5tYXhBdHRlbXB0cyA9IDEgKyAoc2tpcCA/IDAgOiByZXRyaWVzKVxuICAgIHRoaXMuc2tpcCA9IHNraXBcbiAgICB0aGlzLnRlc3RDYXNlID0gdGVzdENhc2VcbiAgICB0aGlzLnN1cHBvcnRDb2RlTGlicmFyeSA9IHN1cHBvcnRDb2RlTGlicmFyeVxuICAgIHRoaXMud29ybGQgPSBuZXcgc3VwcG9ydENvZGVMaWJyYXJ5LldvcmxkKHtcbiAgICAgIGF0dGFjaDogOjphdHRhY2htZW50TWFuYWdlci5jcmVhdGUsXG4gICAgICBwYXJhbWV0ZXJzOiB3b3JsZFBhcmFtZXRlcnMsXG4gICAgfSlcbiAgICB0aGlzLmJlZm9yZUhvb2tEZWZpbml0aW9ucyA9IHRoaXMuZ2V0QmVmb3JlSG9va0RlZmluaXRpb25zKClcbiAgICB0aGlzLmFmdGVySG9va0RlZmluaXRpb25zID0gdGhpcy5nZXRBZnRlckhvb2tEZWZpbml0aW9ucygpXG4gICAgdGhpcy5tYXhUZXN0U3RlcEluZGV4ID1cbiAgICAgIHRoaXMuYmVmb3JlSG9va0RlZmluaXRpb25zLmxlbmd0aCArXG4gICAgICB0aGlzLnRlc3RDYXNlLnBpY2tsZS5zdGVwcy5sZW5ndGggK1xuICAgICAgdGhpcy5hZnRlckhvb2tEZWZpbml0aW9ucy5sZW5ndGggLVxuICAgICAgMVxuICAgIHRoaXMudGVzdENhc2VTb3VyY2VMb2NhdGlvbiA9IHtcbiAgICAgIHVyaTogdGhpcy50ZXN0Q2FzZS51cmksXG4gICAgICBsaW5lOiB0aGlzLnRlc3RDYXNlLnBpY2tsZS5sb2NhdGlvbnNbMF0ubGluZSxcbiAgICB9XG4gICAgdGhpcy5yZXNldFRlc3RQcm9ncmVzc0RhdGEoKVxuICB9XG5cbiAgcmVzZXRUZXN0UHJvZ3Jlc3NEYXRhKCkge1xuICAgIHRoaXMudGVzdFN0ZXBJbmRleCA9IDBcbiAgICB0aGlzLnJlc3VsdCA9IHtcbiAgICAgIGR1cmF0aW9uOiAwLFxuICAgICAgc3RhdHVzOiB0aGlzLnNraXAgPyBTdGF0dXMuU0tJUFBFRCA6IFN0YXR1cy5QQVNTRUQsXG4gICAgfVxuICB9XG5cbiAgZW1pdChuYW1lLCBkYXRhKSB7XG4gICAgY29uc3QgZXZlbnREYXRhID0geyAuLi5kYXRhIH1cbiAgICBpZiAoXy5zdGFydHNXaXRoKG5hbWUsICd0ZXN0LWNhc2UnKSkge1xuICAgICAgZXZlbnREYXRhLnNvdXJjZUxvY2F0aW9uID0gdGhpcy50ZXN0Q2FzZVNvdXJjZUxvY2F0aW9uXG4gICAgfSBlbHNlIHtcbiAgICAgIGV2ZW50RGF0YS50ZXN0Q2FzZSA9IHsgc291cmNlTG9jYXRpb246IHRoaXMudGVzdENhc2VTb3VyY2VMb2NhdGlvbiB9XG4gICAgfVxuICAgIHRoaXMuZXZlbnRCcm9hZGNhc3Rlci5lbWl0KG5hbWUsIGV2ZW50RGF0YSlcbiAgfVxuXG4gIGVtaXRQcmVwYXJlZCgpIHtcbiAgICBjb25zdCBzdGVwcyA9IFtdXG4gICAgdGhpcy5iZWZvcmVIb29rRGVmaW5pdGlvbnMuZm9yRWFjaChkZWZpbml0aW9uID0+IHtcbiAgICAgIGNvbnN0IGFjdGlvbkxvY2F0aW9uID0geyB1cmk6IGRlZmluaXRpb24udXJpLCBsaW5lOiBkZWZpbml0aW9uLmxpbmUgfVxuICAgICAgc3RlcHMucHVzaCh7IGFjdGlvbkxvY2F0aW9uIH0pXG4gICAgfSlcbiAgICB0aGlzLnRlc3RDYXNlLnBpY2tsZS5zdGVwcy5mb3JFYWNoKHN0ZXAgPT4ge1xuICAgICAgY29uc3QgYWN0aW9uTG9jYXRpb25zID0gdGhpcy5nZXRTdGVwRGVmaW5pdGlvbnMoc3RlcCkubWFwKGRlZmluaXRpb24gPT4gKHtcbiAgICAgICAgdXJpOiBkZWZpbml0aW9uLnVyaSxcbiAgICAgICAgbGluZTogZGVmaW5pdGlvbi5saW5lLFxuICAgICAgfSkpXG4gICAgICBjb25zdCBzb3VyY2VMb2NhdGlvbiA9IHtcbiAgICAgICAgdXJpOiB0aGlzLnRlc3RDYXNlLnVyaSxcbiAgICAgICAgbGluZTogXy5sYXN0KHN0ZXAubG9jYXRpb25zKS5saW5lLFxuICAgICAgfVxuICAgICAgY29uc3QgZGF0YSA9IHsgc291cmNlTG9jYXRpb24gfVxuICAgICAgaWYgKGFjdGlvbkxvY2F0aW9ucy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgZGF0YS5hY3Rpb25Mb2NhdGlvbiA9IGFjdGlvbkxvY2F0aW9uc1swXVxuICAgICAgfVxuICAgICAgc3RlcHMucHVzaChkYXRhKVxuICAgIH0pXG4gICAgdGhpcy5hZnRlckhvb2tEZWZpbml0aW9ucy5mb3JFYWNoKGRlZmluaXRpb24gPT4ge1xuICAgICAgY29uc3QgYWN0aW9uTG9jYXRpb24gPSB7IHVyaTogZGVmaW5pdGlvbi51cmksIGxpbmU6IGRlZmluaXRpb24ubGluZSB9XG4gICAgICBzdGVwcy5wdXNoKHsgYWN0aW9uTG9jYXRpb24gfSlcbiAgICB9KVxuICAgIHRoaXMuZW1pdCgndGVzdC1jYXNlLXByZXBhcmVkJywgeyBzdGVwcyB9KVxuICB9XG5cbiAgZ2V0QWZ0ZXJIb29rRGVmaW5pdGlvbnMoKSB7XG4gICAgcmV0dXJuIHRoaXMuc3VwcG9ydENvZGVMaWJyYXJ5LmFmdGVyVGVzdENhc2VIb29rRGVmaW5pdGlvbnMuZmlsdGVyKFxuICAgICAgaG9va0RlZmluaXRpb24gPT4gaG9va0RlZmluaXRpb24uYXBwbGllc1RvVGVzdENhc2UodGhpcy50ZXN0Q2FzZSlcbiAgICApXG4gIH1cblxuICBnZXRCZWZvcmVIb29rRGVmaW5pdGlvbnMoKSB7XG4gICAgcmV0dXJuIHRoaXMuc3VwcG9ydENvZGVMaWJyYXJ5LmJlZm9yZVRlc3RDYXNlSG9va0RlZmluaXRpb25zLmZpbHRlcihcbiAgICAgIGhvb2tEZWZpbml0aW9uID0+IGhvb2tEZWZpbml0aW9uLmFwcGxpZXNUb1Rlc3RDYXNlKHRoaXMudGVzdENhc2UpXG4gICAgKVxuICB9XG5cbiAgZ2V0U3RlcERlZmluaXRpb25zKHN0ZXApIHtcbiAgICByZXR1cm4gdGhpcy5zdXBwb3J0Q29kZUxpYnJhcnkuc3RlcERlZmluaXRpb25zLmZpbHRlcihzdGVwRGVmaW5pdGlvbiA9PlxuICAgICAgc3RlcERlZmluaXRpb24ubWF0Y2hlc1N0ZXBOYW1lKHtcbiAgICAgICAgc3RlcE5hbWU6IHN0ZXAudGV4dCxcbiAgICAgICAgcGFyYW1ldGVyVHlwZVJlZ2lzdHJ5OiB0aGlzLnN1cHBvcnRDb2RlTGlicmFyeS5wYXJhbWV0ZXJUeXBlUmVnaXN0cnksXG4gICAgICB9KVxuICAgIClcbiAgfVxuXG4gIGludm9rZVN0ZXAoc3RlcCwgc3RlcERlZmluaXRpb24sIGhvb2tQYXJhbWV0ZXIpIHtcbiAgICByZXR1cm4gU3RlcFJ1bm5lci5ydW4oe1xuICAgICAgZGVmYXVsdFRpbWVvdXQ6IHRoaXMuc3VwcG9ydENvZGVMaWJyYXJ5LmRlZmF1bHRUaW1lb3V0LFxuICAgICAgaG9va1BhcmFtZXRlcixcbiAgICAgIHBhcmFtZXRlclR5cGVSZWdpc3RyeTogdGhpcy5zdXBwb3J0Q29kZUxpYnJhcnkucGFyYW1ldGVyVHlwZVJlZ2lzdHJ5LFxuICAgICAgc3RlcCxcbiAgICAgIHN0ZXBEZWZpbml0aW9uLFxuICAgICAgd29ybGQ6IHRoaXMud29ybGQsXG4gICAgfSlcbiAgfVxuXG4gIGlzU2tpcHBpbmdTdGVwcygpIHtcbiAgICByZXR1cm4gdGhpcy5yZXN1bHQuc3RhdHVzICE9PSBTdGF0dXMuUEFTU0VEXG4gIH1cblxuICBzaG91bGRTa2lwSG9vayhpc0JlZm9yZUhvb2spIHtcbiAgICByZXR1cm4gdGhpcy5za2lwIHx8ICh0aGlzLmlzU2tpcHBpbmdTdGVwcygpICYmIGlzQmVmb3JlSG9vaylcbiAgfVxuXG4gIHNob3VsZFVwZGF0ZVN0YXR1cyh0ZXN0U3RlcFJlc3VsdCkge1xuICAgIHN3aXRjaCAodGVzdFN0ZXBSZXN1bHQuc3RhdHVzKSB7XG4gICAgICBjYXNlIFN0YXR1cy5GQUlMRUQ6XG4gICAgICBjYXNlIFN0YXR1cy5BTUJJR1VPVVM6XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgdGhpcy5yZXN1bHQuc3RhdHVzICE9PSBTdGF0dXMuRkFJTEVEIHx8XG4gICAgICAgICAgdGhpcy5yZXN1bHQuc3RhdHVzICE9PSBTdGF0dXMuQU1CSUdVT1VTXG4gICAgICAgIClcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgdGhpcy5yZXN1bHQuc3RhdHVzID09PSBTdGF0dXMuUEFTU0VEIHx8XG4gICAgICAgICAgdGhpcy5yZXN1bHQuc3RhdHVzID09PSBTdGF0dXMuU0tJUFBFRFxuICAgICAgICApXG4gICAgfVxuICB9XG5cbiAgYXN5bmMgYXJvdW5kVGVzdFN0ZXAocnVuU3RlcEZuKSB7XG4gICAgdGhpcy5lbWl0KCd0ZXN0LXN0ZXAtc3RhcnRlZCcsIHsgaW5kZXg6IHRoaXMudGVzdFN0ZXBJbmRleCB9KVxuICAgIGNvbnN0IHRlc3RTdGVwUmVzdWx0ID0gYXdhaXQgcnVuU3RlcEZuKClcbiAgICBpZiAodGVzdFN0ZXBSZXN1bHQuZHVyYXRpb24pIHtcbiAgICAgIHRoaXMucmVzdWx0LmR1cmF0aW9uICs9IHRlc3RTdGVwUmVzdWx0LmR1cmF0aW9uXG4gICAgfVxuICAgIGlmICh0aGlzLnNob3VsZFVwZGF0ZVN0YXR1cyh0ZXN0U3RlcFJlc3VsdCkpIHtcbiAgICAgIHRoaXMucmVzdWx0LnN0YXR1cyA9IHRlc3RTdGVwUmVzdWx0LnN0YXR1c1xuICAgIH1cbiAgICBpZiAodGVzdFN0ZXBSZXN1bHQuZXhjZXB0aW9uKSB7XG4gICAgICB0aGlzLnJlc3VsdC5leGNlcHRpb24gPSB0ZXN0U3RlcFJlc3VsdC5leGNlcHRpb25cbiAgICB9XG4gICAgdGhpcy5lbWl0KCd0ZXN0LXN0ZXAtZmluaXNoZWQnLCB7XG4gICAgICBpbmRleDogdGhpcy50ZXN0U3RlcEluZGV4LFxuICAgICAgcmVzdWx0OiB0ZXN0U3RlcFJlc3VsdCxcbiAgICB9KVxuICAgIHRoaXMudGVzdFN0ZXBJbmRleCArPSAxXG4gIH1cblxuICBhc3luYyBydW4oKSB7XG4gICAgdGhpcy5lbWl0UHJlcGFyZWQoKVxuICAgIGZvciAoXG4gICAgICBsZXQgYXR0ZW1wdE51bWJlciA9IDE7XG4gICAgICBhdHRlbXB0TnVtYmVyIDw9IHRoaXMubWF4QXR0ZW1wdHM7XG4gICAgICBhdHRlbXB0TnVtYmVyKytcbiAgICApIHtcbiAgICAgIHRoaXMuZW1pdCgndGVzdC1jYXNlLXN0YXJ0ZWQnLCB7IGF0dGVtcHROdW1iZXIgfSlcbiAgICAgIGF3YWl0IHRoaXMucnVuSG9va3MoXG4gICAgICAgIHRoaXMuYmVmb3JlSG9va0RlZmluaXRpb25zLFxuICAgICAgICB7XG4gICAgICAgICAgc291cmNlTG9jYXRpb246IHRoaXMudGVzdENhc2VTb3VyY2VMb2NhdGlvbixcbiAgICAgICAgICBwaWNrbGU6IHRoaXMudGVzdENhc2UucGlja2xlLFxuICAgICAgICB9LFxuICAgICAgICB0cnVlXG4gICAgICApXG4gICAgICBhd2FpdCB0aGlzLnJ1blN0ZXBzKClcbiAgICAgIGF3YWl0IHRoaXMucnVuSG9va3MoXG4gICAgICAgIHRoaXMuYWZ0ZXJIb29rRGVmaW5pdGlvbnMsXG4gICAgICAgIHtcbiAgICAgICAgICBzb3VyY2VMb2NhdGlvbjogdGhpcy50ZXN0Q2FzZVNvdXJjZUxvY2F0aW9uLFxuICAgICAgICAgIHBpY2tsZTogdGhpcy50ZXN0Q2FzZS5waWNrbGUsXG4gICAgICAgICAgcmVzdWx0OiB0aGlzLnJlc3VsdCxcbiAgICAgICAgfSxcbiAgICAgICAgZmFsc2VcbiAgICAgIClcbiAgICAgIGNvbnN0IHNob3VsZFJldHJ5ID1cbiAgICAgICAgdGhpcy5yZXN1bHQuc3RhdHVzID09PSBTdGF0dXMuRkFJTEVEICYmIGF0dGVtcHROdW1iZXIgPCB0aGlzLm1heEF0dGVtcHRzXG4gICAgICBpZiAoIXNob3VsZFJldHJ5KSB7XG4gICAgICAgIHRoaXMuZW1pdCgndGVzdC1jYXNlLWZpbmlzaGVkJywgeyBhdHRlbXB0TnVtYmVyLCByZXN1bHQ6IHRoaXMucmVzdWx0IH0pXG4gICAgICAgIGJyZWFrXG4gICAgICB9XG4gICAgICB0aGlzLnJlc3VsdC5zdGF0dXMgPSBTdGF0dXMuUkVUUllcbiAgICAgIHRoaXMuZW1pdCgndGVzdC1jYXNlLWZpbmlzaGVkJywgeyBhdHRlbXB0TnVtYmVyLCByZXN1bHQ6IHRoaXMucmVzdWx0IH0pXG4gICAgICB0aGlzLnJlc2V0VGVzdFByb2dyZXNzRGF0YSgpXG4gICAgfVxuICAgIHJldHVybiB0aGlzLnJlc3VsdFxuICB9XG5cbiAgYXN5bmMgcnVuSG9vayhob29rRGVmaW5pdGlvbiwgaG9va1BhcmFtZXRlciwgaXNCZWZvcmVIb29rKSB7XG4gICAgaWYgKHRoaXMuc2hvdWxkU2tpcEhvb2soaXNCZWZvcmVIb29rKSkge1xuICAgICAgcmV0dXJuIHsgc3RhdHVzOiBTdGF0dXMuU0tJUFBFRCB9XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmludm9rZVN0ZXAobnVsbCwgaG9va0RlZmluaXRpb24sIGhvb2tQYXJhbWV0ZXIpXG4gIH1cblxuICBhc3luYyBydW5Ib29rcyhob29rRGVmaW5pdGlvbnMsIGhvb2tQYXJhbWV0ZXIsIGlzQmVmb3JlSG9vaykge1xuICAgIGF3YWl0IFByb21pc2UuZWFjaChob29rRGVmaW5pdGlvbnMsIGFzeW5jIGhvb2tEZWZpbml0aW9uID0+IHtcbiAgICAgIGF3YWl0IHRoaXMuYXJvdW5kVGVzdFN0ZXAoKCkgPT5cbiAgICAgICAgdGhpcy5ydW5Ib29rKGhvb2tEZWZpbml0aW9uLCBob29rUGFyYW1ldGVyLCBpc0JlZm9yZUhvb2spXG4gICAgICApXG4gICAgfSlcbiAgfVxuXG4gIGFzeW5jIHJ1blN0ZXAoc3RlcCkge1xuICAgIGNvbnN0IHN0ZXBEZWZpbml0aW9ucyA9IHRoaXMuZ2V0U3RlcERlZmluaXRpb25zKHN0ZXApXG4gICAgaWYgKHN0ZXBEZWZpbml0aW9ucy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiB7IHN0YXR1czogU3RhdHVzLlVOREVGSU5FRCB9XG4gICAgfSBlbHNlIGlmIChzdGVwRGVmaW5pdGlvbnMubGVuZ3RoID4gMSkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgZXhjZXB0aW9uOiBnZXRBbWJpZ3VvdXNTdGVwRXhjZXB0aW9uKHN0ZXBEZWZpbml0aW9ucyksXG4gICAgICAgIHN0YXR1czogU3RhdHVzLkFNQklHVU9VUyxcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHRoaXMuaXNTa2lwcGluZ1N0ZXBzKCkpIHtcbiAgICAgIHJldHVybiB7IHN0YXR1czogU3RhdHVzLlNLSVBQRUQgfVxuICAgIH1cbiAgICByZXR1cm4gdGhpcy5pbnZva2VTdGVwKHN0ZXAsIHN0ZXBEZWZpbml0aW9uc1swXSlcbiAgfVxuXG4gIGFzeW5jIHJ1blN0ZXBzKCkge1xuICAgIGF3YWl0IFByb21pc2UuZWFjaCh0aGlzLnRlc3RDYXNlLnBpY2tsZS5zdGVwcywgYXN5bmMgc3RlcCA9PiB7XG4gICAgICBhd2FpdCB0aGlzLmFyb3VuZFRlc3RTdGVwKCgpID0+IHRoaXMucnVuU3RlcChzdGVwKSlcbiAgICB9KVxuICB9XG59XG4iXX0=