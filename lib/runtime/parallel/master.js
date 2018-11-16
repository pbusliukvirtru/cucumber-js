'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _crossSpawn = require('cross-spawn');

var _crossSpawn2 = _interopRequireDefault(_crossSpawn);

var _command_types = require('./command_types');

var _command_types2 = _interopRequireDefault(_command_types);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _status = require('../../status');

var _status2 = _interopRequireDefault(_status);

var _helpers = require('../helpers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var slaveCommand = _path2.default.resolve(__dirname, '..', '..', '..', 'bin', 'run_slave');

var Master = function () {
  // options - {dryRun, failFast, filterStacktraces, retry, retryTagFilter, strict}
  function Master(_ref) {
    var eventBroadcaster = _ref.eventBroadcaster,
        options = _ref.options,
        supportCodePaths = _ref.supportCodePaths,
        supportCodeRequiredModules = _ref.supportCodeRequiredModules,
        testCases = _ref.testCases;
    (0, _classCallCheck3.default)(this, Master);

    this.eventBroadcaster = eventBroadcaster;
    this.options = options || {};
    this.supportCodePaths = supportCodePaths;
    this.supportCodeRequiredModules = supportCodeRequiredModules;
    this.testCases = testCases || [];
    this.nextTestCaseIndex = 0;
    this.testCasesCompleted = 0;
    this.result = {
      duration: 0,
      success: true
    };
    this.slaves = {};
  }

  (0, _createClass3.default)(Master, [{
    key: 'parseSlaveMessage',
    value: function parseSlaveMessage(slave, message) {
      switch (message.command) {
        case _command_types2.default.READY:
          this.giveSlaveWork(slave);
          break;
        case _command_types2.default.EVENT:
          this.eventBroadcaster.emit(message.name, message.data);
          if (message.name === 'test-case-finished') {
            this.parseTestCaseResult(message.data.result);
          }
          break;
        default:
          throw new Error('Unexpected message from slave: ' + message);
      }
    }
  }, {
    key: 'startSlave',
    value: function startSlave(id, total) {
      var _this = this;

      var slaveProcess = (0, _crossSpawn2.default)(slaveCommand, [], {
        env: _lodash2.default.assign({}, process.env, {
          CUCUMBER_PARALLEL: 'true',
          CUCUMBER_TOTAL_SLAVES: total,
          CUCUMBER_SLAVE_ID: id
        }),
        stdio: ['inherit', 'inherit', 'inherit', 'ipc']
      });
      var slave = { process: slaveProcess };
      this.slaves[id] = slave;
      slave.process.on('message', function (message) {
        _this.parseSlaveMessage(slave, message);
      });
      slave.process.on('close', function () {
        slave.closed = true;
        _this.onSlaveClose();
      });
      slave.process.send({
        command: _command_types2.default.INITIALIZE,
        filterStacktraces: this.options.filterStacktraces,
        supportCodePaths: this.supportCodePaths,
        supportCodeRequiredModules: this.supportCodeRequiredModules,
        worldParameters: this.options.worldParameters
      });
    }
  }, {
    key: 'onSlaveClose',
    value: function onSlaveClose() {
      if (_lodash2.default.every(this.slaves, 'closed')) {
        this.eventBroadcaster.emit('test-run-finished', { result: this.result });
        this.onFinish(this.result.success);
      }
    }
  }, {
    key: 'parseTestCaseResult',
    value: function parseTestCaseResult(testCaseResult) {
      this.testCasesCompleted += 1;
      if (testCaseResult.duration) {
        this.result.duration += testCaseResult.duration;
      }
      if (this.shouldCauseFailure(testCaseResult.status)) {
        this.result.success = false;
      }
    }
  }, {
    key: 'run',
    value: function run(numberOfSlaves, done) {
      var _this2 = this;

      this.eventBroadcaster.emit('test-run-started');
      _lodash2.default.times(numberOfSlaves, function (id) {
        return _this2.startSlave(id, numberOfSlaves);
      });
      this.onFinish = done;
    }
  }, {
    key: 'giveSlaveWork',
    value: function giveSlaveWork(slave) {
      if (this.nextTestCaseIndex === this.testCases.length) {
        slave.process.send({ command: _command_types2.default.FINALIZE });
        return;
      }
      var testCase = this.testCases[this.nextTestCaseIndex];
      this.nextTestCaseIndex += 1;
      var retries = (0, _helpers.retriesForTestCase)(testCase, this.options);
      var skip = this.options.dryRun || this.options.failFast && !this.result.success;
      slave.process.send({ command: _command_types2.default.RUN, retries: retries, skip: skip, testCase: testCase });
    }
  }, {
    key: 'shouldCauseFailure',
    value: function shouldCauseFailure(status) {
      return _lodash2.default.includes([_status2.default.AMBIGUOUS, _status2.default.FAILED, _status2.default.UNDEFINED], status) || status === _status2.default.PENDING && this.options.strict;
    }
  }]);
  return Master;
}();

exports.default = Master;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9ydW50aW1lL3BhcmFsbGVsL21hc3Rlci5qcyJdLCJuYW1lcyI6WyJzbGF2ZUNvbW1hbmQiLCJyZXNvbHZlIiwiX19kaXJuYW1lIiwiTWFzdGVyIiwiZXZlbnRCcm9hZGNhc3RlciIsIm9wdGlvbnMiLCJzdXBwb3J0Q29kZVBhdGhzIiwic3VwcG9ydENvZGVSZXF1aXJlZE1vZHVsZXMiLCJ0ZXN0Q2FzZXMiLCJuZXh0VGVzdENhc2VJbmRleCIsInRlc3RDYXNlc0NvbXBsZXRlZCIsInJlc3VsdCIsImR1cmF0aW9uIiwic3VjY2VzcyIsInNsYXZlcyIsInNsYXZlIiwibWVzc2FnZSIsImNvbW1hbmQiLCJSRUFEWSIsImdpdmVTbGF2ZVdvcmsiLCJFVkVOVCIsImVtaXQiLCJuYW1lIiwiZGF0YSIsInBhcnNlVGVzdENhc2VSZXN1bHQiLCJFcnJvciIsImlkIiwidG90YWwiLCJzbGF2ZVByb2Nlc3MiLCJlbnYiLCJhc3NpZ24iLCJwcm9jZXNzIiwiQ1VDVU1CRVJfUEFSQUxMRUwiLCJDVUNVTUJFUl9UT1RBTF9TTEFWRVMiLCJDVUNVTUJFUl9TTEFWRV9JRCIsInN0ZGlvIiwib24iLCJwYXJzZVNsYXZlTWVzc2FnZSIsImNsb3NlZCIsIm9uU2xhdmVDbG9zZSIsInNlbmQiLCJJTklUSUFMSVpFIiwiZmlsdGVyU3RhY2t0cmFjZXMiLCJ3b3JsZFBhcmFtZXRlcnMiLCJldmVyeSIsIm9uRmluaXNoIiwidGVzdENhc2VSZXN1bHQiLCJzaG91bGRDYXVzZUZhaWx1cmUiLCJzdGF0dXMiLCJudW1iZXJPZlNsYXZlcyIsImRvbmUiLCJ0aW1lcyIsInN0YXJ0U2xhdmUiLCJsZW5ndGgiLCJGSU5BTElaRSIsInRlc3RDYXNlIiwicmV0cmllcyIsInNraXAiLCJkcnlSdW4iLCJmYWlsRmFzdCIsIlJVTiIsImluY2x1ZGVzIiwiQU1CSUdVT1VTIiwiRkFJTEVEIiwiVU5ERUZJTkVEIiwiUEVORElORyIsInN0cmljdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7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RCxRQUFuQixFQUE2QixLQUFLbEQsT0FBbEMsQ0FBaEI7QUFDQSxVQUFNb0QsT0FDSixLQUFLcEQsT0FBTCxDQUFhcUQsTUFBYixJQUF3QixLQUFLckQsT0FBTCxDQUFhc0QsUUFBYixJQUF5QixDQUFDLEtBQUtoRCxNQUFMLENBQVlFLE9BRGhFO0FBRUFFLFlBQU1nQixPQUFOLENBQWNTLElBQWQsQ0FBbUIsRUFBRXZCLFNBQVMsd0JBQWEyQyxHQUF4QixFQUE2QkosZ0JBQTdCLEVBQXNDQyxVQUF0QyxFQUE0Q0Ysa0JBQTVDLEVBQW5CO0FBQ0Q7Ozt1Q0FFa0JQLE0sRUFBUTtBQUN6QixhQUNFLGlCQUFFYSxRQUFGLENBQVcsQ0FBQyxpQkFBT0MsU0FBUixFQUFtQixpQkFBT0MsTUFBMUIsRUFBa0MsaUJBQU9DLFNBQXpDLENBQVgsRUFBZ0VoQixNQUFoRSxLQUNDQSxXQUFXLGlCQUFPaUIsT0FBbEIsSUFBNkIsS0FBSzVELE9BQUwsQ0FBYTZELE1BRjdDO0FBSUQ7Ozs7O2tCQTNHa0IvRCxNIiwiZmlsZSI6Im1hc3Rlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBfIGZyb20gJ2xvZGFzaCdcbmltcG9ydCBjcm9zc1NwYXduIGZyb20gJ2Nyb3NzLXNwYXduJ1xuaW1wb3J0IGNvbW1hbmRUeXBlcyBmcm9tICcuL2NvbW1hbmRfdHlwZXMnXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJ1xuaW1wb3J0IFN0YXR1cyBmcm9tICcuLi8uLi9zdGF0dXMnXG5pbXBvcnQgeyByZXRyaWVzRm9yVGVzdENhc2UgfSBmcm9tICcuLi9oZWxwZXJzJ1xuXG5jb25zdCBzbGF2ZUNvbW1hbmQgPSBwYXRoLnJlc29sdmUoXG4gIF9fZGlybmFtZSxcbiAgJy4uJyxcbiAgJy4uJyxcbiAgJy4uJyxcbiAgJ2JpbicsXG4gICdydW5fc2xhdmUnXG4pXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1hc3RlciB7XG4gIC8vIG9wdGlvbnMgLSB7ZHJ5UnVuLCBmYWlsRmFzdCwgZmlsdGVyU3RhY2t0cmFjZXMsIHJldHJ5LCByZXRyeVRhZ0ZpbHRlciwgc3RyaWN0fVxuICBjb25zdHJ1Y3Rvcih7XG4gICAgZXZlbnRCcm9hZGNhc3RlcixcbiAgICBvcHRpb25zLFxuICAgIHN1cHBvcnRDb2RlUGF0aHMsXG4gICAgc3VwcG9ydENvZGVSZXF1aXJlZE1vZHVsZXMsXG4gICAgdGVzdENhc2VzLFxuICB9KSB7XG4gICAgdGhpcy5ldmVudEJyb2FkY2FzdGVyID0gZXZlbnRCcm9hZGNhc3RlclxuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnMgfHwge31cbiAgICB0aGlzLnN1cHBvcnRDb2RlUGF0aHMgPSBzdXBwb3J0Q29kZVBhdGhzXG4gICAgdGhpcy5zdXBwb3J0Q29kZVJlcXVpcmVkTW9kdWxlcyA9IHN1cHBvcnRDb2RlUmVxdWlyZWRNb2R1bGVzXG4gICAgdGhpcy50ZXN0Q2FzZXMgPSB0ZXN0Q2FzZXMgfHwgW11cbiAgICB0aGlzLm5leHRUZXN0Q2FzZUluZGV4ID0gMFxuICAgIHRoaXMudGVzdENhc2VzQ29tcGxldGVkID0gMFxuICAgIHRoaXMucmVzdWx0ID0ge1xuICAgICAgZHVyYXRpb246IDAsXG4gICAgICBzdWNjZXNzOiB0cnVlLFxuICAgIH1cbiAgICB0aGlzLnNsYXZlcyA9IHt9XG4gIH1cblxuICBwYXJzZVNsYXZlTWVzc2FnZShzbGF2ZSwgbWVzc2FnZSkge1xuICAgIHN3aXRjaCAobWVzc2FnZS5jb21tYW5kKSB7XG4gICAgICBjYXNlIGNvbW1hbmRUeXBlcy5SRUFEWTpcbiAgICAgICAgdGhpcy5naXZlU2xhdmVXb3JrKHNsYXZlKVxuICAgICAgICBicmVha1xuICAgICAgY2FzZSBjb21tYW5kVHlwZXMuRVZFTlQ6XG4gICAgICAgIHRoaXMuZXZlbnRCcm9hZGNhc3Rlci5lbWl0KG1lc3NhZ2UubmFtZSwgbWVzc2FnZS5kYXRhKVxuICAgICAgICBpZiAobWVzc2FnZS5uYW1lID09PSAndGVzdC1jYXNlLWZpbmlzaGVkJykge1xuICAgICAgICAgIHRoaXMucGFyc2VUZXN0Q2FzZVJlc3VsdChtZXNzYWdlLmRhdGEucmVzdWx0KVxuICAgICAgICB9XG4gICAgICAgIGJyZWFrXG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFVuZXhwZWN0ZWQgbWVzc2FnZSBmcm9tIHNsYXZlOiAke21lc3NhZ2V9YClcbiAgICB9XG4gIH1cblxuICBzdGFydFNsYXZlKGlkLCB0b3RhbCkge1xuICAgIGNvbnN0IHNsYXZlUHJvY2VzcyA9IGNyb3NzU3Bhd24oc2xhdmVDb21tYW5kLCBbXSwge1xuICAgICAgZW52OiBfLmFzc2lnbih7fSwgcHJvY2Vzcy5lbnYsIHtcbiAgICAgICAgQ1VDVU1CRVJfUEFSQUxMRUw6ICd0cnVlJyxcbiAgICAgICAgQ1VDVU1CRVJfVE9UQUxfU0xBVkVTOiB0b3RhbCxcbiAgICAgICAgQ1VDVU1CRVJfU0xBVkVfSUQ6IGlkLFxuICAgICAgfSksXG4gICAgICBzdGRpbzogWydpbmhlcml0JywgJ2luaGVyaXQnLCAnaW5oZXJpdCcsICdpcGMnXSxcbiAgICB9KVxuICAgIGNvbnN0IHNsYXZlID0geyBwcm9jZXNzOiBzbGF2ZVByb2Nlc3MgfVxuICAgIHRoaXMuc2xhdmVzW2lkXSA9IHNsYXZlXG4gICAgc2xhdmUucHJvY2Vzcy5vbignbWVzc2FnZScsIG1lc3NhZ2UgPT4ge1xuICAgICAgdGhpcy5wYXJzZVNsYXZlTWVzc2FnZShzbGF2ZSwgbWVzc2FnZSlcbiAgICB9KVxuICAgIHNsYXZlLnByb2Nlc3Mub24oJ2Nsb3NlJywgKCkgPT4ge1xuICAgICAgc2xhdmUuY2xvc2VkID0gdHJ1ZVxuICAgICAgdGhpcy5vblNsYXZlQ2xvc2UoKVxuICAgIH0pXG4gICAgc2xhdmUucHJvY2Vzcy5zZW5kKHtcbiAgICAgIGNvbW1hbmQ6IGNvbW1hbmRUeXBlcy5JTklUSUFMSVpFLFxuICAgICAgZmlsdGVyU3RhY2t0cmFjZXM6IHRoaXMub3B0aW9ucy5maWx0ZXJTdGFja3RyYWNlcyxcbiAgICAgIHN1cHBvcnRDb2RlUGF0aHM6IHRoaXMuc3VwcG9ydENvZGVQYXRocyxcbiAgICAgIHN1cHBvcnRDb2RlUmVxdWlyZWRNb2R1bGVzOiB0aGlzLnN1cHBvcnRDb2RlUmVxdWlyZWRNb2R1bGVzLFxuICAgICAgd29ybGRQYXJhbWV0ZXJzOiB0aGlzLm9wdGlvbnMud29ybGRQYXJhbWV0ZXJzLFxuICAgIH0pXG4gIH1cblxuICBvblNsYXZlQ2xvc2UoKSB7XG4gICAgaWYgKF8uZXZlcnkodGhpcy5zbGF2ZXMsICdjbG9zZWQnKSkge1xuICAgICAgdGhpcy5ldmVudEJyb2FkY2FzdGVyLmVtaXQoJ3Rlc3QtcnVuLWZpbmlzaGVkJywgeyByZXN1bHQ6IHRoaXMucmVzdWx0IH0pXG4gICAgICB0aGlzLm9uRmluaXNoKHRoaXMucmVzdWx0LnN1Y2Nlc3MpXG4gICAgfVxuICB9XG5cbiAgcGFyc2VUZXN0Q2FzZVJlc3VsdCh0ZXN0Q2FzZVJlc3VsdCkge1xuICAgIHRoaXMudGVzdENhc2VzQ29tcGxldGVkICs9IDFcbiAgICBpZiAodGVzdENhc2VSZXN1bHQuZHVyYXRpb24pIHtcbiAgICAgIHRoaXMucmVzdWx0LmR1cmF0aW9uICs9IHRlc3RDYXNlUmVzdWx0LmR1cmF0aW9uXG4gICAgfVxuICAgIGlmICh0aGlzLnNob3VsZENhdXNlRmFpbHVyZSh0ZXN0Q2FzZVJlc3VsdC5zdGF0dXMpKSB7XG4gICAgICB0aGlzLnJlc3VsdC5zdWNjZXNzID0gZmFsc2VcbiAgICB9XG4gIH1cblxuICBydW4obnVtYmVyT2ZTbGF2ZXMsIGRvbmUpIHtcbiAgICB0aGlzLmV2ZW50QnJvYWRjYXN0ZXIuZW1pdCgndGVzdC1ydW4tc3RhcnRlZCcpXG4gICAgXy50aW1lcyhudW1iZXJPZlNsYXZlcywgaWQgPT4gdGhpcy5zdGFydFNsYXZlKGlkLCBudW1iZXJPZlNsYXZlcykpXG4gICAgdGhpcy5vbkZpbmlzaCA9IGRvbmVcbiAgfVxuXG4gIGdpdmVTbGF2ZVdvcmsoc2xhdmUpIHtcbiAgICBpZiAodGhpcy5uZXh0VGVzdENhc2VJbmRleCA9PT0gdGhpcy50ZXN0Q2FzZXMubGVuZ3RoKSB7XG4gICAgICBzbGF2ZS5wcm9jZXNzLnNlbmQoeyBjb21tYW5kOiBjb21tYW5kVHlwZXMuRklOQUxJWkUgfSlcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICBjb25zdCB0ZXN0Q2FzZSA9IHRoaXMudGVzdENhc2VzW3RoaXMubmV4dFRlc3RDYXNlSW5kZXhdXG4gICAgdGhpcy5uZXh0VGVzdENhc2VJbmRleCArPSAxXG4gICAgY29uc3QgcmV0cmllcyA9IHJldHJpZXNGb3JUZXN0Q2FzZSh0ZXN0Q2FzZSwgdGhpcy5vcHRpb25zKVxuICAgIGNvbnN0IHNraXAgPVxuICAgICAgdGhpcy5vcHRpb25zLmRyeVJ1biB8fCAodGhpcy5vcHRpb25zLmZhaWxGYXN0ICYmICF0aGlzLnJlc3VsdC5zdWNjZXNzKVxuICAgIHNsYXZlLnByb2Nlc3Muc2VuZCh7IGNvbW1hbmQ6IGNvbW1hbmRUeXBlcy5SVU4sIHJldHJpZXMsIHNraXAsIHRlc3RDYXNlIH0pXG4gIH1cblxuICBzaG91bGRDYXVzZUZhaWx1cmUoc3RhdHVzKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIF8uaW5jbHVkZXMoW1N0YXR1cy5BTUJJR1VPVVMsIFN0YXR1cy5GQUlMRUQsIFN0YXR1cy5VTkRFRklORURdLCBzdGF0dXMpIHx8XG4gICAgICAoc3RhdHVzID09PSBTdGF0dXMuUEVORElORyAmJiB0aGlzLm9wdGlvbnMuc3RyaWN0KVxuICAgIClcbiAgfVxufVxuIl19