'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

exports.default = getColorFns;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _safe = require('colors/safe');

var _safe2 = _interopRequireDefault(_safe);

var _status = require('../status');

var _status2 = _interopRequireDefault(_status);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_safe2.default.enabled = true;

function getColorFns(enabled) {
  if (enabled) {
    var _ref;

    return _ref = {}, (0, _defineProperty3.default)(_ref, _status2.default.AMBIGUOUS, _safe2.default.red.bind(_safe2.default)), (0, _defineProperty3.default)(_ref, _status2.default.FAILED, _safe2.default.red.bind(_safe2.default)), (0, _defineProperty3.default)(_ref, _status2.default.RETRY, _safe2.default.yellow.bind(_safe2.default)), (0, _defineProperty3.default)(_ref, _status2.default.PASSED, _safe2.default.green.bind(_safe2.default)), (0, _defineProperty3.default)(_ref, _status2.default.PENDING, _safe2.default.yellow.bind(_safe2.default)), (0, _defineProperty3.default)(_ref, _status2.default.SKIPPED, _safe2.default.cyan.bind(_safe2.default)), (0, _defineProperty3.default)(_ref, _status2.default.UNDEFINED, _safe2.default.yellow.bind(_safe2.default)), (0, _defineProperty3.default)(_ref, 'location', _safe2.default.gray.bind(_safe2.default)), (0, _defineProperty3.default)(_ref, 'tag', _safe2.default.cyan.bind(_safe2.default)), (0, _defineProperty3.default)(_ref, 'diffAdded', _safe2.default.green.bind(_safe2.default)), (0, _defineProperty3.default)(_ref, 'diffRemoved', _safe2.default.red.bind(_safe2.default)), (0, _defineProperty3.default)(_ref, 'errorMessage', _safe2.default.red.bind(_safe2.default)), (0, _defineProperty3.default)(_ref, 'errorStack', _safe2.default.gray.bind(_safe2.default)), _ref;
  } else {
    var _ref2;

    return _ref2 = {}, (0, _defineProperty3.default)(_ref2, _status2.default.AMBIGUOUS, _lodash2.default.identity), (0, _defineProperty3.default)(_ref2, _status2.default.FAILED, _lodash2.default.identity), (0, _defineProperty3.default)(_ref2, _status2.default.RETRY, _lodash2.default.identity), (0, _defineProperty3.default)(_ref2, _status2.default.PASSED, _lodash2.default.identity), (0, _defineProperty3.default)(_ref2, _status2.default.PENDING, _lodash2.default.identity), (0, _defineProperty3.default)(_ref2, _status2.default.SKIPPED, _lodash2.default.identity), (0, _defineProperty3.default)(_ref2, _status2.default.UNDEFINED, _lodash2.default.identity), (0, _defineProperty3.default)(_ref2, 'location', _lodash2.default.identity), (0, _defineProperty3.default)(_ref2, 'tag', _lodash2.default.identity), (0, _defineProperty3.default)(_ref2, 'diffAdded', _lodash2.default.identity), (0, _defineProperty3.default)(_ref2, 'diffRemoved', _lodash2.default.identity), (0, _defineProperty3.default)(_ref2, 'errorMessage', _lodash2.default.identity), (0, _defineProperty3.default)(_ref2, 'errorStack', _lodash2.default.identity), _ref2;
  }
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9mb3JtYXR0ZXIvZ2V0X2NvbG9yX2Zucy5qcyJdLCJuYW1lcyI6WyJnZXRDb2xvckZucyIsImVuYWJsZWQiLCJBTUJJR1VPVVMiLCJyZWQiLCJGQUlMRUQiLCJSRVRSWSIsInllbGxvdyIsIlBBU1NFRCIsImdyZWVuIiwiUEVORElORyIsIlNLSVBQRUQiLCJjeWFuIiwiVU5ERUZJTkVEIiwiZ3JheSIsImlkZW50aXR5Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O2tCQU13QkEsVzs7QUFOeEI7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFFQSxlQUFPQyxPQUFQLEdBQWlCLElBQWpCOztBQUVlLFNBQVNELFdBQVQsQ0FBcUJDLE9BQXJCLEVBQThCO0FBQzNDLE1BQUlBLE9BQUosRUFBYTtBQUFBOztBQUNYLDBEQUNHLGlCQUFPQyxTQURWLEVBQ3dCLGVBQU9DLEdBRC9CLDREQUVHLGlCQUFPQyxNQUZWLEVBRXFCLGVBQU9ELEdBRjVCLDREQUdHLGlCQUFPRSxLQUhWLEVBR29CLGVBQU9DLE1BSDNCLDREQUlHLGlCQUFPQyxNQUpWLEVBSXFCLGVBQU9DLEtBSjVCLDREQUtHLGlCQUFPQyxPQUxWLEVBS3NCLGVBQU9ILE1BTDdCLDREQU1HLGlCQUFPSSxPQU5WLEVBTXNCLGVBQU9DLElBTjdCLDREQU9HLGlCQUFPQyxTQVBWLEVBT3dCLGVBQU9OLE1BUC9CLHdFQVFjLGVBQU9PLElBUnJCLG1FQVNTLGVBQU9GLElBVGhCLHlFQVllLGVBQU9ILEtBWnRCLDJFQWFpQixlQUFPTCxHQWJ4Qiw0RUFja0IsZUFBT0EsR0FkekIsMEVBZWdCLGVBQU9VLElBZnZCO0FBaUJELEdBbEJELE1Ba0JPO0FBQUE7O0FBQ0wsNERBQ0csaUJBQU9YLFNBRFYsRUFDc0IsaUJBQUVZLFFBRHhCLHdDQUVHLGlCQUFPVixNQUZWLEVBRW1CLGlCQUFFVSxRQUZyQix3Q0FHRyxpQkFBT1QsS0FIVixFQUdrQixpQkFBRVMsUUFIcEIsd0NBSUcsaUJBQU9QLE1BSlYsRUFJbUIsaUJBQUVPLFFBSnJCLHdDQUtHLGlCQUFPTCxPQUxWLEVBS29CLGlCQUFFSyxRQUx0Qix3Q0FNRyxpQkFBT0osT0FOVixFQU1vQixpQkFBRUksUUFOdEIsd0NBT0csaUJBQU9GLFNBUFYsRUFPc0IsaUJBQUVFLFFBUHhCLG9EQVFZLGlCQUFFQSxRQVJkLCtDQVNPLGlCQUFFQSxRQVRULHFEQVlhLGlCQUFFQSxRQVpmLHVEQWFlLGlCQUFFQSxRQWJqQix3REFjZ0IsaUJBQUVBLFFBZGxCLHNEQWVjLGlCQUFFQSxRQWZoQjtBQWlCRDtBQUNGIiwiZmlsZSI6ImdldF9jb2xvcl9mbnMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgXyBmcm9tICdsb2Rhc2gnXG5pbXBvcnQgY29sb3JzIGZyb20gJ2NvbG9ycy9zYWZlJ1xuaW1wb3J0IFN0YXR1cyBmcm9tICcuLi9zdGF0dXMnXG5cbmNvbG9ycy5lbmFibGVkID0gdHJ1ZVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXRDb2xvckZucyhlbmFibGVkKSB7XG4gIGlmIChlbmFibGVkKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIFtTdGF0dXMuQU1CSUdVT1VTXTogOjpjb2xvcnMucmVkLFxuICAgICAgW1N0YXR1cy5GQUlMRURdOiA6OmNvbG9ycy5yZWQsXG4gICAgICBbU3RhdHVzLlJFVFJZXTogOjpjb2xvcnMueWVsbG93LFxuICAgICAgW1N0YXR1cy5QQVNTRURdOiA6OmNvbG9ycy5ncmVlbixcbiAgICAgIFtTdGF0dXMuUEVORElOR106IDo6Y29sb3JzLnllbGxvdyxcbiAgICAgIFtTdGF0dXMuU0tJUFBFRF06IDo6Y29sb3JzLmN5YW4sXG4gICAgICBbU3RhdHVzLlVOREVGSU5FRF06IDo6Y29sb3JzLnllbGxvdyxcbiAgICAgIGxvY2F0aW9uOiA6OmNvbG9ycy5ncmF5LFxuICAgICAgdGFnOiA6OmNvbG9ycy5jeWFuLFxuXG4gICAgICAvLyBGb3IgYXNzZXJ0aW9uLWVycm9yLWZvcm1hdHRlclxuICAgICAgZGlmZkFkZGVkOiA6OmNvbG9ycy5ncmVlbixcbiAgICAgIGRpZmZSZW1vdmVkOiA6OmNvbG9ycy5yZWQsXG4gICAgICBlcnJvck1lc3NhZ2U6IDo6Y29sb3JzLnJlZCxcbiAgICAgIGVycm9yU3RhY2s6IDo6Y29sb3JzLmdyYXksXG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHJldHVybiB7XG4gICAgICBbU3RhdHVzLkFNQklHVU9VU106IF8uaWRlbnRpdHksXG4gICAgICBbU3RhdHVzLkZBSUxFRF06IF8uaWRlbnRpdHksXG4gICAgICBbU3RhdHVzLlJFVFJZXTogXy5pZGVudGl0eSxcbiAgICAgIFtTdGF0dXMuUEFTU0VEXTogXy5pZGVudGl0eSxcbiAgICAgIFtTdGF0dXMuUEVORElOR106IF8uaWRlbnRpdHksXG4gICAgICBbU3RhdHVzLlNLSVBQRURdOiBfLmlkZW50aXR5LFxuICAgICAgW1N0YXR1cy5VTkRFRklORURdOiBfLmlkZW50aXR5LFxuICAgICAgbG9jYXRpb246IF8uaWRlbnRpdHksXG4gICAgICB0YWc6IF8uaWRlbnRpdHksXG5cbiAgICAgIC8vIEZvciBhc3NlcnRpb24tZXJyb3ItZm9ybWF0dGVyXG4gICAgICBkaWZmQWRkZWQ6IF8uaWRlbnRpdHksXG4gICAgICBkaWZmUmVtb3ZlZDogXy5pZGVudGl0eSxcbiAgICAgIGVycm9yTWVzc2FnZTogXy5pZGVudGl0eSxcbiAgICAgIGVycm9yU3RhY2s6IF8uaWRlbnRpdHksXG4gICAgfVxuICB9XG59XG4iXX0=