var app = require('../app');

describe("Run process", function() {
  it("gives error if I run it without apollo.yml", function() {
    console.log = jasmine.createSpy("log");
    app.runProcess("not_exists.apollo.yml");
    expect(console.log).toHaveBeenCalledWith('ERROR: '.red + 'file ' + 'not_exists.apollo.yml'.red + ' not found, please run ' + 'a-pollo init'.yellow + ' or ' + './node_modules/.bin/a-pollo init'.yellow + ' to create one.');
  });
});
