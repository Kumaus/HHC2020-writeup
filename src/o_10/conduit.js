const __WETTY_OUTPUT_FILTER__ = /#{5}hhc:(.*)#{5}/mi;

/* 
  expects `data` to be a plain object
  with the following attributes (at least):
  - resourceId (same as the one initially passed)
  - hash (hmac)

  this object will be passed to the client if the
  challenge is loaded in an iframe, and will be 
  dumped in the console.
  
*/
const __POST_RESULTS__ = data => {
  const payload = {
    type: 'challengeResult',
    ...data,
  };
  
  const issues = [
    'resourceId',
    'hash',
  ].filter(attr => typeof payload[attr] === 'undefined');

  if (issues.length) {
    console.group(`rutroh`);
    console.warn(`Check the payload! This is missing: ${['', ...issues].join('\n- ')}`);
    console.groupEnd(`rutroh`);
  }
  
  if (window.self === window.top) {
    // not running in an iframe... output to console
    console.group(`hhc-challenge`);
    console.table(payload);
    console.groupEnd(`hhc-challenge`);
  } else {
    if (issues.length) {
      console.error(`Did not post due to missing stuff. Check up here ^^^ for details.`);
    } else {
      window.top.postMessage(payload, '*');
    }
  }
};

const __SEND_MSG__ = data => { 
  const issues = [
    'type',
  ].filter(attr => typeof data[attr] === 'undefined');

  if (issues.length) {
    console.group(`rutroh`);
    console.warn(`Check the payload! This is missing: ${['', ...issues].join('\n- ')}`);
    console.groupEnd(`rutroh`);
  }
  
  if (window.self === window.top) {
    // not running in an iframe... output to console
    console.group(`hhc-challenge`);
    console.table(data);
    console.groupEnd(`hhc-challenge`);
  } else {
    if (issues.length) {
      console.error(`Did not post due to missing stuff. Check up here ^^^ for details.`);
    } else {
      window.top.postMessage(data, '*');
    }
  }
};


const __WETTY_EVAL_OUTPUT__ = output => {
  if (!__WETTY_OUTPUT_FILTER__.test(output)) return false;
  try {
    const postedMsg = __WETTY_OUTPUT_FILTER__.exec(output)[1];
    const parsedMsg = JSON.parse(postedMsg);
    return parsedMsg;
  } catch(err) {
    console.group(`rutroh`);
    console.warn(`Check the payload! This is missing: ${['', ...issues].join('\n- ')}`);
    console.groupEnd(`rutroh`);
    return false;
  }
  return true;
};

const __PARSE_URL_VARS__ = () => {
  let vars = {};
  var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
      vars[key] = value;
  });
  return vars;
}