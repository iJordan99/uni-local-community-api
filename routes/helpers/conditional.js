const etag = require('etag');

const checkHeaders = (ctx,updated,Etag) => {
  let is304 = false;
  const modified= Date.parse(updated);
  const {['if-none-match']: if_none_match} = ctx.headers;
  const {['if-modified-since']:if_modified_since} = ctx.headers;

  if(if_none_match === Etag){
    is304 = true;
  }

  if(modified < Date.parse(if_modified_since)){
    is304 = true;
  }
  
  return is304;
}

module.exports.checkHeaders = checkHeaders;