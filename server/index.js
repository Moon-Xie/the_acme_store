require('dotenv').config()
const express = require('express')
const app = express()
app.use(express.json())
const apiRouter = require('./api')
app.use('/api', apiRouter)
const {
    client,
    createTables,
    createProduct,
    createUser,
    createFavorite,
    fetchUsers,
    fetchProducts,
    fetchFavorites
}   =  require('./db')



const init = async() => {
    console.log('Connecting with database...')
    await client.connect()
    console.log('Database connected!')
    await createTables()
    console.log('Created tables')
    const [jeans, shirt, skirt, socks, moon, hunter, bojack, lucy] = await Promise.all([
        createProduct("jeans"),
        createProduct("shirt"),
        createProduct("skirt"),
        createProduct("socks"),
        createUser({username:'moon', password:"moonpass"}),
        createUser({username:'hunter', password:"hunterpass"}),
        createUser({username:'bojack', password:"bojackpss"}),
        createUser({username:'lucy', password:"lucypass"})
    ])
    const favorite = await createFavorite({product_id: skirt.id, user_id: hunter.id})
    console.log('Seeded data into tables')
    console.log('Users are ', await fetchUsers())
    console.log('Products are ', await fetchProducts())
    console.log('Hunter favorite is ', await fetchFavorites(hunter.id))

    app.listen(process.env.PORT, () => {
        console.log(`Server is listening to `,process.env.PORT )
    })
}
init()