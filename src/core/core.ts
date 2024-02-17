function helper() {
    async function insert(fastify: any, table: any, column: any[], value: any[]) {
        try {
            if (column.length !== value.length) {
                throw new Error("Number of column and value should be the same.");
            }

            const columnString = column.join(', ');
            const valuePlaceholders = value.map((_, index) => `$${index + 1}`).join(', ');

            const result = await fastify.pg.query(`INSERT INTO "${table}" (${columnString}) VALUES (${valuePlaceholders})`, value);

            return result;
        } catch (error: any) {
            throw new Error(`Error in post function: ${error.message}`);
        }
    };

    async function select(fastify: any, table: string, columns: any[], whereColumn?: string, whereValue?: any) {
        try {
            const column = columns.join(', ')
            if (whereColumn) {
                const whereClause = `${whereColumn} = $1`;
                const data = await fastify.pg.query(`SELECT ${column} FROM ${table} WHERE ${whereClause};`, [whereValue])
                return data
            }
            else {
                const data = await fastify.pg.query(`SELECT ${column} FROM "${table}"`)
                return data
            }
        } catch (error: any) {
            throw new Error(`Error in select function: ${error.message}`);
        }
    }

    async function getRowsData(data: any) {
        try {
            const rows = data.rows
            let newData;
            for (let i = 0; i < rows.length; i++) {
                newData = rows[i];
            }
            return newData
        } catch (error: any) {
            throw new Error(`Error in getRowsData function: ${error.message}`);
        }
    }

    async function update(fastify: any, table: any, columns: any[], target: any, value: any[]) {
        try {
            let finaldata = "";
            const finaltarget = `${target} = $${columns.length + 1}`
            for (let i = 0; i < columns.length; i++) {
                let placeHolder = ` = $${i + 1}`;
                finaldata += `${columns[i]}${placeHolder}`;
                if (i < columns.length - 1) {
                    finaldata += ", ";
                }
            }
            const data = await fastify.pg.query(`UPDATE ${table} SET ${finaldata} WHERE ${finaltarget}`, value)
            return data
        } catch (error: any) {
            throw new Error(`Error in update function: ${error.message}`);
        }
    }

    return { insert, select, getRowsData, update }
}
export const core = helper()