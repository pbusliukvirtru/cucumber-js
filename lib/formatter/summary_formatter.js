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

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _helpers = require('./helpers');

var _2 = require('./');

var _3 = _interopRequireDefault(_2);

var _status = require('../status');

var _status2 = _interopRequireDefault(_status);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SummaryFormatter = function (_Formatter) {
  (0, _inherits3.default)(SummaryFormatter, _Formatter);

  function SummaryFormatter(options) {
    (0, _classCallCheck3.default)(this, SummaryFormatter);

    var _this = (0, _possibleConstructorReturn3.default)(this, (SummaryFormatter.__proto__ || Object.getPrototypeOf(SummaryFormatter)).call(this, options));

    options.eventBroadcaster.on('test-run-finished', _this.logSummary.bind(_this));
    return _this;
  }

  (0, _createClass3.default)(SummaryFormatter, [{
    key: 'isTestCaseFailure',
    value: function isTestCaseFailure(testCase) {
      return _lodash2.default.includes([_status2.default.AMBIGUOUS, _status2.default.FAILED], testCase.result.status);
    }
  }, {
    key: 'isTestCaseWarning',
    value: function isTestCaseWarning(testCase) {
      return _lodash2.default.includes([_status2.default.RETRY, _status2.default.PENDING, _status2.default.UNDEFINED], testCase.result.status) || testCase.attemptNumber > 1;
    }
  }, {
    key: 'logSummary',
    value: function logSummary(testRun) {
      var _this2 = this;

      var failures = [];
      var warnings = [];
      _lodash2.default.each(this.eventDataCollector.testCaseMap, function (testCase) {
        if (_this2.isTestCaseFailure(testCase)) {
          failures.push(testCase);
        } else if (_this2.isTestCaseWarning(testCase)) {
          warnings.push(testCase);
        }
      });
      if (failures.length > 0) {
        this.logIssues({ issues: failures, title: 'Failures' });
      }
      if (warnings.length > 0) {
        this.logIssues({ issues: warnings, title: 'Warnings' });
      }
      this.log((0, _helpers.formatSummary)({
        colorFns: this.colorFns,
        testCaseMap: this.eventDataCollector.testCaseMap,
        testRun: testRun
      }));
    }
  }, {
    key: 'logIssues',
    value: function logIssues(_ref) {
      var _this3 = this;

      var issues = _ref.issues,
          title = _ref.title;

      this.log(title + ':\n\n');
      issues.forEach(function (testCase, index) {
        var _eventDataCollector$g = _this3.eventDataCollector.getTestCaseData(testCase.sourceLocation),
            gherkinDocument = _eventDataCollector$g.gherkinDocument,
            pickle = _eventDataCollector$g.pickle;

        _this3.log((0, _helpers.formatIssue)({
          colorFns: _this3.colorFns,
          gherkinDocument: gherkinDocument,
          number: index + 1,
          pickle: pickle,
          snippetBuilder: _this3.snippetBuilder,
          testCase: testCase
        }));
      });
    }
  }]);
  return SummaryFormatter;
}(_3.default);

exports.default = SummaryFormatter;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9mb3JtYXR0ZXIvc3VtbWFyeV9mb3JtYXR0ZXIuanMiXSwibmFtZXMiOlsiU3VtbWFyeUZvcm1hdHRlciIsIm9wdGlvbnMiLCJldmVudEJyb2FkY2FzdGVyIiwib24iLCJsb2dTdW1tYXJ5IiwidGVzdENhc2UiLCJpbmNsdWRlcyIsIkFNQklHVU9VUyIsIkZBSUxFRCIsInJlc3VsdCIsInN0YXR1cyIsIlJFVFJZIiwiUEVORElORyIsIlVOREVGSU5FRCIsImF0dGVtcHROdW1iZXIiLCJ0ZXN0UnVuIiwiZmFpbHVyZXMiLCJ3YXJuaW5ncyIsImVhY2giLCJldmVudERhdGFDb2xsZWN0b3IiLCJ0ZXN0Q2FzZU1hcCIsImlzVGVzdENhc2VGYWlsdXJlIiwicHVzaCIsImlzVGVzdENhc2VXYXJuaW5nIiwibGVuZ3RoIiwibG9nSXNzdWVzIiwiaXNzdWVzIiwidGl0bGUiLCJsb2ciLCJjb2xvckZucyIsImZvckVhY2giLCJpbmRleCIsImdldFRlc3RDYXNlRGF0YSIsInNvdXJjZUxvY2F0aW9uIiwiZ2hlcmtpbkRvY3VtZW50IiwicGlja2xlIiwibnVtYmVyIiwic25pcHBldEJ1aWxkZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOztBQUNBOzs7O0FBQ0E7Ozs7OztJQUVxQkEsZ0I7OztBQUNuQiw0QkFBWUMsT0FBWixFQUFxQjtBQUFBOztBQUFBLGtKQUNiQSxPQURhOztBQUVuQkEsWUFBUUMsZ0JBQVIsQ0FBeUJDLEVBQXpCLENBQTRCLG1CQUE1QixFQUFtRCxNQUFLQyxVQUF4RDtBQUZtQjtBQUdwQjs7OztzQ0FFaUJDLFEsRUFBVTtBQUMxQixhQUFPLGlCQUFFQyxRQUFGLENBQVcsQ0FBQyxpQkFBT0MsU0FBUixFQUFtQixpQkFBT0MsTUFBMUIsQ0FBWCxFQUE4Q0gsU0FBU0ksTUFBVCxDQUFnQkMsTUFBOUQsQ0FBUDtBQUNEOzs7c0NBRWlCTCxRLEVBQVU7QUFDMUIsYUFDRSxpQkFBRUMsUUFBRixDQUNFLENBQUMsaUJBQU9LLEtBQVIsRUFBZSxpQkFBT0MsT0FBdEIsRUFBK0IsaUJBQU9DLFNBQXRDLENBREYsRUFFRVIsU0FBU0ksTUFBVCxDQUFnQkMsTUFGbEIsS0FHS0wsU0FBU1MsYUFBVCxHQUF5QixDQUpoQztBQU1EOzs7K0JBRVVDLE8sRUFBUztBQUFBOztBQUNsQixVQUFNQyxXQUFXLEVBQWpCO0FBQ0EsVUFBTUMsV0FBVyxFQUFqQjtBQUNBLHVCQUFFQyxJQUFGLENBQU8sS0FBS0Msa0JBQUwsQ0FBd0JDLFdBQS9CLEVBQTRDLG9CQUFZO0FBQ3RELFlBQUksT0FBS0MsaUJBQUwsQ0FBdUJoQixRQUF2QixDQUFKLEVBQXNDO0FBQ3BDVyxtQkFBU00sSUFBVCxDQUFjakIsUUFBZDtBQUNELFNBRkQsTUFFTyxJQUFJLE9BQUtrQixpQkFBTCxDQUF1QmxCLFFBQXZCLENBQUosRUFBc0M7QUFDM0NZLG1CQUFTSyxJQUFULENBQWNqQixRQUFkO0FBQ0Q7QUFDRixPQU5EO0FBT0EsVUFBSVcsU0FBU1EsTUFBVCxHQUFrQixDQUF0QixFQUF5QjtBQUN2QixhQUFLQyxTQUFMLENBQWUsRUFBRUMsUUFBUVYsUUFBVixFQUFvQlcsT0FBTyxVQUEzQixFQUFmO0FBQ0Q7QUFDRCxVQUFJVixTQUFTTyxNQUFULEdBQWtCLENBQXRCLEVBQXlCO0FBQ3ZCLGFBQUtDLFNBQUwsQ0FBZSxFQUFFQyxRQUFRVCxRQUFWLEVBQW9CVSxPQUFPLFVBQTNCLEVBQWY7QUFDRDtBQUNELFdBQUtDLEdBQUwsQ0FDRSw0QkFBYztBQUNaQyxrQkFBVSxLQUFLQSxRQURIO0FBRVpULHFCQUFhLEtBQUtELGtCQUFMLENBQXdCQyxXQUZ6QjtBQUdaTDtBQUhZLE9BQWQsQ0FERjtBQU9EOzs7b0NBRTRCO0FBQUE7O0FBQUEsVUFBakJXLE1BQWlCLFFBQWpCQSxNQUFpQjtBQUFBLFVBQVRDLEtBQVMsUUFBVEEsS0FBUzs7QUFDM0IsV0FBS0MsR0FBTCxDQUFZRCxLQUFaO0FBQ0FELGFBQU9JLE9BQVAsQ0FBZSxVQUFDekIsUUFBRCxFQUFXMEIsS0FBWCxFQUFxQjtBQUFBLG9DQUk5QixPQUFLWixrQkFBTCxDQUF3QmEsZUFBeEIsQ0FBd0MzQixTQUFTNEIsY0FBakQsQ0FKOEI7QUFBQSxZQUVoQ0MsZUFGZ0MseUJBRWhDQSxlQUZnQztBQUFBLFlBR2hDQyxNQUhnQyx5QkFHaENBLE1BSGdDOztBQUtsQyxlQUFLUCxHQUFMLENBQ0UsMEJBQVk7QUFDVkMsb0JBQVUsT0FBS0EsUUFETDtBQUVWSywwQ0FGVTtBQUdWRSxrQkFBUUwsUUFBUSxDQUhOO0FBSVZJLHdCQUpVO0FBS1ZFLDBCQUFnQixPQUFLQSxjQUxYO0FBTVZoQztBQU5VLFNBQVosQ0FERjtBQVVELE9BZkQ7QUFnQkQ7Ozs7O2tCQTlEa0JMLGdCIiwiZmlsZSI6InN1bW1hcnlfZm9ybWF0dGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IF8gZnJvbSAnbG9kYXNoJ1xuaW1wb3J0IHsgZm9ybWF0SXNzdWUsIGZvcm1hdFN1bW1hcnkgfSBmcm9tICcuL2hlbHBlcnMnXG5pbXBvcnQgRm9ybWF0dGVyIGZyb20gJy4vJ1xuaW1wb3J0IFN0YXR1cyBmcm9tICcuLi9zdGF0dXMnXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFN1bW1hcnlGb3JtYXR0ZXIgZXh0ZW5kcyBGb3JtYXR0ZXIge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgc3VwZXIob3B0aW9ucylcbiAgICBvcHRpb25zLmV2ZW50QnJvYWRjYXN0ZXIub24oJ3Rlc3QtcnVuLWZpbmlzaGVkJywgOjp0aGlzLmxvZ1N1bW1hcnkpXG4gIH1cblxuICBpc1Rlc3RDYXNlRmFpbHVyZSh0ZXN0Q2FzZSkge1xuICAgIHJldHVybiBfLmluY2x1ZGVzKFtTdGF0dXMuQU1CSUdVT1VTLCBTdGF0dXMuRkFJTEVEXSwgdGVzdENhc2UucmVzdWx0LnN0YXR1cylcbiAgfVxuXG4gIGlzVGVzdENhc2VXYXJuaW5nKHRlc3RDYXNlKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIF8uaW5jbHVkZXMoXG4gICAgICAgIFtTdGF0dXMuUkVUUlksIFN0YXR1cy5QRU5ESU5HLCBTdGF0dXMuVU5ERUZJTkVEXSxcbiAgICAgICAgdGVzdENhc2UucmVzdWx0LnN0YXR1c1xuICAgICAgKSB8fCB0ZXN0Q2FzZS5hdHRlbXB0TnVtYmVyID4gMVxuICAgIClcbiAgfVxuXG4gIGxvZ1N1bW1hcnkodGVzdFJ1bikge1xuICAgIGNvbnN0IGZhaWx1cmVzID0gW11cbiAgICBjb25zdCB3YXJuaW5ncyA9IFtdXG4gICAgXy5lYWNoKHRoaXMuZXZlbnREYXRhQ29sbGVjdG9yLnRlc3RDYXNlTWFwLCB0ZXN0Q2FzZSA9PiB7XG4gICAgICBpZiAodGhpcy5pc1Rlc3RDYXNlRmFpbHVyZSh0ZXN0Q2FzZSkpIHtcbiAgICAgICAgZmFpbHVyZXMucHVzaCh0ZXN0Q2FzZSlcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5pc1Rlc3RDYXNlV2FybmluZyh0ZXN0Q2FzZSkpIHtcbiAgICAgICAgd2FybmluZ3MucHVzaCh0ZXN0Q2FzZSlcbiAgICAgIH1cbiAgICB9KVxuICAgIGlmIChmYWlsdXJlcy5sZW5ndGggPiAwKSB7XG4gICAgICB0aGlzLmxvZ0lzc3Vlcyh7IGlzc3VlczogZmFpbHVyZXMsIHRpdGxlOiAnRmFpbHVyZXMnIH0pXG4gICAgfVxuICAgIGlmICh3YXJuaW5ncy5sZW5ndGggPiAwKSB7XG4gICAgICB0aGlzLmxvZ0lzc3Vlcyh7IGlzc3Vlczogd2FybmluZ3MsIHRpdGxlOiAnV2FybmluZ3MnIH0pXG4gICAgfVxuICAgIHRoaXMubG9nKFxuICAgICAgZm9ybWF0U3VtbWFyeSh7XG4gICAgICAgIGNvbG9yRm5zOiB0aGlzLmNvbG9yRm5zLFxuICAgICAgICB0ZXN0Q2FzZU1hcDogdGhpcy5ldmVudERhdGFDb2xsZWN0b3IudGVzdENhc2VNYXAsXG4gICAgICAgIHRlc3RSdW4sXG4gICAgICB9KVxuICAgIClcbiAgfVxuXG4gIGxvZ0lzc3Vlcyh7IGlzc3VlcywgdGl0bGUgfSkge1xuICAgIHRoaXMubG9nKGAke3RpdGxlfTpcXG5cXG5gKVxuICAgIGlzc3Vlcy5mb3JFYWNoKCh0ZXN0Q2FzZSwgaW5kZXgpID0+IHtcbiAgICAgIGNvbnN0IHtcbiAgICAgICAgZ2hlcmtpbkRvY3VtZW50LFxuICAgICAgICBwaWNrbGUsXG4gICAgICB9ID0gdGhpcy5ldmVudERhdGFDb2xsZWN0b3IuZ2V0VGVzdENhc2VEYXRhKHRlc3RDYXNlLnNvdXJjZUxvY2F0aW9uKVxuICAgICAgdGhpcy5sb2coXG4gICAgICAgIGZvcm1hdElzc3VlKHtcbiAgICAgICAgICBjb2xvckZuczogdGhpcy5jb2xvckZucyxcbiAgICAgICAgICBnaGVya2luRG9jdW1lbnQsXG4gICAgICAgICAgbnVtYmVyOiBpbmRleCArIDEsXG4gICAgICAgICAgcGlja2xlLFxuICAgICAgICAgIHNuaXBwZXRCdWlsZGVyOiB0aGlzLnNuaXBwZXRCdWlsZGVyLFxuICAgICAgICAgIHRlc3RDYXNlLFxuICAgICAgICB9KVxuICAgICAgKVxuICAgIH0pXG4gIH1cbn1cbiJdfQ==