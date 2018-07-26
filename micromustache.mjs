
export function render(template, view = {}) {
    //don't touch the template if it is not a string
    if (typeof template !== 'string') {
        return template;
    }

    //if view is not a valid object, assume it is an empty object
    //which effectively removes all variable interpolations
    if (typeof view !== 'object' || view === null) {
        view = {};
    }

    return template.replace(/\{\{\s*(.*?)\s*\}\}/g, function (match, varName) {
        var path = varName.split('.');

        function resolve(currentScope, pathIndex) {
            if (currentScope === null) {
                return '';
            }

            var key = path[pathIndex];
            var value = currentScope[key];
            var typeofValue = typeof value;

            if (typeofValue === 'function') {
                //if the value is a function, call it passing the variable name
                return valueFnResultToString(
                    value.call(view, key, currentScope, path, pathIndex)
                );
            } else if (typeofValue === 'object') {
                pathIndex++;
                // If it's a leaf and still an object, just stringify it
                return pathIndex < path.length ?
                    resolve(value, pathIndex) :
                    valueFnResultToString(value);
            } else {
                return valueFnResultToString(value);
            }
        }

        return resolve(view, 0);
    });
}

export function compile(template) {
    return function compiler(view) {
        return render(template, view);
    };
}

function valueFnResultToString(value) {
    switch (typeof value) {
        case 'string':
        case 'number':
        case 'boolean':
            return value;
        case 'object':
            // null is an object but is falsy. Swallow null
            if (value === null) {
                return '';
            } else {
                // Convert the object to json without throwing
                try {
                    return JSON.stringify(value);
                } catch (jsonError) {
                    return '{...}';
                }
            }
            return value ? toJsonPolitely(value) : '';
        default:
            // Anything else will be replaced with an empty string
            // For example: undefined, Symbol, etc.
            return '';
    }
}
