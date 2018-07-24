const db = require("../database");

before(async () =>{
    await db.latestMigrations();
});

describe("plugin", function(){

    it("ColumnCache should be available on Bookshelf object", async () =>{
        let ColumnCache = db.bookshelf.ColumnCache;
        expect(ColumnCache).to.not.be.undefined;
    });

    it("ColumnCache should work", async () =>{
        let ColumnCache = db.bookshelf.ColumnCache;
        let columns = await ColumnCache.getColumnsForTable("users");
        expect(Array.from(columns).length).equal(2);
    });
});