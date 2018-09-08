module.exports = function () {
    const buildRegex = (startsWithArray) => {
        const string = startsWithArray.join('|^\\');
        return `(^\\${string})`;
    };
    return function (style) {
        style.define('variableConfig', function (path) {
            const variableGuide = require('./../../site/pages/variables/guide.json');
            const startsWithArray = variableGuide.map(v => v.startsWith);
            const regexFind = buildRegex(startsWithArray);
            return regexFind;
        });
    };
}
