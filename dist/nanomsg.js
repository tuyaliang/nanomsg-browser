"use strict";function _classCallCheck(e,n){if(!(e instanceof n))throw new TypeError("Cannot call a class as a function")}var _createClass=function(){function e(e,n){for(var o=0;o<n.length;o++){var t=n[o];t.enumerable=t.enumerable||!1,t.configurable=!0,"value"in t&&(t.writable=!0),Object.defineProperty(e,t.key,t)}}return function(n,o,t){return o&&e(n.prototype,o),t&&e(n,t),n}}(),nanomsg={debug:!1,reconnectTime:1e3,receiveArrayBuffer:!1,REQ:"rep.sp.nanomsg.org",PAIR:"pair.sp.nanomsg.org",SUB:"pub.sp.nanomsg.org"};nanomsg.Socket=function(){function e(n){_classCallCheck(this,e),this.protocol=n,this.wss=new Map,this.reqIdHeader=null,this.promise=null,this.cbs={data:[],end:[],error:[]},this.protocol==nanomsg.REQ&&(this.reqIdHeader=new Uint8Array(4),window.crypto.getRandomValues(this.reqIdHeader),this.reqIdHeader[0]|=128)}return _createClass(e,[{key:"connect",value:function(e){var n=this;if(!this.wss.has(e))return new Promise(function(o,t){nanomsg.debug&&console.log("nanomsg connect to: "+e);!function t(){try{n.__setupSocketConnection(e,o)}catch(o){console.log(o),n.wss.delete(e),setTimeout(t,nanomsg.reconnectTime)}}()})}},{key:"__setupSocketConnection",value:function(e,n){var o=this,t=new WebSocket(e,[this.protocol]);t.initialUrl=e,nanomsg.receiveArrayBuffer&&(t.binaryType="arraybuffer"),this.wss.set(e,t),t.onopen=function(){nanomsg.debug&&console.log("nanomsg connected: "+e),n()},t.onmessage=function(e){var n=null;if(n=o.protocol==nanomsg.REQ?e.data.slice(4):e.data,nanomsg.receiveArrayBuffer)o.__resolveNewData(n);else{var t=new FileReader;t.onload=function(e){o.__resolveNewData(e.target.result)},t.readAsText(n)}},t.onerror=function(e){nanomsg.debug&&console.log("nanomsg error",e),o.cbs.error.forEach(function(n){return n(e)})},t.onclose=function(){nanomsg.debug&&console.log("nanomsg close: "+t.initialUrl),o.wss.has(t.initialUrl)&&(nanomsg.debug&&console.log("nanomsg reconnect: "+t.initialUrl),o.wss.delete(t.initialUrl),o.connect(t.initialUrl)),o.cbs.end.forEach(function(e){return e(t.initialUrl)})}}},{key:"__resolveNewData",value:function(e){e&&(this.promise&&(this.promise.resolve(e),this.promise=null),this.cbs.data.forEach(function(n){return n(e)}))}},{key:"disconnect",value:function(e){var n=this.wss.get(e);n&&(this.wss.delete(e),n.close())}},{key:"bind",value:function(){throw new Error("WHOAAAA!!! Nice try, but NO, we do not support these!")}},{key:"on",value:function(e,n){var o=this.cbs[e];o&&o.push(n)}},{key:"send",value:function(e){var n=this;if(this.protocol===nanomsg.SUB)throw new Exception("SUB socket can not send");if(this.wss.size<1)throw new Exception("you are not connected to any socket");if(this.protocol===nanomsg.REQ){var o=e.length||e.byteLength,t=new Uint8Array(o+4);if(t.set(this.reqIdHeader,0),"string"==typeof e||e instanceof String)for(var s=4;s<e.length+4;++s)t[s]=e.charCodeAt(s-4);else t.set(e,4);e=t}nanomsg.debug&&console.log("nanomsg send =>",e);var r=!0,a=!1,i=void 0;try{for(var c,l=this.wss.values()[Symbol.iterator]();!(r=(c=l.next()).done);r=!0){var u=c.value;1===u.readyState?u.send(e):u.readyState>1&&(this.wss.has(u.url)&&this.wss.delete(u.url),nanomsg.debug&&console.log("nanomsg: could not send, because of closed connection ("+u.url+")"))}}catch(e){a=!0,i=e}finally{try{!r&&l.return&&l.return()}finally{if(a)throw i}}if(this.protocol===nanomsg.REQ||this.protocol===nanomsg.PAIR)return new Promise(function(e,o){n.promise={resolve:e,reject:o}})}}]),e}();