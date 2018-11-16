'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getStatusMapping = getStatusMapping;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var statuses = {
  AMBIGUOUS: 'ambiguous',
  FAILED: 'failed',
  RETRY: 'retry',
  PASSED: 'passed',
  PENDING: 'pending',
  SKIPPED: 'skipped',
  UNDEFINED: 'undefined'
};

exports.default = statuses;
function getStatusMapping(initialValue) {
  return _lodash2.default.chain(statuses).map(function (status) {
    return [status, initialValue];
  }).fromPairs().value();
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9zdGF0dXMuanMiXSwibmFtZXMiOlsiZ2V0U3RhdHVzTWFwcGluZyIsInN0YXR1c2VzIiwiQU1CSUdVT1VTIiwiRkFJTEVEIiwiUkVUUlkiLCJQQVNTRUQiLCJQRU5ESU5HIiwiU0tJUFBFRCIsIlVOREVGSU5FRCIsImluaXRpYWxWYWx1ZSIsImNoYWluIiwibWFwIiwic3RhdHVzIiwiZnJvbVBhaXJzIiwidmFsdWUiXSwibWFwcGluZ3MiOiI7Ozs7O1FBY2dCQSxnQixHQUFBQSxnQjs7QUFkaEI7Ozs7OztBQUVBLElBQU1DLFdBQVc7QUFDZkMsYUFBVyxXQURJO0FBRWZDLFVBQVEsUUFGTztBQUdmQyxTQUFPLE9BSFE7QUFJZkMsVUFBUSxRQUpPO0FBS2ZDLFdBQVMsU0FMTTtBQU1mQyxXQUFTLFNBTk07QUFPZkMsYUFBVztBQVBJLENBQWpCOztrQkFVZVAsUTtBQUVSLFNBQVNELGdCQUFULENBQTBCUyxZQUExQixFQUF3QztBQUM3QyxTQUFPLGlCQUFFQyxLQUFGLENBQVFULFFBQVIsRUFDSlUsR0FESSxDQUNBO0FBQUEsV0FBVSxDQUFDQyxNQUFELEVBQVNILFlBQVQsQ0FBVjtBQUFBLEdBREEsRUFFSkksU0FGSSxHQUdKQyxLQUhJLEVBQVA7QUFJRCIsImZpbGUiOiJzdGF0dXMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgXyBmcm9tICdsb2Rhc2gnXG5cbmNvbnN0IHN0YXR1c2VzID0ge1xuICBBTUJJR1VPVVM6ICdhbWJpZ3VvdXMnLFxuICBGQUlMRUQ6ICdmYWlsZWQnLFxuICBSRVRSWTogJ3JldHJ5JyxcbiAgUEFTU0VEOiAncGFzc2VkJyxcbiAgUEVORElORzogJ3BlbmRpbmcnLFxuICBTS0lQUEVEOiAnc2tpcHBlZCcsXG4gIFVOREVGSU5FRDogJ3VuZGVmaW5lZCcsXG59XG5cbmV4cG9ydCBkZWZhdWx0IHN0YXR1c2VzXG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRTdGF0dXNNYXBwaW5nKGluaXRpYWxWYWx1ZSkge1xuICByZXR1cm4gXy5jaGFpbihzdGF0dXNlcylcbiAgICAubWFwKHN0YXR1cyA9PiBbc3RhdHVzLCBpbml0aWFsVmFsdWVdKVxuICAgIC5mcm9tUGFpcnMoKVxuICAgIC52YWx1ZSgpXG59XG4iXX0=