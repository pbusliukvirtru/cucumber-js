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

var _2 = require('./');

var _3 = _interopRequireDefault(_2);

var _status = require('../status');

var _status2 = _interopRequireDefault(_status);

var _helpers = require('./helpers');

var _step_arguments = require('../step_arguments');

var _assertionErrorFormatter = require('assertion-error-formatter');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getStepLineToKeywordMap = _helpers.GherkinDocumentParser.getStepLineToKeywordMap,
    getScenarioLineToDescriptionMap = _helpers.GherkinDocumentParser.getScenarioLineToDescriptionMap;
var getScenarioDescription = _helpers.PickleParser.getScenarioDescription,
    getStepLineToPickledStepMap = _helpers.PickleParser.getStepLineToPickledStepMap,
    getStepKeyword = _helpers.PickleParser.getStepKeyword;

var JsonFormatter = function (_Formatter) {
  (0, _inherits3.default)(JsonFormatter, _Formatter);

  function JsonFormatter(options) {
    (0, _classCallCheck3.default)(this, JsonFormatter);

    var _this = (0, _possibleConstructorReturn3.default)(this, (JsonFormatter.__proto__ || Object.getPrototypeOf(JsonFormatter)).call(this, options));

    options.eventBroadcaster.on('test-run-finished', _this.onTestRunFinished.bind(_this));
    return _this;
  }

  (0, _createClass3.default)(JsonFormatter, [{
    key: 'convertNameToId',
    value: function convertNameToId(obj) {
      return obj.name.replace(/ /g, '-').toLowerCase();
    }
  }, {
    key: 'formatDataTable',
    value: function formatDataTable(dataTable) {
      return {
        rows: dataTable.rows.map(function (row) {
          return { cells: _lodash2.default.map(row.cells, 'value') };
        })
      };
    }
  }, {
    key: 'formatDocString',
    value: function formatDocString(docString) {
      return {
        content: docString.content,
        line: docString.location.line
      };
    }
  }, {
    key: 'formatStepArguments',
    value: function formatStepArguments(stepArguments) {
      var iterator = (0, _step_arguments.buildStepArgumentIterator)({
        dataTable: this.formatDataTable.bind(this),
        docString: this.formatDocString.bind(this)
      });
      return _lodash2.default.map(stepArguments, iterator);
    }
  }, {
    key: 'onTestRunFinished',
    value: function onTestRunFinished() {
      var _this2 = this;

      var groupedTestCases = {};
      _lodash2.default.each(this.eventDataCollector.testCaseMap, function (testCase) {
        var uri = testCase.sourceLocation.uri;

        if (!groupedTestCases[uri]) {
          groupedTestCases[uri] = [];
        }
        groupedTestCases[uri].push(testCase);
      });
      var features = _lodash2.default.map(groupedTestCases, function (group, uri) {
        var gherkinDocument = _this2.eventDataCollector.gherkinDocumentMap[uri];
        var featureData = _this2.getFeatureData(gherkinDocument.feature, uri);
        var stepLineToKeywordMap = getStepLineToKeywordMap(gherkinDocument);
        var scenarioLineToDescriptionMap = getScenarioLineToDescriptionMap(gherkinDocument);
        featureData.elements = group.map(function (testCase) {
          var _eventDataCollector$g = _this2.eventDataCollector.getTestCaseData(testCase.sourceLocation),
              pickle = _eventDataCollector$g.pickle;

          var scenarioData = _this2.getScenarioData({
            featureId: featureData.id,
            pickle: pickle,
            scenarioLineToDescriptionMap: scenarioLineToDescriptionMap
          });
          var attemptNumber = testCase.attemptNumber;
          if (attemptNumber > 1) {
            scenarioData.attemptNumber = attemptNumber;
          }
          var stepLineToPickledStepMap = getStepLineToPickledStepMap(pickle);
          var isBeforeHook = true;
          scenarioData.steps = testCase.steps.map(function (testStep) {
            isBeforeHook = isBeforeHook && !testStep.sourceLocation;
            return _this2.getStepData({
              isBeforeHook: isBeforeHook,
              stepLineToKeywordMap: stepLineToKeywordMap,
              stepLineToPickledStepMap: stepLineToPickledStepMap,
              testStep: testStep
            });
          });
          return scenarioData;
        });
        return featureData;
      });
      this.log(JSON.stringify(features, null, 2));
    }
  }, {
    key: 'getFeatureData',
    value: function getFeatureData(feature, uri) {
      return {
        description: feature.description,
        keyword: feature.keyword,
        name: feature.name,
        line: feature.location.line,
        id: this.convertNameToId(feature),
        tags: this.getTags(feature),
        uri: uri
      };
    }
  }, {
    key: 'getScenarioData',
    value: function getScenarioData(_ref) {
      var featureId = _ref.featureId,
          pickle = _ref.pickle,
          scenarioLineToDescriptionMap = _ref.scenarioLineToDescriptionMap;

      var description = getScenarioDescription({
        pickle: pickle,
        scenarioLineToDescriptionMap: scenarioLineToDescriptionMap
      });
      return {
        description: description,
        id: featureId + ';' + this.convertNameToId(pickle),
        keyword: 'Scenario',
        line: pickle.locations[0].line,
        name: pickle.name,
        tags: this.getTags(pickle),
        type: 'scenario'
      };
    }
  }, {
    key: 'getStepData',
    value: function getStepData(_ref2) {
      var isBeforeHook = _ref2.isBeforeHook,
          stepLineToKeywordMap = _ref2.stepLineToKeywordMap,
          stepLineToPickledStepMap = _ref2.stepLineToPickledStepMap,
          testStep = _ref2.testStep;

      var data = {};
      if (testStep.sourceLocation) {
        var line = testStep.sourceLocation.line;

        var pickleStep = stepLineToPickledStepMap[line];
        data.arguments = this.formatStepArguments(pickleStep.arguments);
        data.keyword = getStepKeyword({ pickleStep: pickleStep, stepLineToKeywordMap: stepLineToKeywordMap });
        data.line = line;
        data.name = pickleStep.text;
      } else {
        data.keyword = isBeforeHook ? 'Before' : 'After';
        data.hidden = true;
      }
      if (testStep.actionLocation) {
        data.match = { location: (0, _helpers.formatLocation)(testStep.actionLocation) };
      }
      if (testStep.result) {
        var _testStep$result = testStep.result,
            exception = _testStep$result.exception,
            status = _testStep$result.status;

        data.result = { status: status };
        if (testStep.result.duration) {
          data.result.duration = testStep.result.duration * 1000000;
        }
        if (status === _status2.default.FAILED && exception) {
          data.result.error_message = (0, _assertionErrorFormatter.format)(exception);
        }
      }
      if (_lodash2.default.size(testStep.attachments) > 0) {
        data.embeddings = testStep.attachments.map(function (attachment) {
          return {
            data: attachment.data,
            mime_type: attachment.media.type
          };
        });
      }
      return data;
    }
  }, {
    key: 'getTags',
    value: function getTags(obj) {
      return _lodash2.default.map(obj.tags, function (tagData) {
        return {
          name: tagData.name,
          line: tagData.location.line
        };
      });
    }
  }]);
  return JsonFormatter;
}(_3.default);

exports.default = JsonFormatter;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9mb3JtYXR0ZXIvanNvbl9mb3JtYXR0ZXIuanMiXSwibmFtZXMiOlsiZ2V0U3RlcExpbmVUb0tleXdvcmRNYXAiLCJnZXRTY2VuYXJpb0xpbmVUb0Rlc2NyaXB0aW9uTWFwIiwiZ2V0U2NlbmFyaW9EZXNjcmlwdGlvbiIsImdldFN0ZXBMaW5lVG9QaWNrbGVkU3RlcE1hcCIsImdldFN0ZXBLZXl3b3JkIiwiSnNvbkZvcm1hdHRlciIsIm9wdGlvbnMiLCJldmVudEJyb2FkY2FzdGVyIiwib24iLCJvblRlc3RSdW5GaW5pc2hlZCIsIm9iaiIsIm5hbWUiLCJyZXBsYWNlIiwidG9Mb3dlckNhc2UiLCJkYXRhVGFibGUiLCJyb3dzIiwibWFwIiwiY2VsbHMiLCJyb3ciLCJkb2NTdHJpbmciLCJjb250ZW50IiwibGluZSIsImxvY2F0aW9uIiwic3RlcEFyZ3VtZW50cyIsIml0ZXJhdG9yIiwiZm9ybWF0RGF0YVRhYmxlIiwiYmluZCIsImZvcm1hdERvY1N0cmluZyIsImdyb3VwZWRUZXN0Q2FzZXMiLCJlYWNoIiwiZXZlbnREYXRhQ29sbGVjdG9yIiwidGVzdENhc2VNYXAiLCJ1cmkiLCJ0ZXN0Q2FzZSIsInNvdXJjZUxvY2F0aW9uIiwicHVzaCIsImZlYXR1cmVzIiwiZ3JvdXAiLCJnaGVya2luRG9jdW1lbnQiLCJnaGVya2luRG9jdW1lbnRNYXAiLCJmZWF0dXJlRGF0YSIsImdldEZlYXR1cmVEYXRhIiwiZmVhdHVyZSIsInN0ZXBMaW5lVG9LZXl3b3JkTWFwIiwic2NlbmFyaW9MaW5lVG9EZXNjcmlwdGlvbk1hcCIsImVsZW1lbnRzIiwiZ2V0VGVzdENhc2VEYXRhIiwicGlja2xlIiwic2NlbmFyaW9EYXRhIiwiZ2V0U2NlbmFyaW9EYXRhIiwiZmVhdHVyZUlkIiwiaWQiLCJhdHRlbXB0TnVtYmVyIiwic3RlcExpbmVUb1BpY2tsZWRTdGVwTWFwIiwiaXNCZWZvcmVIb29rIiwic3RlcHMiLCJ0ZXN0U3RlcCIsImdldFN0ZXBEYXRhIiwibG9nIiwiSlNPTiIsInN0cmluZ2lmeSIsImRlc2NyaXB0aW9uIiwia2V5d29yZCIsImNvbnZlcnROYW1lVG9JZCIsInRhZ3MiLCJnZXRUYWdzIiwibG9jYXRpb25zIiwidHlwZSIsImRhdGEiLCJwaWNrbGVTdGVwIiwiYXJndW1lbnRzIiwiZm9ybWF0U3RlcEFyZ3VtZW50cyIsInRleHQiLCJoaWRkZW4iLCJhY3Rpb25Mb2NhdGlvbiIsIm1hdGNoIiwicmVzdWx0IiwiZXhjZXB0aW9uIiwic3RhdHVzIiwiZHVyYXRpb24iLCJGQUlMRUQiLCJlcnJvcl9tZXNzYWdlIiwic2l6ZSIsImF0dGFjaG1lbnRzIiwiZW1iZWRkaW5ncyIsImF0dGFjaG1lbnQiLCJtaW1lX3R5cGUiLCJtZWRpYSIsInRhZ0RhdGEiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7QUFDQTs7QUFDQTs7OztJQUdFQSx1QixrQ0FBQUEsdUI7SUFDQUMsK0Isa0NBQUFBLCtCO0lBSUFDLHNCLHlCQUFBQSxzQjtJQUNBQywyQix5QkFBQUEsMkI7SUFDQUMsYyx5QkFBQUEsYzs7SUFHbUJDLGE7OztBQUNuQix5QkFBWUMsT0FBWixFQUFxQjtBQUFBOztBQUFBLDRJQUNiQSxPQURhOztBQUVuQkEsWUFBUUMsZ0JBQVIsQ0FBeUJDLEVBQXpCLENBQTRCLG1CQUE1QixFQUFtRCxNQUFLQyxpQkFBeEQ7QUFGbUI7QUFHcEI7Ozs7b0NBRWVDLEcsRUFBSztBQUNuQixhQUFPQSxJQUFJQyxJQUFKLENBQVNDLE9BQVQsQ0FBaUIsSUFBakIsRUFBdUIsR0FBdkIsRUFBNEJDLFdBQTVCLEVBQVA7QUFDRDs7O29DQUVlQyxTLEVBQVc7QUFDekIsYUFBTztBQUNMQyxjQUFNRCxVQUFVQyxJQUFWLENBQWVDLEdBQWYsQ0FBbUI7QUFBQSxpQkFBUSxFQUFFQyxPQUFPLGlCQUFFRCxHQUFGLENBQU1FLElBQUlELEtBQVYsRUFBaUIsT0FBakIsQ0FBVCxFQUFSO0FBQUEsU0FBbkI7QUFERCxP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QUFsQjtBQUlEO0FBQ0QsYUFBT0MsSUFBUDtBQUNEOzs7NEJBRU8xRCxHLEVBQUs7QUFDWCxhQUFPLGlCQUFFTSxHQUFGLENBQU1OLElBQUlzRCxJQUFWLEVBQWdCO0FBQUEsZUFBWTtBQUNqQ3JELGdCQUFNNkUsUUFBUTdFLElBRG1CO0FBRWpDVSxnQkFBTW1FLFFBQVFsRSxRQUFSLENBQWlCRDtBQUZVLFNBQVo7QUFBQSxPQUFoQixDQUFQO0FBSUQ7Ozs7O2tCQTNKa0JoQixhIiwiZmlsZSI6Impzb25fZm9ybWF0dGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IF8gZnJvbSAnbG9kYXNoJ1xuaW1wb3J0IEZvcm1hdHRlciBmcm9tICcuLydcbmltcG9ydCBTdGF0dXMgZnJvbSAnLi4vc3RhdHVzJ1xuaW1wb3J0IHsgZm9ybWF0TG9jYXRpb24sIEdoZXJraW5Eb2N1bWVudFBhcnNlciwgUGlja2xlUGFyc2VyIH0gZnJvbSAnLi9oZWxwZXJzJ1xuaW1wb3J0IHsgYnVpbGRTdGVwQXJndW1lbnRJdGVyYXRvciB9IGZyb20gJy4uL3N0ZXBfYXJndW1lbnRzJ1xuaW1wb3J0IHsgZm9ybWF0IH0gZnJvbSAnYXNzZXJ0aW9uLWVycm9yLWZvcm1hdHRlcidcblxuY29uc3Qge1xuICBnZXRTdGVwTGluZVRvS2V5d29yZE1hcCxcbiAgZ2V0U2NlbmFyaW9MaW5lVG9EZXNjcmlwdGlvbk1hcCxcbn0gPSBHaGVya2luRG9jdW1lbnRQYXJzZXJcblxuY29uc3Qge1xuICBnZXRTY2VuYXJpb0Rlc2NyaXB0aW9uLFxuICBnZXRTdGVwTGluZVRvUGlja2xlZFN0ZXBNYXAsXG4gIGdldFN0ZXBLZXl3b3JkLFxufSA9IFBpY2tsZVBhcnNlclxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBKc29uRm9ybWF0dGVyIGV4dGVuZHMgRm9ybWF0dGVyIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgIHN1cGVyKG9wdGlvbnMpXG4gICAgb3B0aW9ucy5ldmVudEJyb2FkY2FzdGVyLm9uKCd0ZXN0LXJ1bi1maW5pc2hlZCcsIDo6dGhpcy5vblRlc3RSdW5GaW5pc2hlZClcbiAgfVxuXG4gIGNvbnZlcnROYW1lVG9JZChvYmopIHtcbiAgICByZXR1cm4gb2JqLm5hbWUucmVwbGFjZSgvIC9nLCAnLScpLnRvTG93ZXJDYXNlKClcbiAgfVxuXG4gIGZvcm1hdERhdGFUYWJsZShkYXRhVGFibGUpIHtcbiAgICByZXR1cm4ge1xuICAgICAgcm93czogZGF0YVRhYmxlLnJvd3MubWFwKHJvdyA9PiAoeyBjZWxsczogXy5tYXAocm93LmNlbGxzLCAndmFsdWUnKSB9KSksXG4gICAgfVxuICB9XG5cbiAgZm9ybWF0RG9jU3RyaW5nKGRvY1N0cmluZykge1xuICAgIHJldHVybiB7XG4gICAgICBjb250ZW50OiBkb2NTdHJpbmcuY29udGVudCxcbiAgICAgIGxpbmU6IGRvY1N0cmluZy5sb2NhdGlvbi5saW5lLFxuICAgIH1cbiAgfVxuXG4gIGZvcm1hdFN0ZXBBcmd1bWVudHMoc3RlcEFyZ3VtZW50cykge1xuICAgIGNvbnN0IGl0ZXJhdG9yID0gYnVpbGRTdGVwQXJndW1lbnRJdGVyYXRvcih7XG4gICAgICBkYXRhVGFibGU6IHRoaXMuZm9ybWF0RGF0YVRhYmxlLmJpbmQodGhpcyksXG4gICAgICBkb2NTdHJpbmc6IHRoaXMuZm9ybWF0RG9jU3RyaW5nLmJpbmQodGhpcyksXG4gICAgfSlcbiAgICByZXR1cm4gXy5tYXAoc3RlcEFyZ3VtZW50cywgaXRlcmF0b3IpXG4gIH1cblxuICBvblRlc3RSdW5GaW5pc2hlZCgpIHtcbiAgICBjb25zdCBncm91cGVkVGVzdENhc2VzID0ge31cbiAgICBfLmVhY2godGhpcy5ldmVudERhdGFDb2xsZWN0b3IudGVzdENhc2VNYXAsIHRlc3RDYXNlID0+IHtcbiAgICAgIGNvbnN0IHtcbiAgICAgICAgc291cmNlTG9jYXRpb246IHsgdXJpIH0sXG4gICAgICB9ID0gdGVzdENhc2VcbiAgICAgIGlmICghZ3JvdXBlZFRlc3RDYXNlc1t1cmldKSB7XG4gICAgICAgIGdyb3VwZWRUZXN0Q2FzZXNbdXJpXSA9IFtdXG4gICAgICB9XG4gICAgICBncm91cGVkVGVzdENhc2VzW3VyaV0ucHVzaCh0ZXN0Q2FzZSlcbiAgICB9KVxuICAgIGNvbnN0IGZlYXR1cmVzID0gXy5tYXAoZ3JvdXBlZFRlc3RDYXNlcywgKGdyb3VwLCB1cmkpID0+IHtcbiAgICAgIGNvbnN0IGdoZXJraW5Eb2N1bWVudCA9IHRoaXMuZXZlbnREYXRhQ29sbGVjdG9yLmdoZXJraW5Eb2N1bWVudE1hcFt1cmldXG4gICAgICBjb25zdCBmZWF0dXJlRGF0YSA9IHRoaXMuZ2V0RmVhdHVyZURhdGEoZ2hlcmtpbkRvY3VtZW50LmZlYXR1cmUsIHVyaSlcbiAgICAgIGNvbnN0IHN0ZXBMaW5lVG9LZXl3b3JkTWFwID0gZ2V0U3RlcExpbmVUb0tleXdvcmRNYXAoZ2hlcmtpbkRvY3VtZW50KVxuICAgICAgY29uc3Qgc2NlbmFyaW9MaW5lVG9EZXNjcmlwdGlvbk1hcCA9IGdldFNjZW5hcmlvTGluZVRvRGVzY3JpcHRpb25NYXAoXG4gICAgICAgIGdoZXJraW5Eb2N1bWVudFxuICAgICAgKVxuICAgICAgZmVhdHVyZURhdGEuZWxlbWVudHMgPSBncm91cC5tYXAodGVzdENhc2UgPT4ge1xuICAgICAgICBjb25zdCB7IHBpY2tsZSB9ID0gdGhpcy5ldmVudERhdGFDb2xsZWN0b3IuZ2V0VGVzdENhc2VEYXRhKFxuICAgICAgICAgIHRlc3RDYXNlLnNvdXJjZUxvY2F0aW9uXG4gICAgICAgIClcbiAgICAgICAgY29uc3Qgc2NlbmFyaW9EYXRhID0gdGhpcy5nZXRTY2VuYXJpb0RhdGEoe1xuICAgICAgICAgIGZlYXR1cmVJZDogZmVhdHVyZURhdGEuaWQsXG4gICAgICAgICAgcGlja2xlLFxuICAgICAgICAgIHNjZW5hcmlvTGluZVRvRGVzY3JpcHRpb25NYXAsXG4gICAgICAgIH0pXG4gICAgICAgIGNvbnN0IGF0dGVtcHROdW1iZXIgPSB0ZXN0Q2FzZS5hdHRlbXB0TnVtYmVyXG4gICAgICAgIGlmIChhdHRlbXB0TnVtYmVyID4gMSkge1xuICAgICAgICAgIHNjZW5hcmlvRGF0YS5hdHRlbXB0TnVtYmVyID0gYXR0ZW1wdE51bWJlclxuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHN0ZXBMaW5lVG9QaWNrbGVkU3RlcE1hcCA9IGdldFN0ZXBMaW5lVG9QaWNrbGVkU3RlcE1hcChwaWNrbGUpXG4gICAgICAgIGxldCBpc0JlZm9yZUhvb2sgPSB0cnVlXG4gICAgICAgIHNjZW5hcmlvRGF0YS5zdGVwcyA9IHRlc3RDYXNlLnN0ZXBzLm1hcCh0ZXN0U3RlcCA9PiB7XG4gICAgICAgICAgaXNCZWZvcmVIb29rID0gaXNCZWZvcmVIb29rICYmICF0ZXN0U3RlcC5zb3VyY2VMb2NhdGlvblxuICAgICAgICAgIHJldHVybiB0aGlzLmdldFN0ZXBEYXRhKHtcbiAgICAgICAgICAgIGlzQmVmb3JlSG9vayxcbiAgICAgICAgICAgIHN0ZXBMaW5lVG9LZXl3b3JkTWFwLFxuICAgICAgICAgICAgc3RlcExpbmVUb1BpY2tsZWRTdGVwTWFwLFxuICAgICAgICAgICAgdGVzdFN0ZXAsXG4gICAgICAgICAgfSlcbiAgICAgICAgfSlcbiAgICAgICAgcmV0dXJuIHNjZW5hcmlvRGF0YVxuICAgICAgfSlcbiAgICAgIHJldHVybiBmZWF0dXJlRGF0YVxuICAgIH0pXG4gICAgdGhpcy5sb2coSlNPTi5zdHJpbmdpZnkoZmVhdHVyZXMsIG51bGwsIDIpKVxuICB9XG5cbiAgZ2V0RmVhdHVyZURhdGEoZmVhdHVyZSwgdXJpKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGRlc2NyaXB0aW9uOiBmZWF0dXJlLmRlc2NyaXB0aW9uLFxuICAgICAga2V5d29yZDogZmVhdHVyZS5rZXl3b3JkLFxuICAgICAgbmFtZTogZmVhdHVyZS5uYW1lLFxuICAgICAgbGluZTogZmVhdHVyZS5sb2NhdGlvbi5saW5lLFxuICAgICAgaWQ6IHRoaXMuY29udmVydE5hbWVUb0lkKGZlYXR1cmUpLFxuICAgICAgdGFnczogdGhpcy5nZXRUYWdzKGZlYXR1cmUpLFxuICAgICAgdXJpLFxuICAgIH1cbiAgfVxuXG4gIGdldFNjZW5hcmlvRGF0YSh7IGZlYXR1cmVJZCwgcGlja2xlLCBzY2VuYXJpb0xpbmVUb0Rlc2NyaXB0aW9uTWFwIH0pIHtcbiAgICBjb25zdCBkZXNjcmlwdGlvbiA9IGdldFNjZW5hcmlvRGVzY3JpcHRpb24oe1xuICAgICAgcGlja2xlLFxuICAgICAgc2NlbmFyaW9MaW5lVG9EZXNjcmlwdGlvbk1hcCxcbiAgICB9KVxuICAgIHJldHVybiB7XG4gICAgICBkZXNjcmlwdGlvbixcbiAgICAgIGlkOiBgJHtmZWF0dXJlSWR9OyR7dGhpcy5jb252ZXJ0TmFtZVRvSWQocGlja2xlKX1gLFxuICAgICAga2V5d29yZDogJ1NjZW5hcmlvJyxcbiAgICAgIGxpbmU6IHBpY2tsZS5sb2NhdGlvbnNbMF0ubGluZSxcbiAgICAgIG5hbWU6IHBpY2tsZS5uYW1lLFxuICAgICAgdGFnczogdGhpcy5nZXRUYWdzKHBpY2tsZSksXG4gICAgICB0eXBlOiAnc2NlbmFyaW8nLFxuICAgIH1cbiAgfVxuXG4gIGdldFN0ZXBEYXRhKHtcbiAgICBpc0JlZm9yZUhvb2ssXG4gICAgc3RlcExpbmVUb0tleXdvcmRNYXAsXG4gICAgc3RlcExpbmVUb1BpY2tsZWRTdGVwTWFwLFxuICAgIHRlc3RTdGVwLFxuICB9KSB7XG4gICAgY29uc3QgZGF0YSA9IHt9XG4gICAgaWYgKHRlc3RTdGVwLnNvdXJjZUxvY2F0aW9uKSB7XG4gICAgICBjb25zdCB7IGxpbmUgfSA9IHRlc3RTdGVwLnNvdXJjZUxvY2F0aW9uXG4gICAgICBjb25zdCBwaWNrbGVTdGVwID0gc3RlcExpbmVUb1BpY2tsZWRTdGVwTWFwW2xpbmVdXG4gICAgICBkYXRhLmFyZ3VtZW50cyA9IHRoaXMuZm9ybWF0U3RlcEFyZ3VtZW50cyhwaWNrbGVTdGVwLmFyZ3VtZW50cylcbiAgICAgIGRhdGEua2V5d29yZCA9IGdldFN0ZXBLZXl3b3JkKHsgcGlja2xlU3RlcCwgc3RlcExpbmVUb0tleXdvcmRNYXAgfSlcbiAgICAgIGRhdGEubGluZSA9IGxpbmVcbiAgICAgIGRhdGEubmFtZSA9IHBpY2tsZVN0ZXAudGV4dFxuICAgIH0gZWxzZSB7XG4gICAgICBkYXRhLmtleXdvcmQgPSBpc0JlZm9yZUhvb2sgPyAnQmVmb3JlJyA6ICdBZnRlcidcbiAgICAgIGRhdGEuaGlkZGVuID0gdHJ1ZVxuICAgIH1cbiAgICBpZiAodGVzdFN0ZXAuYWN0aW9uTG9jYXRpb24pIHtcbiAgICAgIGRhdGEubWF0Y2ggPSB7IGxvY2F0aW9uOiBmb3JtYXRMb2NhdGlvbih0ZXN0U3RlcC5hY3Rpb25Mb2NhdGlvbikgfVxuICAgIH1cbiAgICBpZiAodGVzdFN0ZXAucmVzdWx0KSB7XG4gICAgICBjb25zdCB7XG4gICAgICAgIHJlc3VsdDogeyBleGNlcHRpb24sIHN0YXR1cyB9LFxuICAgICAgfSA9IHRlc3RTdGVwXG4gICAgICBkYXRhLnJlc3VsdCA9IHsgc3RhdHVzIH1cbiAgICAgIGlmICh0ZXN0U3RlcC5yZXN1bHQuZHVyYXRpb24pIHtcbiAgICAgICAgZGF0YS5yZXN1bHQuZHVyYXRpb24gPSB0ZXN0U3RlcC5yZXN1bHQuZHVyYXRpb24gKiAxMDAwMDAwXG4gICAgICB9XG4gICAgICBpZiAoc3RhdHVzID09PSBTdGF0dXMuRkFJTEVEICYmIGV4Y2VwdGlvbikge1xuICAgICAgICBkYXRhLnJlc3VsdC5lcnJvcl9tZXNzYWdlID0gZm9ybWF0KGV4Y2VwdGlvbilcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKF8uc2l6ZSh0ZXN0U3RlcC5hdHRhY2htZW50cykgPiAwKSB7XG4gICAgICBkYXRhLmVtYmVkZGluZ3MgPSB0ZXN0U3RlcC5hdHRhY2htZW50cy5tYXAoYXR0YWNobWVudCA9PiAoe1xuICAgICAgICBkYXRhOiBhdHRhY2htZW50LmRhdGEsXG4gICAgICAgIG1pbWVfdHlwZTogYXR0YWNobWVudC5tZWRpYS50eXBlLFxuICAgICAgfSkpXG4gICAgfVxuICAgIHJldHVybiBkYXRhXG4gIH1cblxuICBnZXRUYWdzKG9iaikge1xuICAgIHJldHVybiBfLm1hcChvYmoudGFncywgdGFnRGF0YSA9PiAoe1xuICAgICAgbmFtZTogdGFnRGF0YS5uYW1lLFxuICAgICAgbGluZTogdGFnRGF0YS5sb2NhdGlvbi5saW5lLFxuICAgIH0pKVxuICB9XG59XG4iXX0=