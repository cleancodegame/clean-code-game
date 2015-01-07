var CodeSample = require("./CodeSample");

exports.testOffsets = function(test){
    var code = new CodeSample({code:"{{a}} {{b}}", bugs:{a: { name:'a'}, b: {name:'b'}} });
    var expectedA = {
        startIndex:0, 
        len:1, 
        start:  {line:0, ch:0}, 
        end:    {line:0, ch:0}, 
    };
    var expectedB = {
        startIndex:2,
        len:1, 
        start:  {line:0, ch:2}, 
        end:    {line:0, ch:2}, 
    };

    test.equal(code.text, "a b");
    test.deepEqual(code.bugs['a'].offsets, [expectedA]);
    test.deepEqual(code.bugs['b'].offsets, [expectedB]);
    test.done();
};

exports.testPos = function(test){
    var code = new CodeSample({code:"{{aa}}\n{{bb}}", bugs:{aa: { name:'aa'}, bb: {name:'bb'}} });
    var expectedA = {
        startIndex:0, 
        len:2, 
        start:  {line:0, ch:0}, 
        end:    {line:0, ch:1}, 
    };
    var expectedB = {
        startIndex:3,
        len:2, 
        start:  {line:1, ch:0}, 
        end:    {line:1, ch:1},
    };

    test.equal(code.text, "aa\nbb");
    test.deepEqual(code.bugs['aa'].offsets, [expectedA]);
    test.deepEqual(code.bugs['bb'].offsets, [expectedB]);
    test.done();
};
exports.testMultilinePos = function(test){
    var code = new CodeSample({code:"{{a\na}}\n{{b}}", bugs:{"a\na": { name:'a\na'}, b: {name:'b'}} });
    var expectedA = {
        startIndex:0, 
        len:3, 
        start:  {line:0, ch:0}, 
        end:    {line:1, ch:0}, 
    };
    var expectedB = {
        startIndex:4,
        len:1, 
        start:  {line:2, ch:0}, 
        end:    {line:2, ch:0},
    };

    test.equal(code.text, "a\na\nb");
    test.deepEqual(code.bugs['a\na'].offsets, [expectedA]);
    test.deepEqual(code.bugs['b'].offsets, [expectedB]);
    test.done();
};

exports.testMultilineOffsets = function(test){
    var code = new CodeSample({code:"{{a}} {{a}}", bugs:{"a": { name:'a'} }});
    var expectedA1 = {
        startIndex:0, 
        len:1, 
        start:  {line:0, ch:0}, 
        end:    {line:0, ch:0}, 
    };
    var expectedA2 = {
        startIndex:2,
        len:1, 
        start:  {line:0, ch:2}, 
        end:    {line:0, ch:2},
    };

    test.equal(code.text, "a a");
    test.deepEqual(code.bugs['a'].offsets, [expectedA1, expectedA2]);
    test.done();
};