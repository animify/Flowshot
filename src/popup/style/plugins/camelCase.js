module.exports = function () {
    return function (style) {
        style.define('camelCase', function (word) {
            const w = word.string;
            return w.charAt(0).toUpperCase() + w.slice(1);
        });
    };
}
