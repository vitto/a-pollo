var app = require('../app');
var colors = require('colors/safe');

describe("Run process", function() {
    it("gives error if I run it without the default configuration file", function() {
        console.log = jasmine.createSpy("log");
        app.runProcess([], "not_exists.apollo.yml");
        expect(console.log).toHaveBeenCalledWith('ERROR: '.red + 'file ' + 'not_exists.apollo.yml'.red + ' not found, please run ' + 'a-pollo init'.yellow + ' or ' + './node_modules/.bin/a-pollo init'.yellow + ' to create one.');
    });

    it("gives error if I run it without a custom configuration file", function() {
        console.log = jasmine.createSpy("log");
        app.runProcess(['node', 'index.js', 'config=custom.yml'], "apollo.yml");
        expect(console.log).toHaveBeenCalledWith('ERROR: '.red + 'file ' + 'custom.yml'.red + ' not found, please run ' + 'a-pollo init'.yellow + ' or ' + './node_modules/.bin/a-pollo init'.yellow + ' to create one.');
    });

});

describe("Init process", function() {
    it("is called with command 'init'", function() {
        console.log = jasmine.createSpy("log");
        app.runProcess(['node', 'index.js', 'init'], "apollo.yml");
        expect(console.log).toHaveBeenCalledWith('This process will help you to generate the config ' + colors.bgBlack(colors.green(' a-pollo.yml ')) + ' file into your project.');
    });
});
