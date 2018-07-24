const db = require("./database");
const ColumnCache = require("../ColumnCache");

before(async () =>{
    await db.latestMigrations();
});

describe("column cache", function(){


    it("should strip away model's attributes not on the database", async () =>{
        let cc = new ColumnCache(db.bookshelf);
        let columns = await cc.getColumnsForTable("users");
        expect(Array.from(columns).length).equal(2)
    })

    it ("should not query the database multiple times", async ()=> {
        let cc = new ColumnCache(db.bookshelf);

        let promises = [];
        for (let i = 0; i < 25; i ++){
            promises.push(cc.getColumnsForTable("users"))
        }
        await Promise.all(promises);
        //examine queries in log to make sure there's not 25 info queries.
    })

});