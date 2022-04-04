export const valid = [
    "<foobar />",
    "<foo bar />",
    '<foo bar=" " />',
    "<foo bar= />",
    "<foo bar= foobar />",
    '<foo bar="foobar" />',
    "<foo>text</foo>",
    '<bar foo="bar"> </bar>',
  ];
  
  export const invalid = ['<"', "<0>", "<foo 0foo />", "<<"];
  
  export const split: Array<[string, Array<string>]> = [
    ["<foobar />", ["<foobar", " />"]],
    ["<foo bar />", ["<foo", " bar />"]],
    ['<foo bar="foobar" />', ['<foo ','bar','=','"foobar"',' />']], 
    ["<foo>text</foo>", ['<foo','>text','<','/foo','>']],
    ["<foo bar= foobar />", ["<foo bar="," ","foobar"," />"]],
  ];
  