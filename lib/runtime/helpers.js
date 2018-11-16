'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

exports.getAmbiguousStepException = getAmbiguousStepException;
exports.retriesForTestCase = retriesForTestCase;

var _location_helpers = require('../formatter/helpers/location_helpers');

var _cliTable = require('cli-table3');

var _cliTable2 = _interopRequireDefault(_cliTable);

var _indentString = require('indent-string');

var _indentString2 = _interopRequireDefault(_indentString);

var _pickle_filter = require('../pickle_filter');

var _pickle_filter2 = _interopRequireDefault(_pickle_filter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getAmbiguousStepException(stepDefinitions) {
  var table = new _cliTable2.default({
    chars: {
      bottom: '',
      'bottom-left': '',
      'bottom-mid': '',
      'bottom-right': '',
      left: '',
      'left-mid': '',
      mid: '',
      'mid-mid': '',
      middle: ' - ',
      right: '',
      'right-mid': '',
      top: '',
      'top-left': '',
      'top-mid': '',
      'top-right': ''
    },
    style: {
      border: [],
      'padding-left': 0,
      'padding-right': 0
    }
  });
  table.push.apply(table, (0, _toConsumableArray3.default)(stepDefinitions.map(function (stepDefinition) {
    var pattern = stepDefinition.pattern.toString();
    return [pattern, (0, _location_helpers.formatLocation)(stepDefinition)];
  })));
  return '' + ('Multiple step definitions match:' + '\n') + (0, _indentString2.default)(table.toString(), 2);
}

function retriesForTestCase(testCase, options) {
  var retries = options.retry;
  if (!retries) {
    return 0;
  }
  var retryTagFilter = options.retryTagFilter;
  if (!retryTagFilter) {
    return retries;
  }
  var pickleFilter = new _pickle_filter2.default({
    tagExpression: retryTagFilter
  });
  if (pickleFilter.matches(testCase)) {
    return retries;
  }
  return 0;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ydW50aW1lL2hlbHBlcnMuanMiXSwibmFtZXMiOlsiZ2V0QW1iaWd1b3VzU3RlcEV4Y2VwdGlvbiIsInJldHJpZXNGb3JUZXN0Q2FzZSIsInN0ZXBEZWZpbml0aW9ucyIsInRhYmxlIiwiY2hhcnMiLCJib3R0b20iLCJsZWZ0IiwibWlkIiwibWlkZGxlIiwicmlnaHQiLCJ0b3AiLCJzdHlsZSIsImJvcmRlciIsInB1c2giLCJtYXAiLCJwYXR0ZXJuIiwic3RlcERlZmluaXRpb24iLCJ0b1N0cmluZyIsInRlc3RDYXNlIiwib3B0aW9ucyIsInJldHJpZXMiLCJyZXRyeSIsInJldHJ5VGFnRmlsdGVyIiwicGlja2xlRmlsdGVyIiwidGFnRXhwcmVzc2lvbiIsIm1hdGNoZXMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7UUFLZ0JBLHlCLEdBQUFBLHlCO1FBcUNBQyxrQixHQUFBQSxrQjs7QUExQ2hCOztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBRU8sU0FBU0QseUJBQVQsQ0FBbUNFLGVBQW5DLEVBQW9EO0FBQ3pELE1BQU1DLFFBQVEsdUJBQVU7QUFDdEJDLFdBQU87QUFDTEMsY0FBUSxFQURIO0FBRUwscUJBQWUsRUFGVjtBQUdMLG9CQUFjLEVBSFQ7QUFJTCxzQkFBZ0IsRUFKWDtBQUtMQyxZQUFNLEVBTEQ7QUFNTCxrQkFBWSxFQU5QO0FBT0xDLFdBQUssRUFQQTtBQVFMLGlCQUFXLEVBUk47QUFTTEMsY0FBUSxLQVRIO0FBVUxDLGFBQU8sRUFWRjtBQVdMLG1CQUFhLEVBWFI7QUFZTEMsV0FBSyxFQVpBO0FBYUwsa0JBQVksRUFiUDtBQWNMLGlCQUFXLEVBZE47QUFlTCxtQkFBYTtBQWZSLEtBRGU7QUFrQnRCQyxXQUFPO0FBQ0xDLGNBQVEsRUFESDtBQUVMLHNCQUFnQixDQUZYO0FBR0wsdUJBQWlCO0FBSFo7QUFsQmUsR0FBVixDQUFkO0FBd0JBVCxRQUFNVSxJQUFOLCtDQUNLWCxnQkFBZ0JZLEdBQWhCLENBQW9CLDBCQUFrQjtBQUN2QyxRQUFNQyxVQUFVQyxlQUFlRCxPQUFmLENBQXVCRSxRQUF2QixFQUFoQjtBQUNBLFdBQU8sQ0FBQ0YsT0FBRCxFQUFVLHNDQUFlQyxjQUFmLENBQVYsQ0FBUDtBQUNELEdBSEUsQ0FETDtBQU1BLGVBQVUscUNBQXFDLElBQS9DLElBQXNELDRCQUNwRGIsTUFBTWMsUUFBTixFQURvRCxFQUVwRCxDQUZvRCxDQUF0RDtBQUlEOztBQUVNLFNBQVNoQixrQkFBVCxDQUE0QmlCLFFBQTVCLEVBQXNDQyxPQUF0QyxFQUErQztBQUNwRCxNQUFNQyxVQUFVRCxRQUFRRSxLQUF4QjtBQUNBLE1BQUksQ0FBQ0QsT0FBTCxFQUFjO0FBQ1osV0FBTyxDQUFQO0FBQ0Q7QUFDRCxNQUFNRSxpQkFBaUJILFFBQVFHLGNBQS9CO0FBQ0EsTUFBSSxDQUFDQSxjQUFMLEVBQXFCO0FBQ25CLFdBQU9GLE9BQVA7QUFDRDtBQUNELE1BQU1HLGVBQWUsNEJBQWlCO0FBQ3BDQyxtQkFBZUY7QUFEcUIsR0FBakIsQ0FBckI7QUFHQSxNQUFJQyxhQUFhRSxPQUFiLENBQXFCUCxRQUFyQixDQUFKLEVBQW9DO0FBQ2xDLFdBQU9FLE9BQVA7QUFDRDtBQUNELFNBQU8sQ0FBUDtBQUNEIiwiZmlsZSI6ImhlbHBlcnMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBmb3JtYXRMb2NhdGlvbiB9IGZyb20gJy4uL2Zvcm1hdHRlci9oZWxwZXJzL2xvY2F0aW9uX2hlbHBlcnMnXG5pbXBvcnQgVGFibGUgZnJvbSAnY2xpLXRhYmxlMydcbmltcG9ydCBpbmRlbnRTdHJpbmcgZnJvbSAnaW5kZW50LXN0cmluZydcbmltcG9ydCBQaWNrbGVGaWx0ZXIgZnJvbSAnLi4vcGlja2xlX2ZpbHRlcidcblxuZXhwb3J0IGZ1bmN0aW9uIGdldEFtYmlndW91c1N0ZXBFeGNlcHRpb24oc3RlcERlZmluaXRpb25zKSB7XG4gIGNvbnN0IHRhYmxlID0gbmV3IFRhYmxlKHtcbiAgICBjaGFyczoge1xuICAgICAgYm90dG9tOiAnJyxcbiAgICAgICdib3R0b20tbGVmdCc6ICcnLFxuICAgICAgJ2JvdHRvbS1taWQnOiAnJyxcbiAgICAgICdib3R0b20tcmlnaHQnOiAnJyxcbiAgICAgIGxlZnQ6ICcnLFxuICAgICAgJ2xlZnQtbWlkJzogJycsXG4gICAgICBtaWQ6ICcnLFxuICAgICAgJ21pZC1taWQnOiAnJyxcbiAgICAgIG1pZGRsZTogJyAtICcsXG4gICAgICByaWdodDogJycsXG4gICAgICAncmlnaHQtbWlkJzogJycsXG4gICAgICB0b3A6ICcnLFxuICAgICAgJ3RvcC1sZWZ0JzogJycsXG4gICAgICAndG9wLW1pZCc6ICcnLFxuICAgICAgJ3RvcC1yaWdodCc6ICcnLFxuICAgIH0sXG4gICAgc3R5bGU6IHtcbiAgICAgIGJvcmRlcjogW10sXG4gICAgICAncGFkZGluZy1sZWZ0JzogMCxcbiAgICAgICdwYWRkaW5nLXJpZ2h0JzogMCxcbiAgICB9LFxuICB9KVxuICB0YWJsZS5wdXNoKFxuICAgIC4uLnN0ZXBEZWZpbml0aW9ucy5tYXAoc3RlcERlZmluaXRpb24gPT4ge1xuICAgICAgY29uc3QgcGF0dGVybiA9IHN0ZXBEZWZpbml0aW9uLnBhdHRlcm4udG9TdHJpbmcoKVxuICAgICAgcmV0dXJuIFtwYXR0ZXJuLCBmb3JtYXRMb2NhdGlvbihzdGVwRGVmaW5pdGlvbildXG4gICAgfSlcbiAgKVxuICByZXR1cm4gYCR7J011bHRpcGxlIHN0ZXAgZGVmaW5pdGlvbnMgbWF0Y2g6JyArICdcXG4nfSR7aW5kZW50U3RyaW5nKFxuICAgIHRhYmxlLnRvU3RyaW5nKCksXG4gICAgMlxuICApfWBcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJldHJpZXNGb3JUZXN0Q2FzZSh0ZXN0Q2FzZSwgb3B0aW9ucykge1xuICBjb25zdCByZXRyaWVzID0gb3B0aW9ucy5yZXRyeVxuICBpZiAoIXJldHJpZXMpIHtcbiAgICByZXR1cm4gMFxuICB9XG4gIGNvbnN0IHJldHJ5VGFnRmlsdGVyID0gb3B0aW9ucy5yZXRyeVRhZ0ZpbHRlclxuICBpZiAoIXJldHJ5VGFnRmlsdGVyKSB7XG4gICAgcmV0dXJuIHJldHJpZXNcbiAgfVxuICBjb25zdCBwaWNrbGVGaWx0ZXIgPSBuZXcgUGlja2xlRmlsdGVyKHtcbiAgICB0YWdFeHByZXNzaW9uOiByZXRyeVRhZ0ZpbHRlcixcbiAgfSlcbiAgaWYgKHBpY2tsZUZpbHRlci5tYXRjaGVzKHRlc3RDYXNlKSkge1xuICAgIHJldHVybiByZXRyaWVzXG4gIH1cbiAgcmV0dXJuIDBcbn1cbiJdfQ==