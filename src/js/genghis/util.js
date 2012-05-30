Genghis.Util = {
    route: function(url) {
        return url.replace(Genghis.baseUrl, '').replace(/^\//, '');
    },

    parseQuery: function(str) {
        var params = {};

        if (str.length) {
            _.each(str.split('&'), function(val) {
                var chunks = val.split('='),
                    name   = chunks.shift();

                params[name] = chunks.join('=');
            });
        }

        return params;
    },

    buildQuery: function(params) {
        return _.map(params, function(val, name) { return name + '=' + val; }).join('&');
    },

    humanizeSize: function(bytes) {
        if (bytes ==- 0) return 'n/a';
        var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'],
            i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10);
        return ((i === 0)? (bytes / Math.pow(1024, i)) : (bytes / Math.pow(1024, i)).toFixed(1)) + ' ' + sizes[i];
    },

    humanizeCount: function(count) {
        var suffix = '';
        count = count || 0;

        if (count > 1000) {
            count  = Math.floor(count / 1000);
            suffix = ' k';
        }

        if (count > 1000) {
            count  = Math.floor(count / 1000);
            suffix = ' M';
        }

        if (count > 1000) {
            return '...';
        }

        return count + suffix;
    },

    escape: function(str) {
        if (str) {
            return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
        }
    },

    formatJSON: function(value) {
        function htmlEncode(t) {
            return t !== null ? t.toString().replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;") : '';
        }

        function wrap(value, className, raw) {
            return '<span class="' + className + '">' + (raw ? value : htmlEncode(value)) + '</span>';
        }

        function valueToHTML(value) {
            var valueType = typeof value,
                output = [];
            if (value === null) {
                output.push(wrap('null', 'null'));
            } else if (value && value.constructor == Array) {
                output.push(arrayToHTML(value));
            } else if (valueType == 'object') {
                output.push(objectToHTML(value));
            } else if (valueType == 'number') {
                output.push(wrap(value, 'num'));
            } else if (valueType == 'string') {
                var valueHTML = wrap(value, 'value');
                if (/^https?:\/\/[^\s]+$/.test(value)) {
                    valueHTML = '<a href="' + value + '">' + valueHTML + '</a>';
                }
                output.push(wrap('"' + valueHTML + '"', 'string', true));
            } else if (valueType == 'boolean') {
                output.push(wrap(value, 'bool'));
            }

            return output.join('');
        }

        function arrayToHTML(json) {
            var output = _.map(json, function(value) { return '<li>' + valueToHTML(value) + '</li>'; });
            return output.length ? '[<ul class="array">' + output.join('') + '</ul>]' : '[ ]';
        }

        function objectToHTML(json) {
            var isRef     = (_.detect(json, function(v, p) { return _.include(['$id', '_id'], p); }) && _.detect(json, function(v, p) { return (p === '$ref'); })),
                className = 'obj' + (isRef ? ' db-ref' : ''),
                output    = _.map(json, function(value, prop) {
                    var isRefProp = (isRef && _.include(['$ref', '$id', '_id', '$db'], prop));
                    return '<li' + (isRefProp ? (' class="db-ref-' + prop.substring(1) + '"') : '') + '>' + wrap(prop, 'prop') + valueToHTML(value) + '</li>';
                });
            return output.length ? '{<ul class="' + className + '">' + output.join('') + '</ul>}' : '{ }';
        }

        return valueToHTML(value);
    }
};
