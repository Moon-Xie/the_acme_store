const apiRouter = require('express').Router()
const {
    client,
    createProduct,
    createUser,
    createFavorite,
    fetchUsers,
    fetchProducts,
    fetchFavorites,
    destroyFavorite

}   =  require('./db')

//GET /api/users
apiRouter.get('/users', async(req, res, next) => {
    try {
        const response = await fetchUsers()
        res.status(200).send(response)
    } catch (error) {
        next(error)
    }
})


//GET /api/products
apiRouter.get('/products', async (req, res, next) => {
    try {
        const response = await fetchProducts()
        res.status(200).send(response)
    } catch (error) {
        next(error)
    }
})


//GET /api/users/:id/favorites
apiRouter.get('/users/:id/favorites', async (req, res, next) => {
    try {
        const response = await fetchFavorites(req.params.id)
        res.status(200).send(response)
    } catch (error) {
        next(error)
    }
})


//POST /api/users/:id/favorites status 201
apiRouter.post('/users/:id/favorites', async(req, res, next) => {
    try {
        const response = await createFavorite({product_id: req.body.product_id, user_id: req.params.id})
        res.status(201).send(response)
    } catch (error) {
        next(error)
    }
})


//DELETE /api/users/:userId/favorite/:id status 204
apiRouter.delete('/usres/:userId/favorite/:id', async(req, res, next) => {
    try {
        await destroyFavorite({userId: req.params.userId, id: req.params.id})
        res.status(204).send()
    } catch (error) {
        next(error)
    }
}) 




module.exports = apiRouter