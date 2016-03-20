var parser = require('../lib/parser');

var completeDocumentationExample =
    '/*@pollo' + "\n" +
    '@name:  Social button' + "\n" +
    '@auth:  [Vittorio Vittori](http://vit.to)' + "\n" +
    '@category:  Buttons' + "\n" +
    '@date:  2015-12-01' + "\n" +
    '@text:  This should be used to connect social accounts to the project service.' + "\n" +
    '        It requires Font Awesome http://fontawesome.github.io to be loaded as dependency.' + "\n" +
    '        The code above will show the Facebook version.' + "\n" +
    '@html:  <a href="#" class="button-social button-social--facebook">' + "\n" +
    '            <div class="button-social__icon">' + "\n" +
    '                <i class="fa fa-facebook"></i>' + "\n" +
    '            </div>' + "\n" +
    '            <div class="button-social__network">' + "\n" +
    '                facebook' + "\n" +
    '            </div>' + "\n" +
    '        </a>' + "\n" +
    '*/';

describe("CSS comment parser", function() {
    it("ignores css without documentation", function() {
        var result = parser.format("h1{ font-size: 20px}", "style.css");
        expect(result).toEqual([]);
    });
    it("returns a list of widgets data", function() {
        var result = parser.format(completeDocumentationExample, "style.css");
        expect(result.length).toEqual(1);
    });
    it("parses name", function() {
        var result = parser.format(completeDocumentationExample, "style.css");
        var widget = result[0];
        expect(widget.name).toEqual("Social button");
    });
    it("parses date", function() {
        var result = parser.format(completeDocumentationExample, "style.css");
        var widget = result[0];
        expect(widget.date).toEqual("2015-12-01");
    });
    it("parses category", function() {
        var result = parser.format(completeDocumentationExample, "style.css");
        var widget = result[0];
        expect(widget.category).toEqual("Buttons");
    });
    it("parses multiple lines of text", function() {
        var result = parser.format(completeDocumentationExample, "style.css");
        var widget = result[0];
        expect(widget.text).toEqual("This should be used to connect social accounts to the project service.\n It requires Font Awesome http://fontawesome.github.io to be loaded as dependency.\n The code above will show the Facebook version.");
    });

});
