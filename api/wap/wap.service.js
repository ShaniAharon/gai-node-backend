const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const utilService = require('../../services/util.service')
const ObjectId = require('mongodb').ObjectId

// Add get user sites func

async function query(filterBy = { owner: '' }) {
    try {
        const collection = await dbService.getCollection('wap')
        console.log('filterBy', filterBy)

        if (filterBy.owner) {
            let waps = await collection.find({ owner: filterBy.owner }).toArray()
            console.log(filterBy.owner)
            // console.log(waps)
            return waps
        }
        const waps = await collection.find({}).toArray()
        return waps
    } catch (err) {
        logger.error('cannot find waps', err)
        throw err
    }
}

async function getById(wapId) {
    // can be merged to one func with getByUrl
    // console.log(wapId)
    try {
        const collection = await dbService.getCollection('wap')
        const wap = await collection.findOne({ _id: ObjectId(wapId) })
        return wap
    } catch (err) {
        logger.error(`while finding wap ${wapId}`, err)
        throw err
    }
}

async function getByUrl(url) {
    try {
        const collection = await dbService.getCollection('wap')
        const wap = await collection.findOne({ url })
        // console.log(wap)
        return wap
    } catch (err) {
        logger.error(`Cannot find wap by url ${url}`, err)
        throw err
    }
}

async function remove(wapId) {
    try {
        const collection = await dbService.getCollection('wap')
        await collection.deleteOne({ _id: ObjectId(wapId) })
        return wapId
    } catch (err) {
        logger.error(`cannot remove wap ${wapId}`, err)
        throw err
    }
}

async function add(wap) {
    try {
        const collection = await dbService.getCollection('wap')
        await collection.insertOne(wap)
        return wap
    } catch (err) {
        logger.error('cannot insert wap', err)
        throw err
    }
}

async function duplicateWap(wap) {
    try {
        const collection = await dbService.getCollection('wap')
        wap.isPublished = false
        wap.name = `${wap.name} - copy`
        await collection.insertOne(wap)
        return wap
    } catch (err) {
        logger.error('cannot duplicate wap', err)
        throw err
    }
}

async function update(wap) {
    try {
        const wapToSave = {
            owner: wap.owner,
            title: wap.title,
        }
        if (wap.cmps) wapToSave.cmps = wap.cmps
        const collection = await dbService.getCollection('wap')
        await collection.updateOne({ _id: ObjectId(wap._id) }, { $set: wapToSave })
        return wap
    } catch (err) {
        logger.error(`cannot update wap ${wap._id}`, err)
        throw err
    }
}

// async function addCarMsg(wapId, msg) {
//     try {
//         msg.id = utilService.makeId()
//         const collection = await dbService.getCollection('wap')
//         await collection.updateOne({ _id: ObjectId(carId) }, { $push: { msgs: msg } })
//         return msg
//     } catch (err) {
//         logger.error(`cannot add car msg ${carId}`, err)
//         throw err
//     }
// }

// async function removeCarMsg(carId, msgId) {
//     try {
//         const collection = await dbService.getCollection('wap')
//         await collection.updateOne({ _id: ObjectId(carId) }, { $pull: { msgs: {id: msgId} } })
//         return msgId
//     } catch (err) {
//         logger.error(`cannot add car msg ${carId}`, err)
//         throw err
//     }
// }

module.exports = {
    remove,
    query,
    getById,
    add,
    update,
    getByUrl,
    duplicateWap,
    // addCarMsg,
    // removeCarMsg
}
