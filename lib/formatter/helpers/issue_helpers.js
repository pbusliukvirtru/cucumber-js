'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _CHARACTERS, _IS_ISSUE;

exports.isIssue = isIssue;
exports.formatIssue = formatIssue;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _location_helpers = require('./location_helpers');

var _step_result_helpers = require('./step_result_helpers');

var _indentString = require('indent-string');

var _indentString2 = _interopRequireDefault(_indentString);

var _status = require('../../status');

var _status2 = _interopRequireDefault(_status);

var _figures = require('figures');

var _figures2 = _interopRequireDefault(_figures);

var _cliTable = require('cli-table3');

var _cliTable2 = _interopRequireDefault(_cliTable);

var _keyword_type = require('./keyword_type');

var _keyword_type2 = _interopRequireDefault(_keyword_type);

var _step_arguments = require('../../step_arguments');

var _gherkin_document_parser = require('./gherkin_document_parser');

var _pickle_parser = require('./pickle_parser');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CHARACTERS = (_CHARACTERS = {}, (0, _defineProperty3.default)(_CHARACTERS, _status2.default.AMBIGUOUS, _figures2.default.cross), (0, _defineProperty3.default)(_CHARACTERS, _status2.default.FAILED, _figures2.default.cross), (0, _defineProperty3.default)(_CHARACTERS, _status2.default.PASSED, _figures2.default.tick), (0, _defineProperty3.default)(_CHARACTERS, _status2.default.PENDING, '?'), (0, _defineProperty3.default)(_CHARACTERS, _status2.default.SKIPPED, '-'), (0, _defineProperty3.default)(_CHARACTERS, _status2.default.UNDEFINED, '?'), _CHARACTERS);

var IS_ISSUE = (_IS_ISSUE = {}, (0, _defineProperty3.default)(_IS_ISSUE, _status2.default.AMBIGUOUS, true), (0, _defineProperty3.default)(_IS_ISSUE, _status2.default.FAILED, true), (0, _defineProperty3.default)(_IS_ISSUE, _status2.default.PASSED, false), (0, _defineProperty3.default)(_IS_ISSUE, _status2.default.PENDING, true), (0, _defineProperty3.default)(_IS_ISSUE, _status2.default.SKIPPED, false), (0, _defineProperty3.default)(_IS_ISSUE, _status2.default.UNDEFINED, true), _IS_ISSUE);

function formatDataTable(arg) {
  var rows = arg.rows.map(function (row) {
    return row.cells.map(function (cell) {
      return cell.value.replace(/\\/g, '\\\\').replace(/\n/g, '\\n');
    });
  });
  var table = new _cliTable2.default({
    chars: {
      bottom: '',
      'bottom-left': '',
      'bottom-mid': '',
      'bottom-right': '',
      left: '|',
      'left-mid': '',
      mid: '',
      'mid-mid': '',
      middle: '|',
      right: '|',
      'right-mid': '',
      top: '',
      'top-left': '',
      'top-mid': '',
      'top-right': ''
    },
    style: {
      border: [],
      'padding-left': 1,
      'padding-right': 1
    }
  });
  table.push.apply(table, (0, _toConsumableArray3.default)(rows));
  return table.toString();
}

function formatDocString(arg) {
  return '"""\n' + arg.content + '\n"""';
}

function formatStep(_ref) {
  var colorFns = _ref.colorFns,
      isBeforeHook = _ref.isBeforeHook,
      keyword = _ref.keyword,
      keywordType = _ref.keywordType,
      pickleStep = _ref.pickleStep,
      snippetBuilder = _ref.snippetBuilder,
      testStep = _ref.testStep;
  var status = testStep.result.status;

  var colorFn = colorFns[status];

  var identifier = void 0;
  if (testStep.sourceLocation) {
    identifier = keyword + (pickleStep.text || '');
  } else {
    identifier = isBeforeHook ? 'Before' : 'After';
  }

  var text = colorFn(CHARACTERS[status] + ' ' + identifier);

  var actionLocation = testStep.actionLocation;

  if (actionLocation) {
    text += ' # ' + colorFns.location((0, _location_helpers.formatLocation)(actionLocation));
  }
  text += '\n';

  if (pickleStep) {
    var str = void 0;
    var iterator = (0, _step_arguments.buildStepArgumentIterator)({
      dataTable: function dataTable(arg) {
        return str = formatDataTable(arg);
      },
      docString: function docString(arg) {
        return str = formatDocString(arg);
      }
    });
    _lodash2.default.each(pickleStep.arguments, iterator);
    if (str) {
      text += (0, _indentString2.default)(colorFn(str) + '\n', 4);
    }
  }

  if (testStep.attachments) {
    testStep.attachments.forEach(function (_ref2) {
      var media = _ref2.media,
          data = _ref2.data;

      var message = media.type === 'text/plain' ? ': ' + data : '';
      text += (0, _indentString2.default)('Attachment (' + media.type + ')' + message + '\n', 4);
    });
  }

  var message = (0, _step_result_helpers.getStepMessage)({
    colorFns: colorFns,
    keywordType: keywordType,
    pickleStep: pickleStep,
    snippetBuilder: snippetBuilder,
    testStep: testStep
  });
  if (message) {
    text += (0, _indentString2.default)(message, 4) + '\n';
  }
  return text;
}

function isIssue(status) {
  return IS_ISSUE[status];
}

function formatIssue(_ref3) {
  var colorFns = _ref3.colorFns,
      gherkinDocument = _ref3.gherkinDocument,
      number = _ref3.number,
      pickle = _ref3.pickle,
      snippetBuilder = _ref3.snippetBuilder,
      testCase = _ref3.testCase;

  var prefix = number + ') ';
  var text = prefix;
  var scenarioLocation = (0, _location_helpers.formatLocation)(testCase.sourceLocation);
  text += 'Scenario: ' + pickle.name + ' ';
  text += getRetryWarningText(testCase, colorFns.retry);
  text += '# ' + colorFns.location(scenarioLocation) + '\n';
  var stepLineToKeywordMap = (0, _gherkin_document_parser.getStepLineToKeywordMap)(gherkinDocument);
  var stepLineToPickledStepMap = (0, _pickle_parser.getStepLineToPickledStepMap)(pickle);
  var isBeforeHook = true;
  var previousKeywordType = _keyword_type2.default.PRECONDITION;
  _lodash2.default.each(testCase.steps, function (testStep) {
    isBeforeHook = isBeforeHook && !testStep.sourceLocation;
    var keyword = void 0,
        keywordType = void 0,
        pickleStep = void 0;
    if (testStep.sourceLocation) {
      pickleStep = stepLineToPickledStepMap[testStep.sourceLocation.line];
      keyword = (0, _pickle_parser.getStepKeyword)({ pickleStep: pickleStep, stepLineToKeywordMap: stepLineToKeywordMap });
      keywordType = (0, _keyword_type.getStepKeywordType)({
        keyword: keyword,
        language: gherkinDocument.feature.language,
        previousKeywordType: previousKeywordType
      });
    }
    var formattedStep = formatStep({
      colorFns: colorFns,
      isBeforeHook: isBeforeHook,
      keyword: keyword,
      keywordType: keywordType,
      pickleStep: pickleStep,
      snippetBuilder: snippetBuilder,
      testStep: testStep
    });
    text += (0, _indentString2.default)(formattedStep, prefix.length);
    previousKeywordType = keywordType;
  });
  return text + '\n';
}

function getRetryWarningText(testCase, flakyColorFn) {
  var result = testCase.result;
  if (!testCase.result) {
    return '';
  }
  var attemptNumber = testCase.attemptNumber;
  if (attemptNumber > 1 || result.status === _status2.default.RETRY) {
    return flakyColorFn('(attempt #' + attemptNumber + ') ');
  }
  return '';
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9mb3JtYXR0ZXIvaGVscGVycy9pc3N1ZV9oZWxwZXJzLmpzIl0sIm5hbWVzIjpbImlzSXNzdWUiLCJmb3JtYXRJc3N1ZSIsIkNIQVJBQ1RFUlMiLCJBTUJJR1VPVVMiLCJjcm9zcyIsIkZBSUxFRCIsIlBBU1NFRCIsInRpY2siLCJQRU5ESU5HIiwiU0tJUFBFRCIsIlVOREVGSU5FRCIsIklTX0lTU1VFIiwiZm9ybWF0RGF0YVRhYmxlIiwiYXJnIiwicm93cyIsIm1hcCIsInJvdyIsImNlbGxzIiwiY2VsbCIsInZhbHVlIiwicmVwbGFjZSIsInRhYmxlIiwiY2hhcnMiLCJib3R0b20iLCJsZWZ0IiwibWlkIiwibWlkZGxlIiwicmlnaHQiLCJ0b3AiLCJzdHlsZSIsImJvcmRlciIsInB1c2giLCJ0b1N0cmluZyIsImZvcm1hdERvY1N0cmluZyIsImNvbnRlbnQiLCJmb3JtYXRTdGVwIiwiY29sb3JGbnMiLCJpc0JlZm9yZUhvb2siLCJrZXl3b3JkIiwia2V5d29yZFR5cGUiLCJwaWNrbGVTdGVwIiwic25pcHBldEJ1aWxkZXIiLCJ0ZXN0U3RlcCIsInN0YXR1cyIsInJlc3VsdCIsImNvbG9yRm4iLCJpZGVudGlmaWVyIiwic291cmNlTG9jYXRpb24iLCJ0ZXh0IiwiYWN0aW9uTG9jYXRpb24iLCJsb2NhdGlvbiIsInN0ciIsIml0ZXJhdG9yIiwiZGF0YVRhYmxlIiwiZG9jU3RyaW5nIiwiZWFjaCIsImFyZ3VtZW50cyIsImF0dGFjaG1lbnRzIiwiZm9yRWFjaCIsIm1lZGlhIiwiZGF0YSIsIm1lc3NhZ2UiLCJ0eXBlIiwiZ2hlcmtpbkRvY3VtZW50IiwibnVtYmVyIiwicGlja2xlIiwidGVzdENhc2UiLCJwcmVmaXgiLCJzY2VuYXJpb0xvY2F0aW9uIiwibmFtZSIsImdldFJldHJ5V2FybmluZ1RleHQiLCJyZXRyeSIsInN0ZXBMaW5lVG9LZXl3b3JkTWFwIiwic3RlcExpbmVUb1BpY2tsZWRTdGVwTWFwIiwicHJldmlvdXNLZXl3b3JkVHlwZSIsIlBSRUNPTkRJVElPTiIsInN0ZXBzIiwibGluZSIsImxhbmd1YWdlIiwiZmVhdHVyZSIsImZvcm1hdHRlZFN0ZXAiLCJsZW5ndGgiLCJmbGFreUNvbG9yRm4iLCJhdHRlbXB0TnVtYmVyIiwiUkVUUlkiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7UUErSGdCQSxPLEdBQUFBLE87UUFJQUMsVyxHQUFBQSxXOztBQW5JaEI7Ozs7QUFDQTs7QUFDQTs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7QUFFQSxJQUFNQywyRUFDSCxpQkFBT0MsU0FESixFQUNnQixrQkFBUUMsS0FEeEIsOENBRUgsaUJBQU9DLE1BRkosRUFFYSxrQkFBUUQsS0FGckIsOENBR0gsaUJBQU9FLE1BSEosRUFHYSxrQkFBUUMsSUFIckIsOENBSUgsaUJBQU9DLE9BSkosRUFJYyxHQUpkLDhDQUtILGlCQUFPQyxPQUxKLEVBS2MsR0FMZCw4Q0FNSCxpQkFBT0MsU0FOSixFQU1nQixHQU5oQixlQUFOOztBQVNBLElBQU1DLHFFQUNILGlCQUFPUixTQURKLEVBQ2dCLElBRGhCLDRDQUVILGlCQUFPRSxNQUZKLEVBRWEsSUFGYiw0Q0FHSCxpQkFBT0MsTUFISixFQUdhLEtBSGIsNENBSUgsaUJBQU9FLE9BSkosRUFJYyxJQUpkLDRDQUtILGlCQUFPQyxPQUxKLEVBS2MsS0FMZCw0Q0FNSCxpQkFBT0MsU0FOSixFQU1nQixJQU5oQixhQUFOOztBQVNBLFNBQVNFLGVBQVQsQ0FBeUJDLEdBQXpCLEVBQThCO0FBQzVCLE1BQU1DLE9BQU9ELElBQUlDLElBQUosQ0FBU0MsR0FBVCxDQUFhO0FBQUEsV0FDeEJDLElBQUlDLEtBQUosQ0FBVUYsR0FBVixDQUFjO0FBQUEsYUFDWkcsS0FBS0MsS0FBTCxDQUFXQyxPQUFYLENBQW1CLEtBQW5CLEVBQTBCLE1BQTFCLEVBQWtDQSxPQUFsQyxDQUEwQyxLQUExQyxFQUFpRCxLQUFqRCxDQURZO0FBQUEsS0FBZCxDQUR3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QUNBLFFBQUlFLFNBQVNLLGNBQWIsRUFBNkI7QUFDM0JQLG1CQUFhaUMseUJBQXlCL0IsU0FBU0ssY0FBVCxDQUF3QjhCLElBQWpELENBQWI7QUFDQXZDLGdCQUFVLG1DQUFlLEVBQUVFLHNCQUFGLEVBQWNnQywwQ0FBZCxFQUFmLENBQVY7QUFDQWpDLG9CQUFjLHNDQUFtQjtBQUMvQkQsd0JBRCtCO0FBRS9Cd0Msa0JBQVVmLGdCQUFnQmdCLE9BQWhCLENBQXdCRCxRQUZIO0FBRy9CSjtBQUgrQixPQUFuQixDQUFkO0FBS0Q7QUFDRCxRQUFNTSxnQkFBZ0I3QyxXQUFXO0FBQy9CQyx3QkFEK0I7QUFFL0JDLGdDQUYrQjtBQUcvQkMsc0JBSCtCO0FBSS9CQyw4QkFKK0I7QUFLL0JDLDRCQUwrQjtBQU0vQkMsb0NBTitCO0FBTy9CQztBQVArQixLQUFYLENBQXRCO0FBU0FNLFlBQVEsNEJBQWFnQyxhQUFiLEVBQTRCYixPQUFPYyxNQUFuQyxDQUFSO0FBQ0FQLDBCQUFzQm5DLFdBQXRCO0FBQ0QsR0F2QkQ7QUF3QkEsU0FBVVMsSUFBVjtBQUNEOztBQUVELFNBQVNzQixtQkFBVCxDQUE2QkosUUFBN0IsRUFBdUNnQixZQUF2QyxFQUFxRDtBQUNuRCxNQUFNdEMsU0FBU3NCLFNBQVN0QixNQUF4QjtBQUNBLE1BQUksQ0FBQ3NCLFNBQVN0QixNQUFkLEVBQXNCO0FBQ3BCLFdBQU8sRUFBUDtBQUNEO0FBQ0QsTUFBTXVDLGdCQUFnQmpCLFNBQVNpQixhQUEvQjtBQUNBLE1BQUlBLGdCQUFnQixDQUFoQixJQUFxQnZDLE9BQU9ELE1BQVAsS0FBa0IsaUJBQU95QyxLQUFsRCxFQUF5RDtBQUN2RCxXQUFPRiw0QkFBMEJDLGFBQTFCLFFBQVA7QUFDRDtBQUNELFNBQU8sRUFBUDtBQUNEIiwiZmlsZSI6Imlzc3VlX2hlbHBlcnMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgXyBmcm9tICdsb2Rhc2gnXG5pbXBvcnQgeyBmb3JtYXRMb2NhdGlvbiB9IGZyb20gJy4vbG9jYXRpb25faGVscGVycydcbmltcG9ydCB7IGdldFN0ZXBNZXNzYWdlIH0gZnJvbSAnLi9zdGVwX3Jlc3VsdF9oZWxwZXJzJ1xuaW1wb3J0IGluZGVudFN0cmluZyBmcm9tICdpbmRlbnQtc3RyaW5nJ1xuaW1wb3J0IFN0YXR1cyBmcm9tICcuLi8uLi9zdGF0dXMnXG5pbXBvcnQgZmlndXJlcyBmcm9tICdmaWd1cmVzJ1xuaW1wb3J0IFRhYmxlIGZyb20gJ2NsaS10YWJsZTMnXG5pbXBvcnQgS2V5d29yZFR5cGUsIHsgZ2V0U3RlcEtleXdvcmRUeXBlIH0gZnJvbSAnLi9rZXl3b3JkX3R5cGUnXG5pbXBvcnQgeyBidWlsZFN0ZXBBcmd1bWVudEl0ZXJhdG9yIH0gZnJvbSAnLi4vLi4vc3RlcF9hcmd1bWVudHMnXG5pbXBvcnQgeyBnZXRTdGVwTGluZVRvS2V5d29yZE1hcCB9IGZyb20gJy4vZ2hlcmtpbl9kb2N1bWVudF9wYXJzZXInXG5pbXBvcnQgeyBnZXRTdGVwTGluZVRvUGlja2xlZFN0ZXBNYXAsIGdldFN0ZXBLZXl3b3JkIH0gZnJvbSAnLi9waWNrbGVfcGFyc2VyJ1xuXG5jb25zdCBDSEFSQUNURVJTID0ge1xuICBbU3RhdHVzLkFNQklHVU9VU106IGZpZ3VyZXMuY3Jvc3MsXG4gIFtTdGF0dXMuRkFJTEVEXTogZmlndXJlcy5jcm9zcyxcbiAgW1N0YXR1cy5QQVNTRURdOiBmaWd1cmVzLnRpY2ssXG4gIFtTdGF0dXMuUEVORElOR106ICc/JyxcbiAgW1N0YXR1cy5TS0lQUEVEXTogJy0nLFxuICBbU3RhdHVzLlVOREVGSU5FRF06ICc/Jyxcbn1cblxuY29uc3QgSVNfSVNTVUUgPSB7XG4gIFtTdGF0dXMuQU1CSUdVT1VTXTogdHJ1ZSxcbiAgW1N0YXR1cy5GQUlMRURdOiB0cnVlLFxuICBbU3RhdHVzLlBBU1NFRF06IGZhbHNlLFxuICBbU3RhdHVzLlBFTkRJTkddOiB0cnVlLFxuICBbU3RhdHVzLlNLSVBQRURdOiBmYWxzZSxcbiAgW1N0YXR1cy5VTkRFRklORURdOiB0cnVlLFxufVxuXG5mdW5jdGlvbiBmb3JtYXREYXRhVGFibGUoYXJnKSB7XG4gIGNvbnN0IHJvd3MgPSBhcmcucm93cy5tYXAocm93ID0+XG4gICAgcm93LmNlbGxzLm1hcChjZWxsID0+XG4gICAgICBjZWxsLnZhbHVlLnJlcGxhY2UoL1xcXFwvZywgJ1xcXFxcXFxcJykucmVwbGFjZSgvXFxuL2csICdcXFxcbicpXG4gICAgKVxuICApXG4gIGNvbnN0IHRhYmxlID0gbmV3IFRhYmxlKHtcbiAgICBjaGFyczoge1xuICAgICAgYm90dG9tOiAnJyxcbiAgICAgICdib3R0b20tbGVmdCc6ICcnLFxuICAgICAgJ2JvdHRvbS1taWQnOiAnJyxcbiAgICAgICdib3R0b20tcmlnaHQnOiAnJyxcbiAgICAgIGxlZnQ6ICd8JyxcbiAgICAgICdsZWZ0LW1pZCc6ICcnLFxuICAgICAgbWlkOiAnJyxcbiAgICAgICdtaWQtbWlkJzogJycsXG4gICAgICBtaWRkbGU6ICd8JyxcbiAgICAgIHJpZ2h0OiAnfCcsXG4gICAgICAncmlnaHQtbWlkJzogJycsXG4gICAgICB0b3A6ICcnLFxuICAgICAgJ3RvcC1sZWZ0JzogJycsXG4gICAgICAndG9wLW1pZCc6ICcnLFxuICAgICAgJ3RvcC1yaWdodCc6ICcnLFxuICAgIH0sXG4gICAgc3R5bGU6IHtcbiAgICAgIGJvcmRlcjogW10sXG4gICAgICAncGFkZGluZy1sZWZ0JzogMSxcbiAgICAgICdwYWRkaW5nLXJpZ2h0JzogMSxcbiAgICB9LFxuICB9KVxuICB0YWJsZS5wdXNoKC4uLnJvd3MpXG4gIHJldHVybiB0YWJsZS50b1N0cmluZygpXG59XG5cbmZ1bmN0aW9uIGZvcm1hdERvY1N0cmluZyhhcmcpIHtcbiAgcmV0dXJuIGBcIlwiXCJcXG4ke2FyZy5jb250ZW50fVxcblwiXCJcImBcbn1cblxuZnVuY3Rpb24gZm9ybWF0U3RlcCh7XG4gIGNvbG9yRm5zLFxuICBpc0JlZm9yZUhvb2ssXG4gIGtleXdvcmQsXG4gIGtleXdvcmRUeXBlLFxuICBwaWNrbGVTdGVwLFxuICBzbmlwcGV0QnVpbGRlcixcbiAgdGVzdFN0ZXAsXG59KSB7XG4gIGNvbnN0IHsgc3RhdHVzIH0gPSB0ZXN0U3RlcC5yZXN1bHRcbiAgY29uc3QgY29sb3JGbiA9IGNvbG9yRm5zW3N0YXR1c11cblxuICBsZXQgaWRlbnRpZmllclxuICBpZiAodGVzdFN0ZXAuc291cmNlTG9jYXRpb24pIHtcbiAgICBpZGVudGlmaWVyID0ga2V5d29yZCArIChwaWNrbGVTdGVwLnRleHQgfHwgJycpXG4gIH0gZWxzZSB7XG4gICAgaWRlbnRpZmllciA9IGlzQmVmb3JlSG9vayA/ICdCZWZvcmUnIDogJ0FmdGVyJ1xuICB9XG5cbiAgbGV0IHRleHQgPSBjb2xvckZuKGAke0NIQVJBQ1RFUlNbc3RhdHVzXX0gJHtpZGVudGlmaWVyfWApXG5cbiAgY29uc3QgeyBhY3Rpb25Mb2NhdGlvbiB9ID0gdGVzdFN0ZXBcbiAgaWYgKGFjdGlvbkxvY2F0aW9uKSB7XG4gICAgdGV4dCArPSBgICMgJHtjb2xvckZucy5sb2NhdGlvbihmb3JtYXRMb2NhdGlvbihhY3Rpb25Mb2NhdGlvbikpfWBcbiAgfVxuICB0ZXh0ICs9ICdcXG4nXG5cbiAgaWYgKHBpY2tsZVN0ZXApIHtcbiAgICBsZXQgc3RyXG4gICAgY29uc3QgaXRlcmF0b3IgPSBidWlsZFN0ZXBBcmd1bWVudEl0ZXJhdG9yKHtcbiAgICAgIGRhdGFUYWJsZTogYXJnID0+IChzdHIgPSBmb3JtYXREYXRhVGFibGUoYXJnKSksXG4gICAgICBkb2NTdHJpbmc6IGFyZyA9PiAoc3RyID0gZm9ybWF0RG9jU3RyaW5nKGFyZykpLFxuICAgIH0pXG4gICAgXy5lYWNoKHBpY2tsZVN0ZXAuYXJndW1lbnRzLCBpdGVyYXRvcilcbiAgICBpZiAoc3RyKSB7XG4gICAgICB0ZXh0ICs9IGluZGVudFN0cmluZyhgJHtjb2xvckZuKHN0cil9XFxuYCwgNClcbiAgICB9XG4gIH1cblxuICBpZiAodGVzdFN0ZXAuYXR0YWNobWVudHMpIHtcbiAgICB0ZXN0U3RlcC5hdHRhY2htZW50cy5mb3JFYWNoKCh7IG1lZGlhLCBkYXRhIH0pID0+IHtcbiAgICAgIGNvbnN0IG1lc3NhZ2UgPSBtZWRpYS50eXBlID09PSAndGV4dC9wbGFpbicgPyBgOiAke2RhdGF9YCA6ICcnXG4gICAgICB0ZXh0ICs9IGluZGVudFN0cmluZyhgQXR0YWNobWVudCAoJHttZWRpYS50eXBlfSkke21lc3NhZ2V9XFxuYCwgNClcbiAgICB9KVxuICB9XG5cbiAgY29uc3QgbWVzc2FnZSA9IGdldFN0ZXBNZXNzYWdlKHtcbiAgICBjb2xvckZucyxcbiAgICBrZXl3b3JkVHlwZSxcbiAgICBwaWNrbGVTdGVwLFxuICAgIHNuaXBwZXRCdWlsZGVyLFxuICAgIHRlc3RTdGVwLFxuICB9KVxuICBpZiAobWVzc2FnZSkge1xuICAgIHRleHQgKz0gYCR7aW5kZW50U3RyaW5nKG1lc3NhZ2UsIDQpfVxcbmBcbiAgfVxuICByZXR1cm4gdGV4dFxufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNJc3N1ZShzdGF0dXMpIHtcbiAgcmV0dXJuIElTX0lTU1VFW3N0YXR1c11cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZvcm1hdElzc3VlKHtcbiAgY29sb3JGbnMsXG4gIGdoZXJraW5Eb2N1bWVudCxcbiAgbnVtYmVyLFxuICBwaWNrbGUsXG4gIHNuaXBwZXRCdWlsZGVyLFxuICB0ZXN0Q2FzZSxcbn0pIHtcbiAgY29uc3QgcHJlZml4ID0gYCR7bnVtYmVyfSkgYFxuICBsZXQgdGV4dCA9IHByZWZpeFxuICBjb25zdCBzY2VuYXJpb0xvY2F0aW9uID0gZm9ybWF0TG9jYXRpb24odGVzdENhc2Uuc291cmNlTG9jYXRpb24pXG4gIHRleHQgKz0gYFNjZW5hcmlvOiAke3BpY2tsZS5uYW1lfSBgXG4gIHRleHQgKz0gZ2V0UmV0cnlXYXJuaW5nVGV4dCh0ZXN0Q2FzZSwgY29sb3JGbnMucmV0cnkpXG4gIHRleHQgKz0gYCMgJHtjb2xvckZucy5sb2NhdGlvbihzY2VuYXJpb0xvY2F0aW9uKX1cXG5gXG4gIGNvbnN0IHN0ZXBMaW5lVG9LZXl3b3JkTWFwID0gZ2V0U3RlcExpbmVUb0tleXdvcmRNYXAoZ2hlcmtpbkRvY3VtZW50KVxuICBjb25zdCBzdGVwTGluZVRvUGlja2xlZFN0ZXBNYXAgPSBnZXRTdGVwTGluZVRvUGlja2xlZFN0ZXBNYXAocGlja2xlKVxuICBsZXQgaXNCZWZvcmVIb29rID0gdHJ1ZVxuICBsZXQgcHJldmlvdXNLZXl3b3JkVHlwZSA9IEtleXdvcmRUeXBlLlBSRUNPTkRJVElPTlxuICBfLmVhY2godGVzdENhc2Uuc3RlcHMsIHRlc3RTdGVwID0+IHtcbiAgICBpc0JlZm9yZUhvb2sgPSBpc0JlZm9yZUhvb2sgJiYgIXRlc3RTdGVwLnNvdXJjZUxvY2F0aW9uXG4gICAgbGV0IGtleXdvcmQsIGtleXdvcmRUeXBlLCBwaWNrbGVTdGVwXG4gICAgaWYgKHRlc3RTdGVwLnNvdXJjZUxvY2F0aW9uKSB7XG4gICAgICBwaWNrbGVTdGVwID0gc3RlcExpbmVUb1BpY2tsZWRTdGVwTWFwW3Rlc3RTdGVwLnNvdXJjZUxvY2F0aW9uLmxpbmVdXG4gICAgICBrZXl3b3JkID0gZ2V0U3RlcEtleXdvcmQoeyBwaWNrbGVTdGVwLCBzdGVwTGluZVRvS2V5d29yZE1hcCB9KVxuICAgICAga2V5d29yZFR5cGUgPSBnZXRTdGVwS2V5d29yZFR5cGUoe1xuICAgICAgICBrZXl3b3JkLFxuICAgICAgICBsYW5ndWFnZTogZ2hlcmtpbkRvY3VtZW50LmZlYXR1cmUubGFuZ3VhZ2UsXG4gICAgICAgIHByZXZpb3VzS2V5d29yZFR5cGUsXG4gICAgICB9KVxuICAgIH1cbiAgICBjb25zdCBmb3JtYXR0ZWRTdGVwID0gZm9ybWF0U3RlcCh7XG4gICAgICBjb2xvckZucyxcbiAgICAgIGlzQmVmb3JlSG9vayxcbiAgICAgIGtleXdvcmQsXG4gICAgICBrZXl3b3JkVHlwZSxcbiAgICAgIHBpY2tsZVN0ZXAsXG4gICAgICBzbmlwcGV0QnVpbGRlcixcbiAgICAgIHRlc3RTdGVwLFxuICAgIH0pXG4gICAgdGV4dCArPSBpbmRlbnRTdHJpbmcoZm9ybWF0dGVkU3RlcCwgcHJlZml4Lmxlbmd0aClcbiAgICBwcmV2aW91c0tleXdvcmRUeXBlID0ga2V5d29yZFR5cGVcbiAgfSlcbiAgcmV0dXJuIGAke3RleHR9XFxuYFxufVxuXG5mdW5jdGlvbiBnZXRSZXRyeVdhcm5pbmdUZXh0KHRlc3RDYXNlLCBmbGFreUNvbG9yRm4pIHtcbiAgY29uc3QgcmVzdWx0ID0gdGVzdENhc2UucmVzdWx0XG4gIGlmICghdGVzdENhc2UucmVzdWx0KSB7XG4gICAgcmV0dXJuICcnXG4gIH1cbiAgY29uc3QgYXR0ZW1wdE51bWJlciA9IHRlc3RDYXNlLmF0dGVtcHROdW1iZXJcbiAgaWYgKGF0dGVtcHROdW1iZXIgPiAxIHx8IHJlc3VsdC5zdGF0dXMgPT09IFN0YXR1cy5SRVRSWSkge1xuICAgIHJldHVybiBmbGFreUNvbG9yRm4oYChhdHRlbXB0ICMke2F0dGVtcHROdW1iZXJ9KSBgKVxuICB9XG4gIHJldHVybiAnJ1xufVxuIl19