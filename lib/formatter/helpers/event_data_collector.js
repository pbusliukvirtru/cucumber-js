'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _gherkin_document_parser = require('./gherkin_document_parser');

var _pickle_parser = require('./pickle_parser');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var EventDataCollector = function () {
  function EventDataCollector(eventBroadcaster) {
    (0, _classCallCheck3.default)(this, EventDataCollector);

    eventBroadcaster.on('gherkin-document', this.storeGherkinDocument.bind(this)).on('pickle-accepted', this.storePickle.bind(this)).on('test-case-prepared', this.storeTestCase.bind(this)).on('test-step-attachment', this.storeTestStepAttachment.bind(this)).on('test-step-finished', this.storeTestStepResult.bind(this)).on('test-case-finished', this.storeTestCaseResult.bind(this));
    this.gherkinDocumentMap = {}; // uri to gherkinDocument
    this.pickleMap = {}; // uri:line to {pickle, uri}
    this.testCaseMap = {}; // uri:line to {sourceLocation, steps, result}
  }

  (0, _createClass3.default)(EventDataCollector, [{
    key: 'getTestCaseKey',
    value: function getTestCaseKey(_ref) {
      var uri = _ref.uri,
          line = _ref.line;

      return uri + ':' + line;
    }
  }, {
    key: 'getTestCaseData',
    value: function getTestCaseData(sourceLocation) {
      return {
        gherkinDocument: this.gherkinDocumentMap[sourceLocation.uri],
        pickle: this.pickleMap[this.getTestCaseKey(sourceLocation)],
        testCase: this.testCaseMap[this.getTestCaseKey(sourceLocation)]
      };
    }
  }, {
    key: 'getTestStepData',
    value: function getTestStepData(_ref2) {
      var sourceLocation = _ref2.testCase.sourceLocation,
          index = _ref2.index;

      var _getTestCaseData = this.getTestCaseData(sourceLocation),
          gherkinDocument = _getTestCaseData.gherkinDocument,
          pickle = _getTestCaseData.pickle,
          testCase = _getTestCaseData.testCase;

      var result = { testStep: testCase.steps[index] };
      if (result.testStep.sourceLocation) {
        var line = result.testStep.sourceLocation.line;

        result.gherkinKeyword = (0, _gherkin_document_parser.getStepLineToKeywordMap)(gherkinDocument)[line];
        result.pickleStep = (0, _pickle_parser.getStepLineToPickledStepMap)(pickle)[line];
      }
      return result;
    }
  }, {
    key: 'storeGherkinDocument',
    value: function storeGherkinDocument(_ref3) {
      var document = _ref3.document,
          uri = _ref3.uri;

      this.gherkinDocumentMap[uri] = document;
    }
  }, {
    key: 'storePickle',
    value: function storePickle(_ref4) {
      var pickle = _ref4.pickle,
          uri = _ref4.uri;

      this.pickleMap[uri + ':' + pickle.locations[0].line] = pickle;
    }
  }, {
    key: 'storeTestCase',
    value: function storeTestCase(_ref5) {
      var sourceLocation = _ref5.sourceLocation,
          steps = _ref5.steps;

      var key = this.getTestCaseKey(sourceLocation);
      this.testCaseMap[key] = { sourceLocation: sourceLocation, steps: steps };
    }
  }, {
    key: 'storeTestStepAttachment',
    value: function storeTestStepAttachment(_ref6) {
      var index = _ref6.index,
          testCase = _ref6.testCase,
          data = _ref6.data,
          media = _ref6.media;

      var key = this.getTestCaseKey(testCase.sourceLocation);
      var step = this.testCaseMap[key].steps[index];
      if (!step.attachments) {
        step.attachments = [];
      }
      step.attachments.push({ data: data, media: media });
    }
  }, {
    key: 'storeTestStepResult',
    value: function storeTestStepResult(_ref7) {
      var index = _ref7.index,
          testCase = _ref7.testCase,
          result = _ref7.result;

      var key = this.getTestCaseKey(testCase.sourceLocation);
      this.testCaseMap[key].steps[index].result = result;
    }
  }, {
    key: 'storeTestCaseResult',
    value: function storeTestCaseResult(_ref8) {
      var attemptNumber = _ref8.attemptNumber,
          sourceLocation = _ref8.sourceLocation,
          result = _ref8.result;

      var key = this.getTestCaseKey(sourceLocation);
      var testCase = this.testCaseMap[key];
      testCase.attemptNumber = attemptNumber;
      testCase.result = result;
    }
  }]);
  return EventDataCollector;
}();

exports.default = EventDataCollector;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9mb3JtYXR0ZXIvaGVscGVycy9ldmVudF9kYXRhX2NvbGxlY3Rvci5qcyJdLCJuYW1lcyI6WyJFdmVudERhdGFDb2xsZWN0b3IiLCJldmVudEJyb2FkY2FzdGVyIiwib24iLCJzdG9yZUdoZXJraW5Eb2N1bWVudCIsInN0b3JlUGlja2xlIiwic3RvcmVUZXN0Q2FzZSIsInN0b3JlVGVzdFN0ZXBBdHRhY2htZW50Iiwic3RvcmVUZXN0U3RlcFJlc3VsdCIsInN0b3JlVGVzdENhc2VSZXN1bHQiLCJnaGVya2luRG9jdW1lbnRNYXAiLCJwaWNrbGVNYXAiLCJ0ZXN0Q2FzZU1hcCIsInVyaSIsImxpbmUiLCJzb3VyY2VMb2NhdGlvbiIsImdoZXJraW5Eb2N1bWVudCIsInBpY2tsZSIsImdldFRlc3RDYXNlS2V5IiwidGVzdENhc2UiLCJpbmRleCIsImdldFRlc3RDYXNlRGF0YSIsInJlc3VsdCIsInRlc3RTdGVwIiwic3RlcHMiLCJnaGVya2luS2V5d29yZCIsInBpY2tsZVN0ZXAiLCJkb2N1bWVudCIsImxvY2F0aW9ucyIsImtleSIsImRhdGEiLCJtZWRpYSIsInN0ZXAiLCJhdHRhY2htZW50cyIsInB1c2giLCJhdHRlbXB0TnVtYmVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFBOztBQUNBOzs7O0lBRXFCQSxrQjtBQUNuQiw4QkFBWUMsZ0JBQVosRUFBOEI7QUFBQTs7QUFDNUJBLHFCQUNHQyxFQURILENBQ00sa0JBRE4sRUFDNEIsS0FBS0Msb0JBRGpDLE1BQzRCLElBRDVCLEdBRUdELEVBRkgsQ0FFTSxpQkFGTixFQUUyQixLQUFLRSxXQUZoQyxNQUUyQixJQUYzQixHQUdHRixFQUhILENBR00sb0JBSE4sRUFHOEIsS0FBS0csYUFIbkMsTUFHOEIsSUFIOUIsR0FJR0gsRUFKSCxDQUlNLHNCQUpOLEVBSWdDLEtBQUtJLHVCQUpyQyxNQUlnQyxJQUpoQyxHQUtHSixFQUxILENBS00sb0JBTE4sRUFLOEIsS0FBS0ssbUJB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QjtBQUNEO0FBQ0RELFdBQUtDLFdBQUwsQ0FBaUJDLElBQWpCLENBQXNCLEVBQUVKLFVBQUYsRUFBUUMsWUFBUixFQUF0QjtBQUNEOzs7K0NBRWdEO0FBQUEsVUFBM0JYLEtBQTJCLFNBQTNCQSxLQUEyQjtBQUFBLFVBQXBCRCxRQUFvQixTQUFwQkEsUUFBb0I7QUFBQSxVQUFWRyxNQUFVLFNBQVZBLE1BQVU7O0FBQy9DLFVBQU1PLE1BQU0sS0FBS1gsY0FBTCxDQUFvQkMsU0FBU0osY0FBN0IsQ0FBWjtBQUNBLFdBQUtILFdBQUwsQ0FBaUJpQixHQUFqQixFQUFzQkwsS0FBdEIsQ0FBNEJKLEtBQTVCLEVBQW1DRSxNQUFuQyxHQUE0Q0EsTUFBNUM7QUFDRDs7OytDQUU4RDtBQUFBLFVBQXpDYSxhQUF5QyxTQUF6Q0EsYUFBeUM7QUFBQSxVQUExQnBCLGNBQTBCLFNBQTFCQSxjQUEwQjtBQUFBLFVBQVZPLE1BQVUsU0FBVkEsTUFBVTs7QUFDN0QsVUFBTU8sTUFBTSxLQUFLWCxjQUFMLENBQW9CSCxjQUFwQixDQUFaO0FBQ0EsVUFBTUksV0FBVyxLQUFLUCxXQUFMLENBQWlCaUIsR0FBakIsQ0FBakI7QUFDQVYsZUFBU2dCLGFBQVQsR0FBeUJBLGFBQXpCO0FBQ0FoQixlQUFTRyxNQUFULEdBQWtCQSxNQUFsQjtBQUNEOzs7OztrQkF2RWtCckIsa0IiLCJmaWxlIjoiZXZlbnRfZGF0YV9jb2xsZWN0b3IuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBnZXRTdGVwTGluZVRvS2V5d29yZE1hcCB9IGZyb20gJy4vZ2hlcmtpbl9kb2N1bWVudF9wYXJzZXInXG5pbXBvcnQgeyBnZXRTdGVwTGluZVRvUGlja2xlZFN0ZXBNYXAgfSBmcm9tICcuL3BpY2tsZV9wYXJzZXInXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEV2ZW50RGF0YUNvbGxlY3RvciB7XG4gIGNvbnN0cnVjdG9yKGV2ZW50QnJvYWRjYXN0ZXIpIHtcbiAgICBldmVudEJyb2FkY2FzdGVyXG4gICAgICAub24oJ2doZXJraW4tZG9jdW1lbnQnLCA6OnRoaXMuc3RvcmVHaGVya2luRG9jdW1lbnQpXG4gICAgICAub24oJ3BpY2tsZS1hY2NlcHRlZCcsIDo6dGhpcy5zdG9yZVBpY2tsZSlcbiAgICAgIC5vbigndGVzdC1jYXNlLXByZXBhcmVkJywgOjp0aGlzLnN0b3JlVGVzdENhc2UpXG4gICAgICAub24oJ3Rlc3Qtc3RlcC1hdHRhY2htZW50JywgOjp0aGlzLnN0b3JlVGVzdFN0ZXBBdHRhY2htZW50KVxuICAgICAgLm9uKCd0ZXN0LXN0ZXAtZmluaXNoZWQnLCA6OnRoaXMuc3RvcmVUZXN0U3RlcFJlc3VsdClcbiAgICAgIC5vbigndGVzdC1jYXNlLWZpbmlzaGVkJywgOjp0aGlzLnN0b3JlVGVzdENhc2VSZXN1bHQpXG4gICAgdGhpcy5naGVya2luRG9jdW1lbnRNYXAgPSB7fSAvLyB1cmkgdG8gZ2hlcmtpbkRvY3VtZW50XG4gICAgdGhpcy5waWNrbGVNYXAgPSB7fSAvLyB1cmk6bGluZSB0byB7cGlja2xlLCB1cml9XG4gICAgdGhpcy50ZXN0Q2FzZU1hcCA9IHt9IC8vIHVyaTpsaW5lIHRvIHtzb3VyY2VMb2NhdGlvbiwgc3RlcHMsIHJlc3VsdH1cbiAgfVxuXG4gIGdldFRlc3RDYXNlS2V5KHsgdXJpLCBsaW5lIH0pIHtcbiAgICByZXR1cm4gYCR7dXJpfToke2xpbmV9YFxuICB9XG5cbiAgZ2V0VGVzdENhc2VEYXRhKHNvdXJjZUxvY2F0aW9uKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGdoZXJraW5Eb2N1bWVudDogdGhpcy5naGVya2luRG9jdW1lbnRNYXBbc291cmNlTG9jYXRpb24udXJpXSxcbiAgICAgIHBpY2tsZTogdGhpcy5waWNrbGVNYXBbdGhpcy5nZXRUZXN0Q2FzZUtleShzb3VyY2VMb2NhdGlvbildLFxuICAgICAgdGVzdENhc2U6IHRoaXMudGVzdENhc2VNYXBbdGhpcy5nZXRUZXN0Q2FzZUtleShzb3VyY2VMb2NhdGlvbildLFxuICAgIH1cbiAgfVxuXG4gIGdldFRlc3RTdGVwRGF0YSh7IHRlc3RDYXNlOiB7IHNvdXJjZUxvY2F0aW9uIH0sIGluZGV4IH0pIHtcbiAgICBjb25zdCB7IGdoZXJraW5Eb2N1bWVudCwgcGlja2xlLCB0ZXN0Q2FzZSB9ID0gdGhpcy5nZXRUZXN0Q2FzZURhdGEoXG4gICAgICBzb3VyY2VMb2NhdGlvblxuICAgIClcbiAgICBjb25zdCByZXN1bHQgPSB7IHRlc3RTdGVwOiB0ZXN0Q2FzZS5zdGVwc1tpbmRleF0gfVxuICAgIGlmIChyZXN1bHQudGVzdFN0ZXAuc291cmNlTG9jYXRpb24pIHtcbiAgICAgIGNvbnN0IHsgbGluZSB9ID0gcmVzdWx0LnRlc3RTdGVwLnNvdXJjZUxvY2F0aW9uXG4gICAgICByZXN1bHQuZ2hlcmtpbktleXdvcmQgPSBnZXRTdGVwTGluZVRvS2V5d29yZE1hcChnaGVya2luRG9jdW1lbnQpW2xpbmVdXG4gICAgICByZXN1bHQucGlja2xlU3RlcCA9IGdldFN0ZXBMaW5lVG9QaWNrbGVkU3RlcE1hcChwaWNrbGUpW2xpbmVdXG4gICAgfVxuICAgIHJldHVybiByZXN1bHRcbiAgfVxuXG4gIHN0b3JlR2hlcmtpbkRvY3VtZW50KHsgZG9jdW1lbnQsIHVyaSB9KSB7XG4gICAgdGhpcy5naGVya2luRG9jdW1lbnRNYXBbdXJpXSA9IGRvY3VtZW50XG4gIH1cblxuICBzdG9yZVBpY2tsZSh7IHBpY2tsZSwgdXJpIH0pIHtcbiAgICB0aGlzLnBpY2tsZU1hcFtgJHt1cml9OiR7cGlja2xlLmxvY2F0aW9uc1swXS5saW5lfWBdID0gcGlja2xlXG4gIH1cblxuICBzdG9yZVRlc3RDYXNlKHsgc291cmNlTG9jYXRpb24sIHN0ZXBzIH0pIHtcbiAgICBjb25zdCBrZXkgPSB0aGlzLmdldFRlc3RDYXNlS2V5KHNvdXJjZUxvY2F0aW9uKVxuICAgIHRoaXMudGVzdENhc2VNYXBba2V5XSA9IHsgc291cmNlTG9jYXRpb24sIHN0ZXBzIH1cbiAgfVxuXG4gIHN0b3JlVGVzdFN0ZXBBdHRhY2htZW50KHsgaW5kZXgsIHRlc3RDYXNlLCBkYXRhLCBtZWRpYSB9KSB7XG4gICAgY29uc3Qga2V5ID0gdGhpcy5nZXRUZXN0Q2FzZUtleSh0ZXN0Q2FzZS5zb3VyY2VMb2NhdGlvbilcbiAgICBjb25zdCBzdGVwID0gdGhpcy50ZXN0Q2FzZU1hcFtrZXldLnN0ZXBzW2luZGV4XVxuICAgIGlmICghc3RlcC5hdHRhY2htZW50cykge1xuICAgICAgc3RlcC5hdHRhY2htZW50cyA9IFtdXG4gICAgfVxuICAgIHN0ZXAuYXR0YWNobWVudHMucHVzaCh7IGRhdGEsIG1lZGlhIH0pXG4gIH1cblxuICBzdG9yZVRlc3RTdGVwUmVzdWx0KHsgaW5kZXgsIHRlc3RDYXNlLCByZXN1bHQgfSkge1xuICAgIGNvbnN0IGtleSA9IHRoaXMuZ2V0VGVzdENhc2VLZXkodGVzdENhc2Uuc291cmNlTG9jYXRpb24pXG4gICAgdGhpcy50ZXN0Q2FzZU1hcFtrZXldLnN0ZXBzW2luZGV4XS5yZXN1bHQgPSByZXN1bHRcbiAgfVxuXG4gIHN0b3JlVGVzdENhc2VSZXN1bHQoeyBhdHRlbXB0TnVtYmVyLCBzb3VyY2VMb2NhdGlvbiwgcmVzdWx0IH0pIHtcbiAgICBjb25zdCBrZXkgPSB0aGlzLmdldFRlc3RDYXNlS2V5KHNvdXJjZUxvY2F0aW9uKVxuICAgIGNvbnN0IHRlc3RDYXNlID0gdGhpcy50ZXN0Q2FzZU1hcFtrZXldXG4gICAgdGVzdENhc2UuYXR0ZW1wdE51bWJlciA9IGF0dGVtcHROdW1iZXJcbiAgICB0ZXN0Q2FzZS5yZXN1bHQgPSByZXN1bHRcbiAgfVxufVxuIl19