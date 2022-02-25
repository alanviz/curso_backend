import knex from'knex';
import __dirname from './utils.js';

const databaseMysql = knex({
    client: 'mysql',
    version: '10.4.22',
    connection:{
        host:'127.0.0.1',
        port:3306,
        user:'root',
        password:'',
        database:'productos'
    },
    pool: {min:0,max:100} // asumiendo un maximo de 100 conecciones simultaneas por el momento
});

const databaseSqllite = knex({
    client:'sqlite3',
    connection:{
        filename:__dirname+'/db/ecommerce.sqlite'
    }
});

export {databaseMysql,databaseSqllite};