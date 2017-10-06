import XMapperService from '../../src/XMapperService'
import chai from 'chai'
var {should,expect,equal,be,an,throws} = chai;
var {ResponseTypes} = XMapperService
describe('query', function() {
  /*it('should return text value for xpath search',done => {
    var test = '<?xml version="1.0"?><foo>1</foo>'
    var res = XMapperService.query(test,"/foo/text()")
    expect(res).to.equal('1')
    done()
  })
  it('should return number for xpath search',done => {
    var test = '<?xml version="1.0"?><foo>1</foo>'
    var res = XMapperService.query(test,"/foo",ResponseTypes.NUMBER)
    expect(res).to.equal(1)
    done()
  })
  it('should return attribute value for xpath search',done => {
    var test = '<?xml version="1.0"?><foo bar="1"/>'
    var res = XMapperService.query(test,"/foo/@bar")
    expect(res).to.equal('1')
    done()
  })
    it('should return first if multiple results for query',done => {
    var test = '<?xml version="1.0"?><foo>1</foo><foo>2</foo>'
    var res = XMapperService.query(test,"/foo")
    expect(res).to.equal('1')
    done()
  })
  it('should return null if no results for query',done => {
    var test = '<?xml version="1.0"?>'
    var res = XMapperService.query(test,"/foo/text()")
    expect(res).to.equal(null)
    done()
  })
  it('should handle advanced xpath',done => {
      var test = '<?xml version="1.0"?><foo><id>1</id><name>bar</name></foo><foo><id>2</id><name>baz</name></foo>'
    var res = XMapperService.query(test,'/foo[id=2]/name')
    expect(res).to.equal('baz')
    done()
  })
    it('should handle advanced xpath - contains',done => {
      var test = '<?xml version="1.0"?><foo><id>1</id><name>bar</name></foo><foo><id>2</id><name>baz</name></foo>'
    var res = XMapperService.query(test,'/foo[contains(name,"baz")]/name')
    expect(res).to.deep.equal('baz')
    done()
  })
  it('should handle Json ',done => {
      var test = {foo:[{id:1,name:"bar"},{id:2,name:"baz"}]}
    var res = XMapperService.query(test,'/foo[id="2"]/name')
    expect(res).to.equal('baz')
    done()
  })
  it('should return xml if type is xml',done => {
    var test = '<?xml version="1.0"?><foo><bar id="1">baz</bar></foo>'
    var res = XMapperService.query(test,"/foo/bar",ResponseTypes.XML)
    expect(res).to.be.an('object')
    expect(res.toString()).to.equal('<bar id="1">baz</bar>')
    done()
  })
  it('should return xml with multiple results ',done => {
    var test = '<?xml version="1.0"?><foo><bar id="1">baz</bar><bar id="2">baz2</bar></foo>'
    var res = XMapperService.query(test,"/foo/bar",ResponseTypes.XML)
    expect(res).to.be.an('object')
    expect(res.toString()).to.equal('<bar id="1">baz</bar><bar id="2">baz2</bar>')
    done()
  })
  it('should return xml with single result',done => {
    var test = '<?xml version="1.0"?><foo><bar id="1">baz</bar></foo>'
    var res = XMapperService.query(test,"/foo/bar/text()",ResponseTypes.XML)
    expect(res).to.be.an('object').that.has.property('childNodes').which.has.lengthOf(1)
    expect(XMapperService.xmlToJson(res)).to.equal("baz")
    done()
  })
  it('should return json if type is json',done => {
    var test = '<?xml version="1.0"?><foo><id>1</id><name>bar</name></foo>'
    var res = XMapperService.query(test,"/foo",ResponseTypes.JSON)
    expect(res).to.deep.equal({foo:{id:"1",name:"bar"}})
    done()
  })
  it('should return json object with array when multiple results',done => {
    var test = '<?xml version="1.0"?><foo><id>1</id><name>bar</name></foo><foo><id>2</id><named>baz</named></foo>'
    var res = XMapperService.query(test,"/foo/id",ResponseTypes.JSON)
    expect(res).to.deep.equal({id:["1","2"]})
    done()
  })
  it('should return json object with string when only one result',done => {
    var test = '<?xml version="1.0"?><foo><id>1</id><name>bar</name></foo>'
    var res = XMapperService.query(test,"/foo/id",ResponseTypes.JSON)
    expect(res).to.deep.equal({id:"1"})
    done()
  })
  it('should handle count',done => {
    var test = '<?xml version="1.0"?><foo>1</foo><foo>9</foo>'
    var res = XMapperService.query(test,"count(/foo/text())",ResponseTypes.NUMBER)
    expect(res).to.deep.equal(2)
    done()
  })
  it('should handle sum',done => {
    var test = '<?xml version="1.0"?><foo>1</foo><foo>9</foo>'
    var res = XMapperService.query(test,"sum(/foo/text())",ResponseTypes.NUMBER)
    expect(res).to.deep.equal(10)
    done()
  })
  it('should handle min',done => {
    var test = '<?xml version="1.0"?><foo>1</foo><foo>9</foo>'
    XMapperService.parseQuery("/foo")
    var res = XMapperService.query(test,"min(/foo/text())",ResponseTypes.NUMBER)
    expect(res).to.equal(1)
    done()
  })
  it('should handle max',done => {
    var test = '<?xml version="1.0"?><foo>1</foo><foo>9</foo>'
    XMapperService.parseQuery("/foo")
    var res = XMapperService.query(test,"max(/foo/text())",ResponseTypes.NUMBER)
    expect(res).to.equal(9)
    done()
  })
  it('should handle avg',done => {
    var test = '<?xml version="1.0"?><foo>1</foo><foo>9</foo><foo>20</foo>'
    XMapperService.parseQuery("/foo")
    var res = XMapperService.query(test,"avg(/foo/text())",ResponseTypes.NUMBER)
    expect(res).to.equal(10) 
    done()
  })
  it('should handle ceiling',done => {
    var test = '<?xml version="1.0"?><foo>1.3</foo>'
    XMapperService.parseQuery("/foo")
    var res = XMapperService.query(test,"ceiling(/foo/text())",ResponseTypes.NUMBER)
    expect(res).to.equal(2)
    done()
  })
  it('should handle floor',done => {
    var test = '<?xml version="1.0"?><foo>1.7</foo>'
    XMapperService.parseQuery("/foo")
    var res = XMapperService.query(test,"floor(/foo/text())",ResponseTypes.NUMBER)
    expect(res).to.equal(1)
    done()
  })
  it('should handle round',done => {
    var test = '<?xml version="1.0"?><foo>1.7</foo>'
    XMapperService.parseQuery("/foo")
    var res = XMapperService.query(test,"round(/foo/text())",ResponseTypes.NUMBER)
    expect(res).to.equal(2)
    done()
  })
  it('should handle normalize-space',done => {
    var test = '<?xml version="1.0"?><foo>\n 1.7 </foo>'
    XMapperService.parseQuery("/foo")
    var res = XMapperService.query(test,"normalize-space(/foo/text())")
    expect(res).to.equal('1.7')
    done()
  })
  it('should handle boolean',done => {
    var test = '<?xml version="1.0"?><foo>Any VALUE</foo><bar></bar>'
    XMapperService.parseQuery("/foo")
    var res = XMapperService.query(test,"boolean(/foo/text())",ResponseTypes.BOOLEAN)
    expect(res).to.equal(true)
    var res2 = XMapperService.query(test,"boolean(/bar/text())",ResponseTypes.BOOLEAN)
    expect(res2).to.equal(false)
    done()
  })
  it('should handle boolean not',done => {
    var test = '<?xml version="1.0"?><foo>Any VALUE</foo><bar></bar>'
    XMapperService.parseQuery("/foo")
    var res = XMapperService.query(test,"not(boolean(/foo/text()))",ResponseTypes.BOOLEAN)
    expect(res).to.equal(false)
    var res2 = XMapperService.query(test,"not(boolean(/bar/text()))",ResponseTypes.BOOLEAN)
    expect(res2).to.equal(true)
    done()
  })
  it('should run query against each element if json array',done => {
    var test = [{id:1,name:"foo",email:"foo@email.com"},{id:2,name:"bar",email:"bar@email.com"},{id:3,name:"baz",email:"baz@email.com"}]
    var expr = XMapperService.parseQuery("/*[self::name or self::email]")
    var res = XMapperService.query(test,expr,ResponseTypes.JSON)
    expect(res).to.deep.equal([{name:"foo",email:"foo@email.com"},{name:"bar",email:"bar@email.com"},{name:"baz",email:"baz@email.com"}])
    done()
  })
  it('should not return elements that returned null from json array',done => {
    var test = [{id:1,name:"foo",email:"foo@email.com"},{id:2,name:"bar",email:"bar@email.com"},{id:3,name:"baz",email:"baz@email.com"}]
    var expr = XMapperService.parseQuery('/*[text() = "foo"]')
    var res = XMapperService.query(test,expr,ResponseTypes.JSON)
    expect(res).to.deep.equal([{name:"foo"}])
    done()
  })
  it('should return null if all elements returned null from json array',done => {
    var test = [{id:1,name:"foo",email:"foo@email.com"},{id:2,name:"bar",email:"bar@email.com"},{id:3,name:"baz",email:"baz@email.com"}]
    var expr = XMapperService.parseQuery('/*[text() = "asdf"]')
    var res = XMapperService.query(test,expr,ResponseTypes.JSON)
    expect(res).to.equal(null)
    done()
  })
  it('should trace result objects',done => {
    var test = '<?xml version="1.0"?><foo><id>1</id><name>bar</name></foo>'
    var res = XMapperService.query(test,"/foo",ResponseTypes.JSON,{},true)
    expect(XMapperService.traces).to.deep.equal([{trace:true,path:['foo']}])
    done()
  })
  it('should trace result object with array value',done => {
    var test = '<?xml version="1.0"?><foo><id>1</id><name>bar</name></foo><foo><id>2</id><name>baz</name></foo>'
    var res = XMapperService.query(test,"/foo[id=1]",ResponseTypes.JSON,{},true)
    expect(XMapperService.traces).to.deep.equal([{trace:true,path:[0,'foo']}])
    done()
  })*/
});


