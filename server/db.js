const pg = require("pg")
const client = new pg.Client(process.env.DATABASE_URL)
const uuid = require('uuid')
const bcrypt = require('bcrypt')
const createTables = async() => {
    const SQL = /*sql*/`
    DROP TABLE IF EXISTS favorites;
    DROP TABLE IF EXISTS users;
    DROP TABLE IF EXISTS products;
    CREATE TABLE users(
        id UUID PRIMARY KEY,
        username VARCHAR(255) UNIQUE,
        password VARCHAR(255) NOT NULL
    );
    CREATE TABLE products(
        id UUID PRIMARY KEY,
        name VARCHAR(255) NOT NULL
    );
    CREATE TABLE favorites(
        id UUID PRIMARY KEY,
        product_id UUID REFERENCES products(id) NOT NULL,
        user_id UUID REFERENCES users(id) NOT NULL,
        CONSTRAINT unique_user_id_product_id UNIQUE(product_id, user_id)
    )
    `
    await client.query(SQL)
}

const createProduct = async (name) => {
    const SQL =/*sql*/ `
        INSERT INTO products(id, name) 
        VALUES ($1, $2) 
        RETURNING *
    `
    const values = [uuid.v4(), name]
    const response = await client.query(SQL, values)
    return response.rows[0]
}

const createUser = async ({username, password}) => {
    const SQL =/*sql*/ `
        INSERT INTO users(id, username, password) 
        VALUES($1, $2, $3) 
        RETURNING *
    `
    const values = [uuid.v4(), username, await bcrypt.hash(password, 5)]
    const response = await client.query(SQL, values)
    return response.rows[0]
}

const createFavorite = async ({product_id, user_id}) => {
    const SQL = /*sql*/`
        INSERT INTO favorites(id, product_id, user_id) 
        VALUES($1, $2, $3) 
        RETURNING *
    `
    const values = [uuid.v4(), product_id, user_id]
    const response = await client.query(SQL, values)
    return response.rows[0]
}

//fetchUsers
const fetchUsers = async() => {
    const SQL = /*sql*/ `
        SELECT * FROM users;
    `
    const response = await client.query(SQL)
    return response.rows
}

//fetchProducts
const fetchProducts = async() => {
    const SQL = /*sql*/ `
        SELECT * FROM products;
    `
    const response = await client.query(SQL)
    return response.rows
}

//fetchFavorites
const fetchFavorites = async (user_id) => {
    const SQL = /*sql*/`
        SELECT * FROM favorites 
        WHERE user_id = $1
    `
    const values = [user_id]
    const response = await client.query(SQL, values)
    return response.rows
}

//destroyFavorite
const destroyFavorite = async({userId, id}) => {
    const SQL = /*sql*/`
        DELETE FROM favorites 
        WHERE user_id = $1 AND id = $2
    `
    const values = [userId, id]
    await client.query(SQL, values)
}


module.exports = {
    client,
    createTables,
    createProduct,
    createUser,
    createFavorite,
    fetchUsers,
    fetchProducts,
    fetchFavorites,
    destroyFavorite
}