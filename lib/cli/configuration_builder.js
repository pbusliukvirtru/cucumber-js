'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _argv_parser = require('./argv_parser');

var _argv_parser2 = _interopRequireDefault(_argv_parser);

var _fs = require('mz/fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _option_splitter = require('./option_splitter');

var _option_splitter2 = _interopRequireDefault(_option_splitter);

var _glob = require('glob');

var _glob2 = _interopRequireDefault(_glob);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var globP = (0, _bluebird.promisify)(_glob2.default);

var ConfigurationBuilder = function () {
  (0, _createClass3.default)(ConfigurationBuilder, null, [{
    key: 'build',
    value: function () {
      var _ref = (0, _bluebird.coroutine)(function* (options) {
        var builder = new ConfigurationBuilder(options);
        return builder.build();
      });

      function build(_x) {
        return _ref.apply(this, arguments);
      }

      return build;
    }()
  }]);

  function ConfigurationBuilder(_ref2) {
    var argv = _ref2.argv,
        cwd = _ref2.cwd;
    (0, _classCallCheck3.default)(this, ConfigurationBuilder);

    this.cwd = cwd;

    var parsedArgv = _argv_parser2.default.parse(argv);
    this.args = parsedArgv.args;
    this.options = parsedArgv.options;
  }

  (0, _createClass3.default)(ConfigurationBuilder, [{
    key: 'build',
    value: function () {
      var _ref3 = (0, _bluebird.coroutine)(function* () {
        var listI18nKeywordsFor = this.options.i18nKeywords;
        var listI18nLanguages = !!this.options.i18nLanguages;
        var unexpandedFeaturePaths = yield this.getUnexpandedFeaturePaths();
        var featurePaths = [];
        var supportCodePaths = [];
        if (!listI18nKeywordsFor && !listI18nLanguages) {
          featurePaths = yield this.expandFeaturePaths(unexpandedFeaturePaths);
          var unexpandedSupportCodePaths = this.options.require;
          if (unexpandedSupportCodePaths.length === 0) {
            unexpandedSupportCodePaths = this.getFeatureDirectoryPaths(featurePaths);
          }
          supportCodePaths = yield this.expandPaths(unexpandedSupportCodePaths, '.js');
        }
        return {
          featureDefaultLanguage: this.options.language,
          featurePaths: featurePaths,
          formats: this.getFormats(),
          formatOptions: this.getFormatOptions(),
          listI18nKeywordsFor: listI18nKeywordsFor,
          listI18nLanguages: listI18nLanguages,
          order: this.options.order,
          parallel: this.options.parallel,
          profiles: this.options.profile,
          pickleFilterOptions: {
            featurePaths: unexpandedFeaturePaths,
            names: this.options.name,
            tagExpression: this.options.tags
          },
          runtimeOptions: {
            dryRun: !!this.options.dryRun,
            failFast: !!this.options.failFast,
            filterStacktraces: !this.options.backtrace,
            retry: this.options.retry,
            retryTagFilter: this.options.retryTagFilter,
            strict: !!this.options.strict,
            worldParameters: this.options.worldParameters
          },
          shouldExitImmediately: !!this.options.exit,
          supportCodePaths: supportCodePaths,
          supportCodeRequiredModules: this.options.requireModule
        };
      });

      function build() {
        return _ref3.apply(this, arguments);
      }

      return build;
    }()
  }, {
    key: 'expandPaths',
    value: function () {
      var _ref4 = (0, _bluebird.coroutine)(function* (unexpandedPaths, defaultExtension) {
        var _this = this;

        var expandedPaths = yield _bluebird2.default.map(unexpandedPaths, function () {
          var _ref5 = (0, _bluebird.coroutine)(function* (unexpandedPath) {
            var matches = yield globP(unexpandedPath, {
              absolute: true,
              cwd: _this.cwd
            });
            return _bluebird2.default.map(matches, function () {
              var _ref6 = (0, _bluebird.coroutine)(function* (match) {
                if (_path2.default.extname(match) === '') {
                  return globP(match + '/**/*' + defaultExtension);
                }
                return match;
              });

              return function (_x5) {
                return _ref6.apply(this, arguments);
              };
            }());
          });

          return function (_x4) {
            return _ref5.apply(this, arguments);
          };
        }());
        return _lodash2.default.flattenDepth(expandedPaths, 2).map(function (x) {
          return _path2.default.normalize(x);
        });
      });

      function expandPaths(_x2, _x3) {
        return _ref4.apply(this, arguments);
      }

      return expandPaths;
    }()
  }, {
    key: 'expandFeaturePaths',
    value: function () {
      var _ref7 = (0, _bluebird.coroutine)(function* (featurePaths) {
        featurePaths = featurePaths.map(function (p) {
          return p.replace(/(:\d+)*$/g, '');
        }); // Strip line numbers
        return this.expandPaths(featurePaths, '.feature');
      });

      function expandFeaturePaths(_x6) {
        return _ref7.apply(this, arguments);
      }

      return expandFeaturePaths;
    }()
  }, {
    key: 'getFeatureDirectoryPaths',
    value: function getFeatureDirectoryPaths(featurePaths) {
      var _this2 = this;

      var featureDirs = featurePaths.map(function (featurePath) {
        var featureDir = _path2.default.dirname(featurePath);
        var childDir = void 0;
        var parentDir = featureDir;
        while (childDir !== parentDir) {
          childDir = parentDir;
          parentDir = _path2.default.dirname(childDir);
          if (_path2.default.basename(parentDir) === 'features') {
            featureDir = parentDir;
            break;
          }
        }
        return _path2.default.relative(_this2.cwd, featureDir);
      });
      return _lodash2.default.uniq(featureDirs);
    }
  }, {
    key: 'getFormatOptions',
    value: function getFormatOptions() {
      return _lodash2.default.assign({}, this.options.formatOptions, { cwd: this.cwd });
    }
  }, {
    key: 'getFormats',
    value: function getFormats() {
      var mapping = { '': 'progress' };
      this.options.format.forEach(function (format) {
        var _OptionSplitter$split = _option_splitter2.default.split(format),
            _OptionSplitter$split2 = (0, _slicedToArray3.default)(_OptionSplitter$split, 2),
            type = _OptionSplitter$split2[0],
            outputTo = _OptionSplitter$split2[1];

        mapping[outputTo || ''] = type;
      });
      return _lodash2.default.map(mapping, function (type, outputTo) {
        return { outputTo: outputTo, type: type };
      });
    }
  }, {
    key: 'getUnexpandedFeaturePaths',
    value: function () {
      var _ref8 = (0, _bluebird.coroutine)(function* () {
        var _this3 = this;

        if (this.args.length > 0) {
          var nestedFeaturePaths = yield _bluebird2.default.map(this.args, function () {
            var _ref9 = (0, _bluebird.coroutine)(function* (arg) {
              var filename = _path2.default.basename(arg);
              if (filename[0] === '@') {
                var filePath = _path2.default.join(_this3.cwd, arg);
                var content = yield _fs2.default.readFile(filePath, 'utf8');
                return _lodash2.default.chain(content).split('\n').map(_lodash2.default.trim).compact().value();
              }
              return arg;
            });

            return function (_x7) {
              return _ref9.apply(this, arguments);
            };
          }());
          var featurePaths = _lodash2.default.flatten(nestedFeaturePaths);
          if (featurePaths.length > 0) {
            return featurePaths;
          }
        }
        return ['features/**/*.feature'];
      });

      function getUnexpandedFeaturePaths() {
        return _ref8.apply(this, arguments);
      }

      return getUnexpandedFeaturePaths;
    }()
  }]);
  return ConfigurationBuilder;
}();

exports.default = ConfigurationBuilder;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jbGkvY29uZmlndXJhdGlvbl9idWlsZGVyLmpzIl0sIm5hbWVzIjpbImdsb2JQIiwiQ29uZmlndXJhdGlvbkJ1aWxkZXIiLCJvcHRpb25zIiwiYnVpbGRlciIsImJ1aWxkIiwiYXJndiIsImN3ZCIsInBhcnNlZEFyZ3YiLCJwYXJzZSIsImFyZ3MiLCJsaXN0STE4bktleXdvcmRzRm9yIiwiaTE4bktleXdvcmRzIiwibGlzdEkxOG5MYW5ndWFnZXMiLCJpMThuTGFuZ3VhZ2VzIiwidW5leHBhbmRlZEZlYXR1cmVQYXRocyIsImdldFVuZXhwYW5kZWRGZWF0dXJlUGF0aHMiLCJmZWF0dXJlUGF0aHMiLCJzdXBwb3J0Q29kZVBhdGhzIiwiZXhwYW5kRmVhdHVyZVBhdGhzIiwidW5leHBhbmRlZFN1cHBvcnRDb2RlUGF0aHMiLCJyZXF1aXJlIiwibGVuZ3RoIiwiZ2V0RmVhdHVyZURpcmVjdG9yeVBhdGhzIiwiZXhwYW5kUGF0aHMiLCJmZWF0dXJlRGVmYXVsdExhbmd1YWdlIiwibGFuZ3VhZ2UiLCJmb3JtYXRzIiwiZ2V0Rm9ybWF0cyIsImZvcm1hdE9wdGlvbnMiLCJnZXRGb3JtYXRPcHRpb25zIiwib3JkZXIiLCJwYXJhbGxlbCIsInByb2ZpbGVzIiwicHJvZmlsZSIsInBpY2tsZUZpbHRlck9wdGlvbnMiLCJuYW1lcyIsIm5hbWUiLCJ0YWdFeHByZXNzaW9uIiwidGFncyIsInJ1bnRpbWVPcHRpb25zIiwiZHJ5UnVuIiwiZmFpbEZhc3QiLCJmaWx0ZXJTdGFja3RyYWNlcyIsImJhY2t0cmFjZSIsInJldHJ5IiwicmV0cnlUYWdGaWx0ZXIiLCJzdHJpY3QiLCJ3b3JsZFBhcmFtZXRlcnMiLCJzaG91bGRFeGl0SW1tZWRpYXRlbHkiLCJleGl0Iiwic3VwcG9ydENvZGVSZXF1aXJlZE1vZHVsZXMiLCJyZXF1aXJlTW9kdWxlIiwidW5leHBhbmRlZFBhdGhzIiwiZGVmYXVsdEV4dGVuc2lvbiIsImV4cGFuZGVkUGF0aHMiLCJtYXAiLCJ1bmV4cGFuZGVkUGF0aCIsIm1hdGNoZXMiLCJhYnNvbHV0ZSIsIm1hdGNoIiwiZXh0bmFtZSIsImZsYXR0ZW5EZXB0aCIsIm5vcm1hbGl6ZSIsIngiLCJwIiwicmVwbGFjZSIsImZlYXR1cmVEaXJzIiwiZmVhdHVyZURpciIsImRpcm5hbWUiLCJmZWF0dXJlUGF0aCIsImNoaWxkRGlyIiwicGFyZW50RGlyIiwiYmFzZW5hbWUiLCJyZWxhdGl2ZSIsInVuaXEiLCJhc3NpZ24iLCJtYXBwaW5nIiwiZm9ybWF0IiwiZm9yRWFjaCIsInNwbGl0IiwidHlwZSIsIm91dHB1dFRvIiwibmVzdGVkRmVhdHVyZVBhdGhzIiwiYXJnIiwiZmlsZW5hbWUiLCJmaWxlUGF0aCIsImpvaW4iLCJjb250ZW50IiwicmVhZEZpbGUiLCJjaGFpbiIsInRyaW0iLCJjb21wYWN0IiwidmFsdWUiLCJmbGF0dGVuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUVBOzs7Ozs7QUFFQSxJQUFNQSxRQUFRLHdDQUFkOztJQUVxQkMsb0I7Ozs7cURBQ0FDLE8sRUFBUztBQUMxQixZQUFNQyxVQUFVLElBQUlGLG9CQUFKLENBQXlCQyxPQUF6QixDQUFoQjtBQUNBLGVBQU9DLFFBQVFDLEtBQVIsRUFBUDtBQUNELE87Ozs7Ozs7Ozs7QUFFRCx1Q0FBMkI7QUFBQSxRQUFiQyxJQUFhLFNBQWJBLElBQWE7QUFBQSxRQUFQQyxHQUFPLFNBQVBBLEdBQU87QUFBQTs7QUFDekIsU0FBS0EsR0FBTCxHQUFXQSxHQUFYOztBQUVBLFFBQU1DLGFBQWEsc0JBQVdDLEtBQVgsQ0FBaUJILElBQWpCLENBQW5CO0FBQ0EsU0FBS0ksSUFBTCxHQUFZRixXQUFXRSxJQUF2QjtBQUNBLFNBQUtQLE9BQUwsR0FBZUssV0FBV0wsT0FBMUI7QUFDRDs7Ozs7d0RBRWE7QUFDWixZQUFNUSxzQkFBc0IsS0FBS1IsT0FBTCxDQUFhUyxZQUF6QztBQUNBLFlBQU1DLG9CQUFvQixD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Qyx1QkFBRCxDQUFQO0FBQ0QsTzs7Ozs7Ozs7Ozs7O2tCQXpJa0JmLG9CIiwiZmlsZSI6ImNvbmZpZ3VyYXRpb25fYnVpbGRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBfIGZyb20gJ2xvZGFzaCdcbmltcG9ydCBBcmd2UGFyc2VyIGZyb20gJy4vYXJndl9wYXJzZXInXG5pbXBvcnQgZnMgZnJvbSAnbXovZnMnXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJ1xuaW1wb3J0IE9wdGlvblNwbGl0dGVyIGZyb20gJy4vb3B0aW9uX3NwbGl0dGVyJ1xuaW1wb3J0IFByb21pc2UsIHsgcHJvbWlzaWZ5IH0gZnJvbSAnYmx1ZWJpcmQnXG5pbXBvcnQgZ2xvYiBmcm9tICdnbG9iJ1xuXG5jb25zdCBnbG9iUCA9IHByb21pc2lmeShnbG9iKVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb25maWd1cmF0aW9uQnVpbGRlciB7XG4gIHN0YXRpYyBhc3luYyBidWlsZChvcHRpb25zKSB7XG4gICAgY29uc3QgYnVpbGRlciA9IG5ldyBDb25maWd1cmF0aW9uQnVpbGRlcihvcHRpb25zKVxuICAgIHJldHVybiBidWlsZGVyLmJ1aWxkKClcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHsgYXJndiwgY3dkIH0pIHtcbiAgICB0aGlzLmN3ZCA9IGN3ZFxuXG4gICAgY29uc3QgcGFyc2VkQXJndiA9IEFyZ3ZQYXJzZXIucGFyc2UoYXJndilcbiAgICB0aGlzLmFyZ3MgPSBwYXJzZWRBcmd2LmFyZ3NcbiAgICB0aGlzLm9wdGlvbnMgPSBwYXJzZWRBcmd2Lm9wdGlvbnNcbiAgfVxuXG4gIGFzeW5jIGJ1aWxkKCkge1xuICAgIGNvbnN0IGxpc3RJMThuS2V5d29yZHNGb3IgPSB0aGlzLm9wdGlvbnMuaTE4bktleXdvcmRzXG4gICAgY29uc3QgbGlzdEkxOG5MYW5ndWFnZXMgPSAhIXRoaXMub3B0aW9ucy5pMThuTGFuZ3VhZ2VzXG4gICAgY29uc3QgdW5leHBhbmRlZEZlYXR1cmVQYXRocyA9IGF3YWl0IHRoaXMuZ2V0VW5leHBhbmRlZEZlYXR1cmVQYXRocygpXG4gICAgbGV0IGZlYXR1cmVQYXRocyA9IFtdXG4gICAgbGV0IHN1cHBvcnRDb2RlUGF0aHMgPSBbXVxuICAgIGlmICghbGlzdEkxOG5LZXl3b3Jkc0ZvciAmJiAhbGlzdEkxOG5MYW5ndWFnZXMpIHtcbiAgICAgIGZlYXR1cmVQYXRocyA9IGF3YWl0IHRoaXMuZXhwYW5kRmVhdHVyZVBhdGhzKHVuZXhwYW5kZWRGZWF0dXJlUGF0aHMpXG4gICAgICBsZXQgdW5leHBhbmRlZFN1cHBvcnRDb2RlUGF0aHMgPSB0aGlzLm9wdGlvbnMucmVxdWlyZVxuICAgICAgaWYgKHVuZXhwYW5kZWRTdXBwb3J0Q29kZVBhdGhzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICB1bmV4cGFuZGVkU3VwcG9ydENvZGVQYXRocyA9IHRoaXMuZ2V0RmVhdHVyZURpcmVjdG9yeVBhdGhzKGZlYXR1cmVQYXRocylcbiAgICAgIH1cbiAgICAgIHN1cHBvcnRDb2RlUGF0aHMgPSBhd2FpdCB0aGlzLmV4cGFuZFBhdGhzKFxuICAgICAgICB1bmV4cGFuZGVkU3VwcG9ydENvZGVQYXRocyxcbiAgICAgICAgJy5qcydcbiAgICAgIClcbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgIGZlYXR1cmVEZWZhdWx0TGFuZ3VhZ2U6IHRoaXMub3B0aW9ucy5sYW5ndWFnZSxcbiAgICAgIGZlYXR1cmVQYXRocyxcbiAgICAgIGZvcm1hdHM6IHRoaXMuZ2V0Rm9ybWF0cygpLFxuICAgICAgZm9ybWF0T3B0aW9uczogdGhpcy5nZXRGb3JtYXRPcHRpb25zKCksXG4gICAgICBsaXN0STE4bktleXdvcmRzRm9yLFxuICAgICAgbGlzdEkxOG5MYW5ndWFnZXMsXG4gICAgICBvcmRlcjogdGhpcy5vcHRpb25zLm9yZGVyLFxuICAgICAgcGFyYWxsZWw6IHRoaXMub3B0aW9ucy5wYXJhbGxlbCxcbiAgICAgIHByb2ZpbGVzOiB0aGlzLm9wdGlvbnMucHJvZmlsZSxcbiAgICAgIHBpY2tsZUZpbHRlck9wdGlvbnM6IHtcbiAgICAgICAgZmVhdHVyZVBhdGhzOiB1bmV4cGFuZGVkRmVhdHVyZVBhdGhzLFxuICAgICAgICBuYW1lczogdGhpcy5vcHRpb25zLm5hbWUsXG4gICAgICAgIHRhZ0V4cHJlc3Npb246IHRoaXMub3B0aW9ucy50YWdzLFxuICAgICAgfSxcbiAgICAgIHJ1bnRpbWVPcHRpb25zOiB7XG4gICAgICAgIGRyeVJ1bjogISF0aGlzLm9wdGlvbnMuZHJ5UnVuLFxuICAgICAgICBmYWlsRmFzdDogISF0aGlzLm9wdGlvbnMuZmFpbEZhc3QsXG4gICAgICAgIGZpbHRlclN0YWNrdHJhY2VzOiAhdGhpcy5vcHRpb25zLmJhY2t0cmFjZSxcbiAgICAgICAgcmV0cnk6IHRoaXMub3B0aW9ucy5yZXRyeSxcbiAgICAgICAgcmV0cnlUYWdGaWx0ZXI6IHRoaXMub3B0aW9ucy5yZXRyeVRhZ0ZpbHRlcixcbiAgICAgICAgc3RyaWN0OiAhIXRoaXMub3B0aW9ucy5zdHJpY3QsXG4gICAgICAgIHdvcmxkUGFyYW1ldGVyczogdGhpcy5vcHRpb25zLndvcmxkUGFyYW1ldGVycyxcbiAgICAgIH0sXG4gICAgICBzaG91bGRFeGl0SW1tZWRpYXRlbHk6ICEhdGhpcy5vcHRpb25zLmV4aXQsXG4gICAgICBzdXBwb3J0Q29kZVBhdGhzLFxuICAgICAgc3VwcG9ydENvZGVSZXF1aXJlZE1vZHVsZXM6IHRoaXMub3B0aW9ucy5yZXF1aXJlTW9kdWxlLFxuICAgIH1cbiAgfVxuXG4gIGFzeW5jIGV4cGFuZFBhdGhzKHVuZXhwYW5kZWRQYXRocywgZGVmYXVsdEV4dGVuc2lvbikge1xuICAgIGNvbnN0IGV4cGFuZGVkUGF0aHMgPSBhd2FpdCBQcm9taXNlLm1hcChcbiAgICAgIHVuZXhwYW5kZWRQYXRocyxcbiAgICAgIGFzeW5jIHVuZXhwYW5kZWRQYXRoID0+IHtcbiAgICAgICAgY29uc3QgbWF0Y2hlcyA9IGF3YWl0IGdsb2JQKHVuZXhwYW5kZWRQYXRoLCB7XG4gICAgICAgICAgYWJzb2x1dGU6IHRydWUsXG4gICAgICAgICAgY3dkOiB0aGlzLmN3ZCxcbiAgICAgICAgfSlcbiAgICAgICAgcmV0dXJuIFByb21pc2UubWFwKG1hdGNoZXMsIGFzeW5jIG1hdGNoID0+IHtcbiAgICAgICAgICBpZiAocGF0aC5leHRuYW1lKG1hdGNoKSA9PT0gJycpIHtcbiAgICAgICAgICAgIHJldHVybiBnbG9iUChgJHttYXRjaH0vKiovKiR7ZGVmYXVsdEV4dGVuc2lvbn1gKVxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gbWF0Y2hcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICApXG4gICAgcmV0dXJuIF8uZmxhdHRlbkRlcHRoKGV4cGFuZGVkUGF0aHMsIDIpLm1hcCh4ID0+IHBhdGgubm9ybWFsaXplKHgpKVxuICB9XG5cbiAgYXN5bmMgZXhwYW5kRmVhdHVyZVBhdGhzKGZlYXR1cmVQYXRocykge1xuICAgIGZlYXR1cmVQYXRocyA9IGZlYXR1cmVQYXRocy5tYXAocCA9PiBwLnJlcGxhY2UoLyg6XFxkKykqJC9nLCAnJykpIC8vIFN0cmlwIGxpbmUgbnVtYmVyc1xuICAgIHJldHVybiB0aGlzLmV4cGFuZFBhdGhzKGZlYXR1cmVQYXRocywgJy5mZWF0dXJlJylcbiAgfVxuXG4gIGdldEZlYXR1cmVEaXJlY3RvcnlQYXRocyhmZWF0dXJlUGF0aHMpIHtcbiAgICBjb25zdCBmZWF0dXJlRGlycyA9IGZlYXR1cmVQYXRocy5tYXAoZmVhdHVyZVBhdGggPT4ge1xuICAgICAgbGV0IGZlYXR1cmVEaXIgPSBwYXRoLmRpcm5hbWUoZmVhdHVyZVBhdGgpXG4gICAgICBsZXQgY2hpbGREaXJcbiAgICAgIGxldCBwYXJlbnREaXIgPSBmZWF0dXJlRGlyXG4gICAgICB3aGlsZSAoY2hpbGREaXIgIT09IHBhcmVudERpcikge1xuICAgICAgICBjaGlsZERpciA9IHBhcmVudERpclxuICAgICAgICBwYXJlbnREaXIgPSBwYXRoLmRpcm5hbWUoY2hpbGREaXIpXG4gICAgICAgIGlmIChwYXRoLmJhc2VuYW1lKHBhcmVudERpcikgPT09ICdmZWF0dXJlcycpIHtcbiAgICAgICAgICBmZWF0dXJlRGlyID0gcGFyZW50RGlyXG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHBhdGgucmVsYXRpdmUodGhpcy5jd2QsIGZlYXR1cmVEaXIpXG4gICAgfSlcbiAgICByZXR1cm4gXy51bmlxKGZlYXR1cmVEaXJzKVxuICB9XG5cbiAgZ2V0Rm9ybWF0T3B0aW9ucygpIHtcbiAgICByZXR1cm4gXy5hc3NpZ24oe30sIHRoaXMub3B0aW9ucy5mb3JtYXRPcHRpb25zLCB7IGN3ZDogdGhpcy5jd2QgfSlcbiAgfVxuXG4gIGdldEZvcm1hdHMoKSB7XG4gICAgY29uc3QgbWFwcGluZyA9IHsgJyc6ICdwcm9ncmVzcycgfVxuICAgIHRoaXMub3B0aW9ucy5mb3JtYXQuZm9yRWFjaChmb3JtYXQgPT4ge1xuICAgICAgY29uc3QgW3R5cGUsIG91dHB1dFRvXSA9IE9wdGlvblNwbGl0dGVyLnNwbGl0KGZvcm1hdClcbiAgICAgIG1hcHBpbmdbb3V0cHV0VG8gfHwgJyddID0gdHlwZVxuICAgIH0pXG4gICAgcmV0dXJuIF8ubWFwKG1hcHBpbmcsICh0eXBlLCBvdXRwdXRUbykgPT4gKHsgb3V0cHV0VG8sIHR5cGUgfSkpXG4gIH1cblxuICBhc3luYyBnZXRVbmV4cGFuZGVkRmVhdHVyZVBhdGhzKCkge1xuICAgIGlmICh0aGlzLmFyZ3MubGVuZ3RoID4gMCkge1xuICAgICAgY29uc3QgbmVzdGVkRmVhdHVyZVBhdGhzID0gYXdhaXQgUHJvbWlzZS5tYXAodGhpcy5hcmdzLCBhc3luYyBhcmcgPT4ge1xuICAgICAgICBjb25zdCBmaWxlbmFtZSA9IHBhdGguYmFzZW5hbWUoYXJnKVxuICAgICAgICBpZiAoZmlsZW5hbWVbMF0gPT09ICdAJykge1xuICAgICAgICAgIGNvbnN0IGZpbGVQYXRoID0gcGF0aC5qb2luKHRoaXMuY3dkLCBhcmcpXG4gICAgICAgICAgY29uc3QgY29udGVudCA9IGF3YWl0IGZzLnJlYWRGaWxlKGZpbGVQYXRoLCAndXRmOCcpXG4gICAgICAgICAgcmV0dXJuIF8uY2hhaW4oY29udGVudClcbiAgICAgICAgICAgIC5zcGxpdCgnXFxuJylcbiAgICAgICAgICAgIC5tYXAoXy50cmltKVxuICAgICAgICAgICAgLmNvbXBhY3QoKVxuICAgICAgICAgICAgLnZhbHVlKClcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYXJnXG4gICAgICB9KVxuICAgICAgY29uc3QgZmVhdHVyZVBhdGhzID0gXy5mbGF0dGVuKG5lc3RlZEZlYXR1cmVQYXRocylcbiAgICAgIGlmIChmZWF0dXJlUGF0aHMubGVuZ3RoID4gMCkge1xuICAgICAgICByZXR1cm4gZmVhdHVyZVBhdGhzXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBbJ2ZlYXR1cmVzLyoqLyouZmVhdHVyZSddXG4gIH1cbn1cbiJdfQ==