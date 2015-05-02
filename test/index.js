var assert = require('assert');
var path = require('path');
var architect = require('../architect');
var exampleAST = require('./exampleAST.json');
var exampleMD = require('fs').readFileSync(path.join(__dirname, 'example.md')).toString();

describe('Parse', function(){
  var scenarios = [
    {
      field: 'metadata', 
      ast: {
        _version: '3.0',
        metadata: [
          {
            name: 'FORMAT',
            value: '1A'
          },{
            name: 'HOST',
            value: 'http://api.example.com'
          }
        ]
      },
      markdown: 'FORMAT: 1A\nHOST: http://api.example.com'
    }, {
      field: 'name',
      ast: {
        _version: '3.0',
        name: 'Example API'
      }, 
      markdown: '\n# Example API'
    }, {
      field: 'description',
      ast: {
        _version: '3.0',
        name: 'Example API',
        description: 'A super cool API for examples and junk'
      },
      markdown: '\n# Example API\nA super cool API for examples and junk'
    }, {
      field: 'content',
      ast: exampleAST.ast,
      markdown: exampleMD 
    }
  ];

  describe('#_version', function(){
    it('should fail on any version but 3.0 (for now)', 
       function(){
         assert.throws(
           function(){
             architect.parse({
               ast: {
                 _version: '2.0'
               }
             });
           },
           Error,
           'Architect currently supports Version 3.0 of Api Blueprint AST'
         );
      });

    it('should not fail on version 3.0', function(){
      assert.doesNotThrow(function(){
        architect.parse({
          ast: {
            _version: '3.0'
          }
        });
      }, 'Architect currently supports Version 3.0 of Api Blueprint AST');
    })
  });
  describe('#fields', function(){
    scenarios.forEach(function(test){
      it('should parse ast and contain given ' + test.field + ' field', function(){
        assert.equal(architect.parse(test), test.markdown);
      })
    })
  });
});
