import { databaseSqllite } from "../config.js";

export default class Messages{
    constructor(){
        databaseSqllite.schema.hasTable('messages').then(result=>{
            if(!result) {
                databaseSqllite.schema.createTable('messages',table=>{
                    table.increments();
                    table.string('user').notNullable();
                    table.string('message').notNullable();
                    table.string('email').notNullable();
                    table.timestamps(true,true);
                }).then(result=>{
                    console.log('Messages table created');
                })
            }
        })
    }

    getMessages = async () => {
        try{
            let messages = await databaseSqllite.table('messages').select();
            return {status:"success", payload:messages}
        } catch(error){
            return {status:"error", message:error}
        }
    }

    registerMessage = async (message) => {
        try{
            let result = await databaseSqllite.table('messages').insert(message);
            return {status:"success",payload:`Message registered with id: ${result[0]}`}
        } catch(err){
            return {status:"error", message:err}
        }
    }
}