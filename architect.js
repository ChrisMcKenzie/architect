var Architect;

module.exports = Architect = (function(){
  var _print, 
      _supported_versions, 
      _tokens, 
      _parseContent, 
      _parseElement,
      _parseResource;

  // For the sake of cleanlyness for a first version this
  // only supports Version: 3.0 of the API Blueprint AST spec
  // TODO(ChrisMcKenzie): Support MOAR spec versions
  _supported_versions = ['3.0']
  _tokens = {
    heading: {
      1:'\n#',
      2:'\n##',
      3:'\n###',
      4:'\n####'
    }
  }

  var Architect = {};

  _print = function(){
    return [].join.call(arguments, ' ');
  }

  _wrap = function(w, v){
    frame = w.split('');
    frame.splice(1,0,v);
    return frame.join('');
  }

  _parseResource = function(res, depth) {
    buffer = _tokens.heading[1 + (depth || 0)];
    // header section:
    if(res.uriTemplate != '') {
      buffer = _print(
        buffer,
        res.name !== '' ? res.name : '\b',
        res.name !== '' ?
          _wrap('[]', res.uriTemplate)
            : res.uriTemplate
      )
    }
    // body section:
    res.actions.forEach(function(action){
      // Heading
      buffer = _print(
        buffer, 
        '\n',
        _tokens.heading[2+(depth || 0)],
        action.method !== '' ? action.method : '\b',
        '\n'
      );

      // Examples
      action.examples.forEach(function(example){
        example.responses.forEach(function(response){
          // Response Heading
          buffer = _print(
            buffer,
            '+',
            'Response',
            response.name,
            _wrap('()', response.headers[0].value),
            '\n\t',
            response.description
          );
        })
      })
    })

    return buffer;
  }

  _parseElement = function(el) {
    switch(el.element){
      case 'category':
        buffer = _parseContent(el.content);
        break;
      case 'resource':
        buffer = _parseResource(el)
        break;
    }

    return buffer
  }

  _parseContent = function(content){
    if(Array.isArray(content)){
      var buffer = [];
      content.forEach(function(element){
        buffer.push(_parseElement(element));
      });
      buffer = buffer.join('\n');
    } else if(typeof content == 'string') {
      buffer = _print(content);
    } else if(typeof content == 'object') {
      buffer = this._parseElement(content);
    }

    return buffer
  }

  _parseBlueprint = function(ast){
    var buffer = [];
    // Write Metadata Section:
    // [Details](https://github.com/apiaryio/api-blueprint/blob/master/API%20Blueprint%20Specification.md#8-metadata-section)
    if(ast.hasOwnProperty('metadata')){
      for(var i = 0; i < ast.metadata.length; i++){
        var item = ast.metadata[i];
        if(item.name && item.value) {
          buffer.push(_print(item.name + ':', item.value));
        }
      }
    }

    if(ast.name) {
      buffer.push(_print(_tokens.heading[1], ast.name));
    }

    if(ast.description){
      buffer.push(_print(ast.description))
    }

    if(ast.content){
      buffer.push(_parseContent(ast.content))
    }

    return buffer.join('\n')
  }

  Architect.parse = function(input) {
    ast = input.ast;
    if(_supported_versions.indexOf(ast._version) <= -1){
      throw new Error('Architect does not support version ' + ast._version +  ' of Api Blueprint AST');
    }

    return _parseBlueprint(ast);
  }

  return Architect;
})()

