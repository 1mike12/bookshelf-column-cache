class ColumnCache {

    constructor(Bookshelf) {
        this.bookshelf = Bookshelf;
        this.tableName_Set = {};
        this.tableName_Promise = {};
    }

    /**
     *
     * @param tableName
     * @return {Promise<Set>} set of column strings
     */
    async getColumnsForTable(tableName) {
        //1st try to get the cached data
        let set = this.tableName_Set[tableName];
        if (set) return set;

        //2 try to return ongoing promise
        let promise = this.tableName_Promise[tableName];
        if (this.tableName_Promise[tableName]) return promise;

        //3 query the database for column info and return the promise
        const knex = this.bookshelf.knex;
        promise = knex(tableName).columnInfo()
            .then(columnsObject => {
                let columnsSet = new Set();
                for (let key in columnsObject) {
                    if (columnsObject.hasOwnProperty(key)) columnsSet.add(key)
                }
                this.tableName_Set[tableName] = columnsSet;
                return columnsSet;
            });

        this.tableName_Promise[tableName] = promise;
        return promise;
    }
}

module.exports = ColumnCache;