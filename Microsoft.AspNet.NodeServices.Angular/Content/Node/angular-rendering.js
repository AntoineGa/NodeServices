var path = require('path');
var ngUniversal = require('angular2-universal-patched');
var ng = require('angular2/angular2');
var ngRouter = require('angular2/router');

function getExportOrThrow(moduleInstance, moduleFilename, exportName) {
    if (!(exportName in moduleInstance)) {
        throw new Error('The module "' + moduleFilename + '" has no export named "' + exportName + '"');
    }
    return moduleInstance[exportName];
}

function findAngularComponent(options) {
    var resolvedPath = path.resolve(process.cwd(), options.moduleName);
    var loadedModule = require(resolvedPath);
    if (options.exportName) {
        // If exportName is specified explicitly, use it
        return getExportOrThrow(loadedModule, resolvedPath, options.exportName);
    } else if (typeof loadedModule === 'function') {
        // Otherwise, if the module itself is a function, assume that is the component 
        return loadedModule;
    } else if (typeof loadedModule.default === 'function') {
        // Otherwise, if the module has a default export which is a function, assume that is the component
        return loadedModule.default;
    } else {
        // Otherwise, guess the export name by converting tag-name to PascalCase
        var tagNameAsPossibleExport = options.tagName.replace(/(-|^)([a-z])/g, function (m1, m2, char) { return char.toUpperCase(); });
        return getExportOrThrow(loadedModule, resolvedPath, tagNameAsPossibleExport);
    }
}

module.exports = {
    renderToString: function(callback, options) {
        var component = findAngularComponent(options);
        var serverBindings = [
            ngRouter.ROUTER_BINDINGS,
            ngUniversal.HTTP_PROVIDERS,
            ng.provide(ngUniversal.BASE_URL, { useValue: options.requestUrl }),
            ngUniversal.SERVER_LOCATION_PROVIDERS
        ];

        return ngUniversal.renderToString(component, serverBindings).then(
            function(successValue) { callback(null, successValue); },
            function(errorValue) { callback(errorValue); }
        );
    }
};
