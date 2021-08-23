//Unpacker for serialized js

var P_A_C_K_E_R = {
    detect: function(str) {
      return (P_A_C_K_E_R.get_chunks(str).length > 0);
    },
  
    get_chunks: function(str) {
      var chunks = str.match(/eval\(\(?function\(.*?(,0,\{\}\)\)|split\('\|'\)\)\))($|\n)/g);
      return chunks ? chunks : [];
    },
  
    unpack: function(str) {
      var chunks = P_A_C_K_E_R.get_chunks(str),
        chunk;
      for (var i = 0; i < chunks.length; i++) {
        chunk = chunks[i].replace(/\n$/, '');
        str = str.split(chunk).join(P_A_C_K_E_R.unpack_chunk(chunk));
      }
      return str;
    },
  
    unpack_chunk: function(str) {
      var unpacked_source = '';
      var __eval = eval;
      if (P_A_C_K_E_R.detect(str)) {
        try {
          eval = function(s) { // jshint ignore:line
            unpacked_source += s;
            return unpacked_source;
          }; // jshint ignore:line
          __eval(str);
          if (typeof unpacked_source === 'string' && unpacked_source) {
            str = unpacked_source;
          }
        } catch (e) {
          // well, it failed. we'll just return the original, instead of crashing on user.
        }
      }
      eval = __eval; // jshint ignore:line
      return str;
    }
  
  
  }

exports.P_A_C_K_E_R = P_A_C_K_E_R