const Utils = { 
    "byteLengthToString": function(len) {
        if (len < 1024) {
            return len;
        }
        if (len < 1024*1024) {
            return `${Math.round(len/1024 * 100) / 100}K`
        }
        if (len < 1024*1024*1024) {
            return `${Math.round(len/1024/1024 * 100) / 100}M`
        }
       
        return `${Math.round(len/(1024*1024*1024) * 100) / 100}G`
        
    }
}
export default Utils