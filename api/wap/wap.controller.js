const wapService = require('./wap.service.js')

const logger = require('../../services/logger.service')
const asyncLocalStorage = require('../../services/als.service.js')

async function getWaps(req, res) {
    try {
        logger.debug('Getting Waps')
        const filterBy = {
            owner: req.query.owner || '',
        }
        const waps = await wapService.query(filterBy)
        res.json(waps)
    } catch (err) {
        logger.error('Failed to get waps', err)
        res.status(500).send({ err: 'Failed to get waps' })
    }
}

async function getWapById(req, res) {
    try {
        const wapId = req.params.id
        const wap = await wapService.getById(wapId)
        res.json(wap)
    } catch (err) {
        logger.error('Failed to get wap', err)
        res.status(500).send({ err: 'Failed to get wap' })
    }
}

async function getWapByUrl(req, res) {
    try {
        const wapUrl = req.params.url
        const wap = await wapService.getByUrl(wapUrl)
        res.json(wap)
    } catch (err) {
        logger.error('Failed to get wap by url', err)
        res.status(500).send({ err: 'Failed to get wap' })
    }
}

async function getWapToEdit(req, res) {
    try {
        const id = req.params.id
        console.log('getting wap to edit')
        let demoWap = await wapService.getById(id)
        delete demoWap._id
        const wap = await wapService.add(demoWap)
        res.json(wap)
    } catch (err) {
        logger.error('Failed to get wap', err)
        res.status(500).send({ err: 'Failed to get template to edit' })
    }
}

async function duplicateWap(req, res) {
    try {
        const id = req.params.id
        let copiedWap = await wapService.getById(id)
        delete copiedWap._id
        const wap = await wapService.duplicateWap(copiedWap)
        res.json(wap)
    } catch (err) {
        logger.error('Failed to get wap', err)
        res.status(500).send({ err: 'Failed to duplicate wap' })
    }
}

async function addWap(req, res) {

    const { loggedinUser } = asyncLocalStorage.getStore()
    // console.log('loggedinUser', loggedinUser)

    try {
        const wap = req.body
        wap.owner = loggedinUser._id
        const addedWap = await wapService.add(wap)
        res.json(addedWap)
    } catch (err) {
        logger.error('Failed to add wap', err)
        res.status(500).send({ err: 'Failed to add wap' })
    }
}

async function updateWap(req, res) {
    try {
        const wap = req.body
        const updatedWap = await wapService.update(wap)
        res.json(updatedWap)
    } catch (err) {
        logger.error('Failed to update wap', err)
        res.status(500).send({ err: 'Failed to update wap' })
    }
}

async function removeWap(req, res) {
    try {
        const wapId = req.params.id
        const removedId = await wapService.remove(wapId)
        res.send(removedId)
    } catch (err) {
        logger.error('Failed to remove wap', err)
        res.status(500).send({ err: 'Failed to remove wap' })
    }
}


module.exports = {
    getWaps,
    getWapById,
    addWap,
    updateWap,
    removeWap,
    getWapByUrl,
    getWapToEdit,
    duplicateWap,
}
