'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _helpers = require('./helpers');

var _ = require('./');

var _2 = _interopRequireDefault(_);

var _progress = require('progress');

var _progress2 = _interopRequireDefault(_progress);

var _lib = require('../../lib');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Inspired by https://github.com/thekompanee/fuubar and https://github.com/martinciu/fuubar-cucumber
var ProgressBarFormatter = function (_Formatter) {
  (0, _inherits3.default)(ProgressBarFormatter, _Formatter);

  function ProgressBarFormatter(options) {
    (0, _classCallCheck3.default)(this, ProgressBarFormatter);

    var _this = (0, _possibleConstructorReturn3.default)(this, (ProgressBarFormatter.__proto__ || Object.getPrototypeOf(ProgressBarFormatter)).call(this, options));

    options.eventBroadcaster.on('pickle-accepted', _this.incrementStepCount.bind(_this)).once('test-case-started', _this.initializeProgressBar.bind(_this)).on('test-step-finished', _this.logProgress.bind(_this)).on('test-case-finished', _this.logErrorIfNeeded.bind(_this)).on('test-run-finished', _this.logSummary.bind(_this));
    _this.numberOfSteps = 0;
    _this.issueCount = 0;
    return _this;
  }

  (0, _createClass3.default)(ProgressBarFormatter, [{
    key: 'incrementStepCount',
    value: function incrementStepCount(_ref) {
      var pickle = _ref.pickle;

      this.numberOfSteps += pickle.steps.length;
    }
  }, {
    key: 'initializeProgressBar',
    value: function initializeProgressBar() {
      this.progressBar = new _progress2.default(':current/:total steps [:bar] ', {
        clear: true,
        incomplete: ' ',
        stream: this.stream,
        total: this.numberOfSteps,
        width: this.stream.columns || 80
      });
    }
  }, {
    key: 'logProgress',
    value: function logProgress(_ref2) {
      var index = _ref2.index,
          sourceLocation = _ref2.testCase.sourceLocation;

      var _eventDataCollector$g = this.eventDataCollector.getTestCaseData(sourceLocation),
          testCase = _eventDataCollector$g.testCase;

      if (testCase.steps[index].sourceLocation) {
        this.progressBar.tick();
      }
    }
  }, {
    key: 'logErrorIfNeeded',
    value: function logErrorIfNeeded(_ref3) {
      var sourceLocation = _ref3.sourceLocation,
          result = _ref3.result;

      var status = result.status;
      var shouldLog = (0, _helpers.isIssue)(status) || status === _lib.Status.RETRY;
      if (shouldLog) {
        this.issueCount += 1;

        var _eventDataCollector$g2 = this.eventDataCollector.getTestCaseData(sourceLocation),
            gherkinDocument = _eventDataCollector$g2.gherkinDocument,
            pickle = _eventDataCollector$g2.pickle,
            testCase = _eventDataCollector$g2.testCase;

        this.progressBar.interrupt((0, _helpers.formatIssue)({
          colorFns: this.colorFns,
          gherkinDocument: gherkinDocument,
          number: this.issueCount,
          pickle: pickle,
          snippetBuilder: this.snippetBuilder,
          testCase: testCase
        }));
      }
    }
  }, {
    key: 'logSummary',
    value: function logSummary(testRun) {
      this.log((0, _helpers.formatSummary)({
        colorFns: this.colorFns,
        testCaseMap: this.eventDataCollector.testCaseMap,
        testRun: testRun
      }));
    }
  }]);
  return ProgressBarFormatter;
}(_2.default);

exports.default = ProgressBarFormatter;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9mb3JtYXR0ZXIvcHJvZ3Jlc3NfYmFyX2Zvcm1hdHRlci5qcyJdLCJuYW1lcyI6WyJQcm9ncmVzc0JhckZvcm1hdHRlciIsIm9wdGlvbnMiLCJldmVudEJyb2FkY2FzdGVyIiwib24iLCJpbmNyZW1lbnRTdGVwQ291bnQiLCJvbmNlIiwiaW5pdGlhbGl6ZVByb2dyZXNzQmFyIiwibG9nUHJvZ3Jlc3MiLCJsb2dFcnJvcklmTmVlZGVkIiwibG9nU3VtbWFyeSIsIm51bWJlck9mU3RlcHMiLCJpc3N1ZUNvdW50IiwicGlja2xlIiwic3RlcHMiLCJsZW5ndGgiLCJwcm9ncmVzc0JhciIsImNsZWFyIiwiaW5jb21wbGV0ZSIsInN0cmVhbSIsInRvdGFsIiwid2lkdGgiLCJjb2x1bW5zIiwiaW5kZXgiLCJzb3VyY2VMb2NhdGlvbiIsInRlc3RDYXNlIiwiZXZlbnREYXRhQ29sbGVjdG9yIiwiZ2V0VGVzdENhc2VEYXRhIiwidGljayIsInJlc3VsdCIsInN0YXR1cyIsInNob3VsZExvZyIsIlJFVFJZIiwiZ2hlcmtpbkRvY3VtZW50IiwiaW50ZXJydXB0IiwiY29sb3JGbnMiLCJudW1iZXIiLCJzbmlwcGV0QnVpbGRlciIsInRlc3RSdW4iLCJsb2ciLCJ0ZXN0Q2FzZU1hcCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUVBO0lBQ3FCQSxvQjs7O0FBQ25CLGdDQUFZQyxPQUFaLEVBQXFCO0FBQUE7O0FBQUEsMEpBQ2JBLE9BRGE7O0FBRW5CQSxZQUFRQyxnQkFBUixDQUNHQyxFQURILENBQ00saUJBRE4sRUFDMkIsTUFBS0Msa0JBRGhDLGNBRUdDLElBRkgsQ0FFUSxtQkFGUixFQUUrQixNQUFLQyxxQkFGcEMsY0FHR0gsRUFISCxDQUdNLG9CQUhOLEVBRzhCLE1BQUtJLFdBSG5DLGNBSUdKLEVBSkgsQ0FJTSxvQkFKTixFQUk4QixNQUFLSyxnQkFKbkMsY0FLR0wsRUFMSCxDQUtNLG1CQUxOLEVBSzZCLE1BQUtNLFVBTGxDO0FBTUEsVUFBS0MsYUFBTCxHQUFxQixDQUFyQjtBQUNBLFVBQUtDLFVBQUwsR0FBa0IsQ0FBbEI7QUFUbUI7QUFVcEI7Ozs7NkNBRThCO0FBQUEsVUFBVkMsTUFBVSxRQUFWQSxNQUFVOztBQUM3QixXQUFLRixhQUFMLElBQXNCRSxPQUFPQyxLQUFQLENBQWFDLE1BQW5DO0FBQ0Q7Ozs0Q0FFdUI7QUFDdEIsV0FBS0MsV0FBTCxHQUFtQix1QkFBZ0IsK0JBQWhCLEVBQWlEO0FBQ2xFQyxlQUFPLElBRDJEO0FBRWxFQyxvQkFBWSxHQUZzRDtBQUdsRUMsZ0JBQVEsS0FBS0EsTUFIcUQ7QUFJbEVDLGVBQU8sS0FBS1QsYUFKc0Q7QUFLbEVVLGVBQU8sS0FBS0YsTUFBTCxDQUFZRyxPQUFaLElBQXVCO0FBTG9DLE9BQWpELENBQW5CO0FBT0Q7Ozt1Q0FFb0Q7QUFBQSxVQUF2Q0MsS0FBdUMsU0FBdkNBLEtBQXVDO0FBQUEsVUFBcEJDLGNBQW9CLFNBQWhDQyxRQUFnQyxDQUFwQkQsY0FBb0I7O0FBQUEsa0NBQzlCLEtBQUtFLGtCQUFMLENBQXdCQyxlQUF4QixDQUF3Q0gsY0FBeEMsQ0FEOEI7QUFBQSxVQUMzQ0MsUUFEMkMseUJBQzNDQSxRQUQyQzs7QUFFbkQsVUFBSUEsU0FBU1gsS0FBVCxDQUFlUyxLQUFmLEVBQXNCQyxjQUExQixFQUEwQztBQUN4QyxhQUFLUixXQUFMLENBQWlCWSxJQUFqQjtBQUNEO0FBQ0Y7Ozs0Q0FFNEM7QUFBQSxVQUExQkosY0FBMEIsU0FBMUJBLGNBQTBCO0FBQUEsVUFBVkssTUFBVSxTQUFWQSxNQUFVOztBQUMzQyxVQUFNQyxTQUFTRCxPQUFPQyxNQUF0QjtBQUNBLFVBQU1DLFlBQVksc0JBQVFELE1BQVIsS0FBbUJBLFdBQVcsWUFBT0UsS0FBdkQ7QUFDQSxVQUFJRCxTQUFKLEVBQWU7QUFDYixhQUFLbkIsVUFBTCxJQUFtQixDQUFuQjs7QUFEYSxxQ0FNVCxLQUFLYyxrQkFBTCxDQUF3QkMsZUFBeEIsQ0FBd0NILGNBQXhDLENBTlM7QUFBQSxZQUdYUyxlQUhXLDBCQUdYQSxlQUhXO0FBQUEsWUFJWHBCLE1BSlcsMEJBSVhBLE1BSlc7QUFBQSxZQUtYWSxRQUxXLDBCQUtYQSxRQUxXOztBQU9iLGFBQUtULFdBQUwsQ0FBaUJrQixTQUFqQixDQUNFLDBCQUFZO0FBQ1ZDLG9CQUFVLEtBQUtBLFFBREw7QUFFVkYsMENBRlU7QUFHVkcsa0JBQVEsS0FBS3hCLFVBSEg7QUFJVkMsd0JBSlU7QUFLVndCLDBCQUFnQixLQUFLQSxjQUxYO0FBTVZaO0FBTlUsU0FBWixDQURGO0FBVUQ7QUFDRjs7OytCQUVVYSxPLEVBQVM7QUFDbEIsV0FBS0MsR0FBTCxDQUNFLDRCQUFjO0FBQ1pKLGtCQUFVLEtBQUtBLFFBREg7QUFFWksscUJBQWEsS0FBS2Qsa0JBQUwsQ0FBd0JjLFdBRnpCO0FBR1pGO0FBSFksT0FBZCxDQURGO0FBT0Q7Ozs7O2tCQWpFa0JyQyxvQiIsImZpbGUiOiJwcm9ncmVzc19iYXJfZm9ybWF0dGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZm9ybWF0SXNzdWUsIGZvcm1hdFN1bW1hcnksIGlzSXNzdWUgfSBmcm9tICcuL2hlbHBlcnMnXG5pbXBvcnQgRm9ybWF0dGVyIGZyb20gJy4vJ1xuaW1wb3J0IFByb2dyZXNzQmFyIGZyb20gJ3Byb2dyZXNzJ1xuaW1wb3J0IHsgU3RhdHVzIH0gZnJvbSAnLi4vLi4vbGliJ1xuXG4vLyBJbnNwaXJlZCBieSBodHRwczovL2dpdGh1Yi5jb20vdGhla29tcGFuZWUvZnV1YmFyIGFuZCBodHRwczovL2dpdGh1Yi5jb20vbWFydGluY2l1L2Z1dWJhci1jdWN1bWJlclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUHJvZ3Jlc3NCYXJGb3JtYXR0ZXIgZXh0ZW5kcyBGb3JtYXR0ZXIge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgc3VwZXIob3B0aW9ucylcbiAgICBvcHRpb25zLmV2ZW50QnJvYWRjYXN0ZXJcbiAgICAgIC5vbigncGlja2xlLWFjY2VwdGVkJywgOjp0aGlzLmluY3JlbWVudFN0ZXBDb3VudClcbiAgICAgIC5vbmNlKCd0ZXN0LWNhc2Utc3RhcnRlZCcsIDo6dGhpcy5pbml0aWFsaXplUHJvZ3Jlc3NCYXIpXG4gICAgICAub24oJ3Rlc3Qtc3RlcC1maW5pc2hlZCcsIDo6dGhpcy5sb2dQcm9ncmVzcylcbiAgICAgIC5vbigndGVzdC1jYXNlLWZpbmlzaGVkJywgOjp0aGlzLmxvZ0Vycm9ySWZOZWVkZWQpXG4gICAgICAub24oJ3Rlc3QtcnVuLWZpbmlzaGVkJywgOjp0aGlzLmxvZ1N1bW1hcnkpXG4gICAgdGhpcy5udW1iZXJPZlN0ZXBzID0gMFxuICAgIHRoaXMuaXNzdWVDb3VudCA9IDBcbiAgfVxuXG4gIGluY3JlbWVudFN0ZXBDb3VudCh7IHBpY2tsZSB9KSB7XG4gICAgdGhpcy5udW1iZXJPZlN0ZXBzICs9IHBpY2tsZS5zdGVwcy5sZW5ndGhcbiAgfVxuXG4gIGluaXRpYWxpemVQcm9ncmVzc0JhcigpIHtcbiAgICB0aGlzLnByb2dyZXNzQmFyID0gbmV3IFByb2dyZXNzQmFyKCc6Y3VycmVudC86dG90YWwgc3RlcHMgWzpiYXJdICcsIHtcbiAgICAgIGNsZWFyOiB0cnVlLFxuICAgICAgaW5jb21wbGV0ZTogJyAnLFxuICAgICAgc3RyZWFtOiB0aGlzLnN0cmVhbSxcbiAgICAgIHRvdGFsOiB0aGlzLm51bWJlck9mU3RlcHMsXG4gICAgICB3aWR0aDogdGhpcy5zdHJlYW0uY29sdW1ucyB8fCA4MCxcbiAgICB9KVxuICB9XG5cbiAgbG9nUHJvZ3Jlc3MoeyBpbmRleCwgdGVzdENhc2U6IHsgc291cmNlTG9jYXRpb24gfSB9KSB7XG4gICAgY29uc3QgeyB0ZXN0Q2FzZSB9ID0gdGhpcy5ldmVudERhdGFDb2xsZWN0b3IuZ2V0VGVzdENhc2VEYXRhKHNvdXJjZUxvY2F0aW9uKVxuICAgIGlmICh0ZXN0Q2FzZS5zdGVwc1tpbmRleF0uc291cmNlTG9jYXRpb24pIHtcbiAgICAgIHRoaXMucHJvZ3Jlc3NCYXIudGljaygpXG4gICAgfVxuICB9XG5cbiAgbG9nRXJyb3JJZk5lZWRlZCh7IHNvdXJjZUxvY2F0aW9uLCByZXN1bHQgfSkge1xuICAgIGNvbnN0IHN0YXR1cyA9IHJlc3VsdC5zdGF0dXNcbiAgICBjb25zdCBzaG91bGRMb2cgPSBpc0lzc3VlKHN0YXR1cykgfHwgc3RhdHVzID09PSBTdGF0dXMuUkVUUllcbiAgICBpZiAoc2hvdWxkTG9nKSB7XG4gICAgICB0aGlzLmlzc3VlQ291bnQgKz0gMVxuICAgICAgY29uc3Qge1xuICAgICAgICBnaGVya2luRG9jdW1lbnQsXG4gICAgICAgIHBpY2tsZSxcbiAgICAgICAgdGVzdENhc2UsXG4gICAgICB9ID0gdGhpcy5ldmVudERhdGFDb2xsZWN0b3IuZ2V0VGVzdENhc2VEYXRhKHNvdXJjZUxvY2F0aW9uKVxuICAgICAgdGhpcy5wcm9ncmVzc0Jhci5pbnRlcnJ1cHQoXG4gICAgICAgIGZvcm1hdElzc3VlKHtcbiAgICAgICAgICBjb2xvckZuczogdGhpcy5jb2xvckZucyxcbiAgICAgICAgICBnaGVya2luRG9jdW1lbnQsXG4gICAgICAgICAgbnVtYmVyOiB0aGlzLmlzc3VlQ291bnQsXG4gICAgICAgICAgcGlja2xlLFxuICAgICAgICAgIHNuaXBwZXRCdWlsZGVyOiB0aGlzLnNuaXBwZXRCdWlsZGVyLFxuICAgICAgICAgIHRlc3RDYXNlLFxuICAgICAgICB9KVxuICAgICAgKVxuICAgIH1cbiAgfVxuXG4gIGxvZ1N1bW1hcnkodGVzdFJ1bikge1xuICAgIHRoaXMubG9nKFxuICAgICAgZm9ybWF0U3VtbWFyeSh7XG4gICAgICAgIGNvbG9yRm5zOiB0aGlzLmNvbG9yRm5zLFxuICAgICAgICB0ZXN0Q2FzZU1hcDogdGhpcy5ldmVudERhdGFDb2xsZWN0b3IudGVzdENhc2VNYXAsXG4gICAgICAgIHRlc3RSdW4sXG4gICAgICB9KVxuICAgIClcbiAgfVxufVxuIl19