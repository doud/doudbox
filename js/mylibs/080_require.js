var require;
(function () {
    //Change this version number for each release.
    var version = "0.12.0",
            empty = {}, s,
            i, defContextName = "_", contextLoads = [],
            scripts, script, rePkg, src, m, cfg, setReadyState,
            readyRegExp = /^(complete|loaded)$/,
            isBrowser = !!(typeof window !== "undefined" && navigator && document),
            isWebWorker = !isBrowser && typeof importScripts !== "undefined",
            ostring = Object.prototype.toString, scrollIntervalId, req, baseElement;

    function isFunction(it) {
        return ostring.call(it) === "[object Function]";
    }

    //Check for an existing version of require. If so, then exit out. Only allow
    //one version of require to be active in a page. However, allow for a require
    //config object, just exit quickly if require is an actual function.
    if (typeof require !== "undefined") {
        if (isFunction(require)) {
            return;
        } else {
            //assume it is a config object.
            cfg = require;
        }
    }

        
    
    /**
     * Main entry point.
     *
     * If the only argument to require is a string, then the module that
     * is represented by that string is fetched for the appropriate context.
     *
     * If the first argument is an array, then it will be treated as an array
     * of dependency string names to fetch. An optional function callback can
     * be specified to execute when all of those dependencies are available.
     */
    require = function (deps, callback, contextName) {
        if (typeof deps === "string" && !isFunction(callback)) {
            //Just return the module wanted. In this scenario, the
            //second arg (if passed) is just the contextName.
            return require.get(deps, callback);
        }

        //Do more work, either 
        return require.def.apply(require, arguments);
    };
    
    //Alias for caja compliance internally -
    //specifically: "Dynamically computed names should use require.async()"
    //even though this spec isn't really decided on.
    req = require;

    /**
     * The function that handles definitions of modules. Differs from
     * require() in that a string for the module should be the first argument,
     * and the function to execute after dependencies are loaded should
     * return a value to define the module corresponding to the first argument's
     * name.
     */
    require.def = function (name, deps, callback, contextName) {
        var config = null, context, newContext, contextRequire, loaded,
            canSetContext, prop, newLength, outDeps,
            mods, pluginPrefix, paths, index, i;

        //Normalize the arguments.
        if (typeof name === "string") {
            //Defining a module. First, pull off any plugin prefix.
            index = name.indexOf("!");
            if (index !== -1) {
                pluginPrefix = name.substring(0, index);
                name = name.substring(index + 1, name.length);
            }

            //Check if there are no dependencies, and adjust args.
            if (!require.isArray(deps)) {
                contextName = callback;
                callback = deps;
                deps = [];
            }

            contextName = contextName || s.ctxName;

            //If module already defined for context, or already waiting to be
            //evaluated, leave.
            context = s.contexts[contextName];
            if (context && (context.defined[name] || context.waiting[name])) {
                return require;
            }
        } else if (require.isArray(name)) {
            //Just some code that has dependencies. Adjust args accordingly.
            contextName = callback;
            callback = deps;
            deps = name;
            name = null;
        } else if (require.isFunction(name)) {
            //Just a function that does not define a module and
            //does not have dependencies. Useful if just want to wait
            //for whatever modules are in flight and execute some code after
            //those modules load.
            callback = name;
            contextName = deps;
            name = null;
            deps = [];
        } else {
            //name is a config object.
            config = name;
            name = null;
            //Adjust args if no dependencies.
            if (require.isFunction(deps)) {
                contextName = callback;
                callback = deps;
                deps = [];
            }

            contextName = contextName || config.context;
        }

        contextName = contextName || s.ctxName;

        
        //Grab the context, or create a new one for the given context name.
        context = s.contexts[contextName];
        if (!context) {
            newContext = {
                contextName: contextName,
                config: {
                    waitSeconds: 7,
                    baseUrl: s.baseUrl || "./",
                    paths: {}
                },
                waiting: [],
                specified: {
                    "require": true,
                    "exports": true,
                    "module": true
                },
                loaded: {
                    "require": true
                },
                urlFetched: {},
                defined: {},
                modifiers: {}
            };

            //Define require for this context.
                        //A placeholder for build pragmas.
            newContext.defined.require = require;
                        
            
            context = s.contexts[contextName] = newContext;
        }

        //If have a config object, update the context's config object with
        //the config values.
        if (config) {
            //Make sure the baseUrl ends in a slash.
            if (config.baseUrl) {
                if (config.baseUrl.charAt(config.baseUrl.length - 1) !== "/") {
                    config.baseUrl += "/";
                }
            }

            //Save off the paths since they require special processing,
            //they are additive.
            paths = context.config.paths;

            //Mix in the config values, favoring the new values over
            //existing ones in context.config.
            require.mixin(context.config, config, true);

            //Adjust paths if necessary.
            if (config.paths) {
                for (prop in config.paths) {
                    if (!(prop in empty)) {
                        paths[prop] = config.paths[prop];
                    }
                }
                context.config.paths = paths;
            }
            
            //If priority loading is in effect, trigger the loads now
            if (config.priority) {
                //Create a separate config property that can be
                //easily tested for config priority completion.
                //Do this instead of wiping out the config.priority
                //in case it needs to be inspected for debug purposes later.
                req(config.priority);
                context.config.priorityWait = config.priority;
            }

            //If a deps array or a config callback is specified, then call
            //require with those args. This is useful when require is defined as a
            //config object before require.js is loaded.
            if (config.deps || config.callback) {
                req(config.deps || [], config.callback);
            }

            
            //If it is just a config block, nothing else,
            //then return.
            if (!deps) {
                return require;
            }
        }

        //Normalize dependency strings: need to determine if they have
        //prefixes and to also normalize any relative paths. Replace the deps
        //array of strings with an array of objects.
        if (deps) {
            outDeps = deps;
            deps = [];
            for (i = 0; i < outDeps.length; i++) {
                deps[i] = require.splitPrefix(outDeps[i], name);
            }
        }

        //Store the module for later evaluation
        newLength = context.waiting.push({
            name: name,
            deps: deps,
            callback: callback
        });

        if (name) {
            //Store index of insertion for quick lookup
            context.waiting[name] = newLength - 1;

            //Mark the module as specified so no need to fetch it again.
            //Important to set specified here for the
            //pause/resume case where there are multiple modules in a file.
            context.specified[name] = true;

                    }

        //If the callback is not an actual function, it means it already
        //has the definition of the module as a literal value.
        if (name && callback && !require.isFunction(callback)) {
            context.defined[name] = callback;
        }

        //If a pluginPrefix is available, call the plugin, or load it.
        
        //See if all is loaded. If paused, then do not check the dependencies
        //of the module yet.
        if (s.paused || context.config.priorityWait) {
            (s.paused || (s.paused = [])).push([pluginPrefix, name, deps, context]);
        } else {
            require.checkDeps(pluginPrefix, name, deps, context);
            require.checkLoaded(contextName);
        }

        //Set loaded here for modules that are also loaded
        //as part of a layer, where onScriptLoad is not fired
        //for those cases. Do this after the inline define and
        //dependency tracing is done.
        if (name) {
            context.loaded[name] = true;
        }
        return require;
    };

    /**
     * Simple function to mix in properties from source into target,
     * but only if target does not already have a property of the same name.
     */
    require.mixin = function (target, source, force) {
        for (var prop in source) {
            if (!(prop in empty) && (!(prop in target) || force)) {
                target[prop] = source[prop];
            }
        }
        return require;
    };

    require.version = version;

    //Set up page state.
    s = require.s = {
        ctxName: defContextName,
        contexts: {},
                //Stores a list of URLs that should not get async script tag treatment.
        skipAsync: {},
        isBrowser: isBrowser,
        isPageLoaded: !isBrowser,
        readyCalls: [],
        doc: isBrowser ? document : null
    };

    require.isBrowser = s.isBrowser;
    if (isBrowser) {
        s.head = document.getElementsByTagName("head")[0];
        //If BASE tag is in play, using appendChild is a problem for IE6.
        //When that browser dies, this can be removed. Details in this jQuery bug:
        //http://dev.jquery.com/ticket/2709
        baseElement = document.getElementsByTagName("base")[0];
        if (baseElement) {
            s.head = baseElement.parentNode;
        }
    }

    
    /**
     * Pauses the tracing of dependencies. Useful in a build scenario when
     * multiple modules are bundled into one file, and they all need to be
     * require before figuring out what is left still to load.
     */
    require.pause = function () {
        if (!s.paused) {
            s.paused = [];
        }
    };

    /**
     * Resumes the tracing of dependencies. Useful in a build scenario when
     * multiple modules are bundled into one file. This method is related
     * to require.pause() and should only be called if require.pause() was called first.
     */
    require.resume = function () {
        var i, args, paused;

        //Skip the resume if current context is in priority wait.
        if (s.contexts[s.ctxName].config.priorityWait) {
            return;
        }

        if (s.paused) {
            paused = s.paused;
            delete s.paused;
            for (i = 0; (args = paused[i]); i++) {
                require.checkDeps.apply(require, args);
            }
        }
        require.checkLoaded(s.ctxName);
    };

    /**
     * Trace down the dependencies to see if they are loaded. If not, trigger
     * the load.
     * @param {String} pluginPrefix the plugin prefix, if any associated with the name.
     *
     * @param {String} name: the name of the module that has the dependencies.
     *
     * @param {Array} deps array of dependencies.
     *
     * @param {Object} context: the loading context.
     *
     * @private
     */
    require.checkDeps = function (pluginPrefix, name, deps, context) {
        //Figure out if all the modules are loaded. If the module is not
        //being loaded or already loaded, add it to the "to load" list,
        //and request it to be loaded.
        var i, dep;

        if (pluginPrefix) {
                    } else {
            for (i = 0; (dep = deps[i]); i++) {
                if (!context.specified[dep.fullName]) {
                    context.specified[dep.fullName] = true;

                    //If a plugin, call its load method.
                    if (dep.prefix) {
                                            } else {
                        require.load(dep.name, context.contextName);
                    }
                }
            }
        }
    };

    
    require.isArray = function (it) {
        return ostring.call(it) === "[object Array]";
    };

    require.isFunction = isFunction;

    /**
     * Gets one module's exported value. This method is used by require().
     * It is broken out as a separate function to allow a host environment
     * shim to overwrite this function with something appropriate for that
     * environment.
     *
     * @param {String} moduleName the name of the module.
     * @param {String} [contextName] the name of the context to use. Uses
     * default context if no contextName is provided.
     *
     * @returns {Object} the exported module value.
     */
    require.get = function (moduleName, contextName) {
        if (moduleName === "exports" || moduleName === "module") {
            throw new Error("require of " + moduleName + " is not allowed.");
        }
        contextName = contextName || s.ctxName;
        var ret = s.contexts[contextName].defined[moduleName];
        if (ret === undefined) {
            throw new Error("require: module name '" +
                            moduleName +
                            "' has not been loaded yet for context: " +
                            contextName);
        }
        return ret;
    };

    /**
     * Makes the request to load a module. May be an async load depending on
     * the environment and the circumstance of the load call. Override this
     * method in a host environment shim to do something specific for that
     * environment.
     *
     * @param {String} moduleName the name of the module.
     * @param {String} contextName the name of the context to use.
     */
    require.load = function (moduleName, contextName) {
        var context = s.contexts[contextName],
            urlFetched = context.urlFetched,
            loaded = context.loaded, url;
        s.isDone = false;

        //Only set loaded to false for tracking if it has not already been set.
        if (!loaded[moduleName]) {
            loaded[moduleName] = false;
        }

                    //First derive the path name for the module.
            url = require.nameToUrl(moduleName, null, contextName);
            if (!urlFetched[url]) {
                require.attach(url, contextName, moduleName);
                urlFetched[url] = true;
            }
            context.startTime = (new Date()).getTime();
            };

    require.jsExtRegExp = /\.js$/;

    
    /**
     * Given a relative module name, like ./something, normalize it to
     * a real name that can be mapped to a path.
     * @param {String} name the relative name
     * @param {String} baseName a real name that the name arg is relative
     * to.
     * @returns {String} normalized name
     */
    require.normalizeName = function (name, baseName) {
        //Adjust any relative paths.
        var part;
        if (name.charAt(0) === ".") {
            //Convert baseName to array, and lop off the last part,
            //so that . matches that "directory" and not name of the baseName's
            //module. For instance, baseName of "one/two/three", maps to
            //"one/two/three.js", but we want the directory, "one/two" for
            //this normalization.
            baseName = baseName.split("/");
            baseName = baseName.slice(0, baseName.length - 1);

            name = baseName.concat(name.split("/"));
            for (i = 0; (part = name[i]); i++) {
                if (part === ".") {
                    name.splice(i, 1);
                    i -= 1;
                } else if (part === "..") {
                    name.splice(i - 1, 2);
                    i -= 2;
                }
            }
            name = name.join("/");
        }
        return name;
    };

    /**
     * Splits a name into a possible plugin prefix and
     * the module name. If baseName is provided it will
     * also normalize the name via require.normalizeName()
     * 
     * @param {String} name the module name
     * @param {String} [baseName] base name that name is
     * relative to.
     *
     * @returns {Object} with properties, 'prefix' (which
     * may be null), 'name' and 'fullName', which is a combination
     * of the prefix (if it exists) and the name.
     */
    require.splitPrefix = function (name, baseName) {
        var index = name.indexOf("!"), prefix = null;
        if (index !== -1) {
            prefix = name.substring(0, index);
            name = name.substring(index + 1, name.length);
        }

        //Account for relative paths if there is a base name.
        if (baseName) {
            name = require.normalizeName(name, baseName);
        }

        return {
            prefix: prefix,
            name: name,
            fullName: prefix ? prefix + "!" + name : name
        };
    };

    /**
     * Converts a module name to a file path.
     */
    require.nameToUrl = function (moduleName, ext, contextName) {
        var paths, syms, i, parentModule, url,
            config = s.contexts[contextName].config;

        //If a colon is in the URL, it indicates a protocol is used and it is just
        //an URL to a file, or if it starts with a slash or ends with .js, it is just a plain file.
        //The slash is important for protocol-less URLs as well as full paths.
        if (moduleName.indexOf(":") !== -1 || moduleName.charAt(0) === '/' || require.jsExtRegExp.test(moduleName)) {
            //Just a plain path, not module name lookup, so just return it.
            return moduleName;
        } else if (moduleName.charAt(0) === ".") {
            throw new Error("require.nameToUrl does not handle relative module names (ones that start with '.' or '..')");
        } else {
            //A module that needs to be converted to a path.
            paths = config.paths;

            syms = moduleName.split("/");
            //For each module name segment, see if there is a path
            //registered for it. Start with most specific name
            //and work up from it.
            for (i = syms.length; i > 0; i--) {
                parentModule = syms.slice(0, i).join("/");
                if (paths[parentModule]) {
                    syms.splice(0, i, paths[parentModule]);
                    break;
                }
            }

            //Join the path parts together, then figure out if baseUrl is needed.
            url = syms.join("/") + (ext || ".js");
            return ((url.charAt(0) === '/' || url.match(/^\w+:/)) ? "" : config.baseUrl) + url;
        }
    };

    /**
     * Checks if all modules for a context are loaded, and if so, evaluates the
     * new ones in right dependency order.
     *
     * @private
     */
    require.checkLoaded = function (contextName) {
        var context = s.contexts[contextName || s.ctxName],
                waitInterval = context.config.waitSeconds * 1000,
                //It is possible to disable the wait interval by using waitSeconds of 0.
                expired = waitInterval && (context.startTime + waitInterval) < new Date().getTime(),
                loaded, defined = context.defined,
                modifiers = context.modifiers, waiting, noLoads = "",
                hasLoadedProp = false, stillLoading = false, prop, priorityDone,
                priorityName,

                
                i, module, allDone, loads, loadArgs, err,
                traced = {};

        //If already doing a checkLoaded call,
        //then do not bother checking loaded state.
        if (context.isCheckLoaded) {
            return;
        }

        //Determine if priority loading is done. If so clear the priority. If
        //not, then do not check
        if (context.config.priorityWait) {
            priorityDone = true;
            for (i = 0; (priorityName = context.config.priorityWait[i]); i++) {
                if (!context.loaded[priorityName]) {
                    priorityDone = false;
                    break;
                }
            }
            if (priorityDone) {
                //Clean up priority and call resume, since it could have
                //some waiting dependencies to trace.
                delete context.config.priorityWait;
                require.resume();
            } else {
                return;
            }
        }

        //Signal that checkLoaded is being require, so other calls that could be triggered
        //by calling a waiting callback that then calls require and then this function
        //should not proceed. At the end of this function, if there are still things
        //waiting, then checkLoaded will be called again.
        context.isCheckLoaded = true;

        //Grab waiting and loaded lists here, since it could have changed since
        //this function was first called, for instance, by the require.resume()
        waiting = context.waiting;
        loaded = context.loaded;

        //See if anything is still in flight.
        for (prop in loaded) {
            if (!(prop in empty)) {
                hasLoadedProp = true;
                if (!loaded[prop]) {
                    if (expired) {
                        noLoads += prop + " ";
                    } else {
                        stillLoading = true;
                        break;
                    }
                }
            }
        }

        //Check for exit conditions.
        if (!hasLoadedProp && !waiting.length
                       ) {
            //If the loaded object had no items, then the rest of
            //the work below does not need to be done.
            context.isCheckLoaded = false;
            return;
        }
        if (expired && noLoads) {
            //If wait time expired, throw error of unloaded modules.
            err = new Error("require.js load timeout for modules: " + noLoads);
            err.requireType = "timeout";
            err.requireModules = noLoads;
        }
        if (stillLoading) {
            //Something is still waiting to load. Wait for it.
            context.isCheckLoaded = false;
            if (isBrowser || isWebWorker) {
                setTimeout(function () {
                    require.checkLoaded(contextName);
                }, 50);
            }
            return;
        }

        //Order the dependencies. Also clean up state because the evaluation
        //of modules might create new loading tasks, so need to reset.
        //Be sure to call plugins too.
        context.waiting = [];
        context.loaded = {};

        
        
        //Define the modules, doing a depth first search.
        for (i = 0; (module = waiting[i]); i++) {
            require.exec(module, traced, waiting, context);
        }

        //Indicate checkLoaded is now done.
        context.isCheckLoaded = false;

        if (context.waiting.length
                       ) {
            //More things in this context are waiting to load. They were probably
            //added while doing the work above in checkLoaded, calling module
            //callbacks that triggered other require calls.
            require.checkLoaded(contextName);
        } else if (contextLoads.length) {
                    } else {
            //Make sure we reset to default context.
            s.ctxName = defContextName;
            s.isDone = true;
            if (require.callReady) {
                require.callReady();
            }
        }
    };

    /**
     * Executes the modules in the correct order.
     * 
     * @private
     */
    require.exec = function (module, traced, waiting, context) {
        //Some modules are just plain script files, abddo not have a formal
        //module definition, 
        if (!module) {
            return undefined;
        }

        var name = module.name, cb = module.callback, deps = module.deps, j, dep,
            defined = context.defined, ret, args = [], depModule,
            usingExports = false, depName;

        //If already traced or defined, do not bother a second time.
        if (name) {
            if (traced[name] || name in defined) {
                return defined[name];
            }
    
            //Mark this module as being traced, so that it is not retraced (as in a circular
            //dependency)
            traced[name] = true;
        }

        if (deps) {
            for (j = 0; (dep = deps[j]); j++) {
                depName = dep.name;
                if (depName === "exports") {
                    //CommonJS module spec 1.1
                    depModule = defined[name] = {};
                    usingExports = true;
                } else if (depName === "module") {
                    //CommonJS module spec 1.1
                    depModule = {
                        id: name,
                        uri: name ? require.nameToUrl(name, null, context.contextName) : undefined
                    };
                } else {
                    //Get dependent module. It could not exist, for a circular
                    //dependency or if the loaded dependency does not actually call
                    //require. Favor not throwing an error here if undefined because
                    //we want to allow code that does not use require as a module
                    //definition framework to still work -- allow a web site to
                    //gradually update to contained modules. That is more
                    //important than forcing a throw for the circular dependency case.
                    depModule = depName in defined ? defined[depName] : (traced[depName] ? undefined : require.exec(waiting[waiting[depName]], traced, waiting, context));
                }

                args.push(depModule);
            }
        }

        //Call the callback to define the module, if necessary.
        cb = module.callback;
        if (cb && require.isFunction(cb)) {
            ret = require.execCb(name, cb, args);
            if (name) {
                if (usingExports) {
                    ret = defined[name];
                } else {
                    if (name in defined) {
                        throw new Error(name + " has already been defined");
                    } else {
                        defined[name] = ret;
                    }
                }
            }
        }

        
        return ret;
    };

    /**
     * Executes a module callack function. Broken out as a separate function
     * solely to allow the build system to sequence the files in the built
     * layer in the right sequence.
     * @param {String} name the module name.
     * @param {Function} cb the module callback/definition function.
     * @param {Array} args The arguments (dependent modules) to pass to callback.
     *
     * @private
     */
    require.execCb = function (name, cb, args) {
        return cb.apply(null, args);
    };

    
    /**
     * callback for script loads, used to check status of loading.
     *
     * @param {Event} evt the event from the browser for the script
     * that was loaded.
     *
     * @private
     */
    require.onScriptLoad = function (evt) {
        //Using currentTarget instead of target for Firefox 2.0's sake. Not
        //all old browsers will be supported, but this one was easy enough
        //to support and still makes sense.
        var node = evt.currentTarget || evt.srcElement, contextName, moduleName;
        if (evt.type === "load" || readyRegExp.test(node.readyState)) {
            //Pull out the name of the module and the context.
            contextName = node.getAttribute("data-requirecontext");
            moduleName = node.getAttribute("data-requiremodule");

            //Mark the module loaded. Must do it here in addition
            //to doing it in require.def in case a script does
            //not call require.def
            s.contexts[contextName].loaded[moduleName] = true;

            require.checkLoaded(contextName);

            //Clean up script binding.
            if (node.removeEventListener) {
                node.removeEventListener("load", require.onScriptLoad, false);
            } else {
                //Probably IE.
                node.detachEvent("onreadystatechange", require.onScriptLoad);
            }
        }
    };

    /**
     * Attaches the script represented by the URL to the current
     * environment. Right now only supports browser loading,
     * but can be redefined in other environments to do the right thing.
     * @param {String} url the url of the script to attach.
     * @param {String} contextName the name of the context that wants the script.
     * @param {moduleName} the name of the module that is associated with the script.
     * @param {Function} [callback] optional callback, defaults to require.onScriptLoad
     * @param {String} [type] optional type, defaults to text/javascript
     */
    require.attach = function (url, contextName, moduleName, callback, type) {
        var node, loaded;
        if (isBrowser) {
            //In the browser so use a script tag
            callback = callback || require.onScriptLoad;
            node = document.createElement("script");
            node.type = type || "text/javascript";
            node.charset = "utf-8";
            //Use async so Gecko does not block on executing the script if something
            //like a long-polling comet tag is being run first. Gecko likes
            //to evaluate scripts in DOM order, even for dynamic scripts.
            //It will fetch them async, but only evaluate the contents in DOM
            //order, so a long-polling script tag can delay execution of scripts
            //after it. But telling Gecko we expect async gets us the behavior
            //we want -- execute it whenever it is finished downloading. Only
            //Helps Firefox 3.6+
            //Allow some URLs to not be fetched async. Mostly helps the order!
            //plugin
            if (!s.skipAsync[url]) {
                node.setAttribute("async", "async");
            }
            node.setAttribute("data-requirecontext", contextName);
            node.setAttribute("data-requiremodule", moduleName);

            //Set up load listener.
            if (node.addEventListener) {
                node.addEventListener("load", callback, false);
            } else {
                //Probably IE.
                node.attachEvent("onreadystatechange", callback);
            }
            node.src = url;

            return baseElement ? s.head.insertBefore(node, baseElement) : s.head.appendChild(node);
        } else if (isWebWorker) {
            //In a web worker, use importScripts. This is not a very
            //efficient use of importScripts, importScripts will block until
            //its script is downloaded and evaluated. However, if web workers
            //are in play, the expectation that a build has been done so that
            //only one script needs to be loaded anyway. This may need to be
            //reevaluated if other use cases become common.
            loaded = s.contexts[contextName].loaded;
            loaded[moduleName] = false;
            importScripts(url);
            //Just mark the script loaded, someone else will check dependencies
            //when all done.
            loaded[moduleName] = true;
        }
        return null;
    };

    //Determine what baseUrl should be if not already defined via a require config object
    s.baseUrl = cfg && cfg.baseUrl;
    if (isBrowser && (!s.baseUrl || !s.head)) {
        //Figure out baseUrl. Get it from the script tag with require.js in it.
        scripts = document.getElementsByTagName("script");
        if (cfg && cfg.baseUrlMatch) {
            rePkg = cfg.baseUrlMatch;
        } else {
                        rePkg = /(requireplugins-|require-)?jquery[\-\d\.]*(min)?\.js(\W|$)/i;
            
            
            
            
                    }

        for (i = scripts.length - 1; i > -1 && (script = scripts[i]); i--) {
            //Set the "head" where we can append children by
            //using the script's parent.
            if (!s.head) {
                s.head = script.parentNode;
            }
            //Using .src instead of getAttribute to get an absolute URL.
            //While using a relative URL will be fine for script tags, other
            //URLs used for text! resources that use XHR calls might benefit
            //from an absolute URL.
            src = script.src;
            if (src) {
                m = src.match(rePkg);
                if (m) {
                    s.baseUrl = src.substring(0, m.index);
                    break;
                }
            }
        }
    }

    
    //Set up default context. If require was a configuration object, use that as base config.
    if (cfg) {
        req(cfg);
    }
}());
