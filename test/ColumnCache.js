global.mocha = require('mocha');
global.chai = mocha.chai;
global.expect = require("chai").expect;
process.env.NODE_ENV = "test";

const db = require("../test_helpers/database");
const ColumnCache = require("../ColumnCache");

before(async () =>{
    await db.latestMigrations();
});

after(()=> {
    process.exit(0)
});

describe("ColumnCache", function(){


    it("should get columns", async () =>{
        let cc = new ColumnCache(db.bookshelf);
        let columns = await cc.getColumnsForTable("users");
        expect(Array.from(columns).length).equal(2)
    });

    it ("should not query the database multiple times", async ()=> {
        let cc = new ColumnCache(db.bookshelf);

        let promises = [];
        for (let i = 0; i < 25; i ++){
            promises.push(cc.getColumnsForTable("users"))
        }
        await Promise.all(promises);
        //examine queries in log to make sure there's not 25 info queries.
    });
});