class ColumnCache {

    constructor(Bookshelf){
        this.bookshelf = Bookshelf;
        this.tablesQueried = new Set();
        this.tableName_Resolvables = new Map();
        this.tableName_Set = new Map();
    }

    /**
     *
     * @param tableName
     * @return {Promise<Set>} set of column strings
     */
    async getColumnsForTable(tableName){

        //already cached
        if (this.tableName_Set.get(tableName)){
            return this.tableName_Set.get(tableName);
        }

        const knex = this.bookshelf.knex;
        if (!this.tablesQueried.has(tableName)){
            this.tablesQueried.add(tableName);
            this.tableName_Resolvables.set(tableName, []);

            let columnsObject = await knex(tableName).columnInfo();

            let columnsSet = new Set();
            for (let key in columnsObject) {
                if (columnsObject.hasOwnProperty(key)) columnsSet.add(key)
            }
            this.tableName_Set.set(tableName, columnsSet);

            //resolve all waiting
            let resolvables = this.tableName_Resolvables.get(tableName);
            if (resolvables && resolvables.length > 0){
                for (let i = 0; i < resolvables.length; i++) {
                    let resolve = resolvables[i];
                    resolve(columnsSet);
                }
                this.tableName_Resolvables.delete(tableName);
            }
            //clean up
            this.tablesQueried.delete(tableName);
            return columnsSet;
        }
        //second to nth time getting table names. queue up promises to resolve for future
        else if (!this.tableName_Set.get(tableName)){
            const promise = new Promise((resolve, rej) =>{
                this.tableName_Resolvables.get(tableName).push(resolve)
            });
            return promise;
        }
    }
}

module.exports = ColumnCache;