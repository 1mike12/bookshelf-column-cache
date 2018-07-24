const ColumnCache = require("./ColumnCache");

module.exports = function(Bookshelf){
    Bookshelf.ColumnCache = new ColumnCache(Bookshelf);
};