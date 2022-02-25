import {databaseMysql} from '../config.js'


export default class Productos{
    constructor(){
        databaseMysql.schema.hasTable('productos')
        .then(result => {
            if(!result){ //si la tabla no existe, entonces hay que crearla
                databaseMysql.schema.createTable('productos',table => {
                    table.increments();
                    table.string('title').notNullable();
                    table.string('price').notNullable();
                    table.string('thumbnail').notNullable();
                    table.timestamps(true,true);
        }).then(result => console.log('Tabla productos creada'));
    } else {
        console.log('La tabla productos ya existe');
    }
    });
    }

    getProducts =  async () => {
        try{
            let productos = await databaseMysql.table('productos').select();
            return {status:"success", payload:productos}
        } catch(err) {
            return {status:"error", message:error}
        }
    }

    getProductById = async (id) => {
        try {
            let producto = await databaseMysql.table('productos').select().where('id',id).first();
            if(producto) return {status:"success",payload:producto}
            return {status:"error",message:"Product not found"}
        } catch {
            return {status:"error", message:error}
        }
    }

    registerProduct = async (product) => {
        try{
            let producto = await databaseMysql.table('productos').select().where('title',product.title).first();
            if(producto) return {status:"error",message:'Product already exists'}
            let numRows = await databaseMysql.table('productos').select().count();
            numRows = numRows[0]['count(*)']+1;
            let exists = await databaseMysql.table('productos').select().where('id',numRows).first();
            if(exists) numRows = numRows+1;
            product = Object.assign({id:numRows,...product});
            let result = await databaseMysql.table('productos').insert(product);
            return {status:"success",payload:`Product registered with id: ${result[0]}`}
        } catch(err){
            return {status:"error", message:err}
        }
    }

    updateProduct = async (id,body) => {
        try{
            let producto = await databaseMysql.table('productos').select().where('id',id).first();
            if(!producto) return {status:"error", message:"The product does not exist"}
            body = Object.assign({id:producto.id,...body});
            let result = await databaseMysql.table('productos').select().where('id',id).first().update(body);
            return {status:"success",payload:`Product with id: ${id} has been updated successfully`}
        } catch(err){
            return {status:"error", message:err}
        }
    }

    deleteProductById = async (id) => {
        try{
            let producto = await databaseMysql.table('productos').select().where('id',id).first();
            if(!producto) return {status:"error", message:"The product does not exist"};
            let result = await databaseMysql.table('productos').select().where('id',id).first().del();
            if(result) return {status:"success",payload:`Product with id: ${id} has been deleted successfully`}
        } catch(err){
            return {status:"error", message:err}
        }
    }
}