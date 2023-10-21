const database = require("../database");
const { collections } = require("../database");
const { ObjectId } = require("mongodb");

const create = module.exports;

create.createRequest = async (req) => {
    const { userId } = req.user;
    const { item, itemNeeded, drop, dropLocation, time, fare } = req.body;

    const payload = {
        uid: userId,
        createdAt: new Date().toISOString(),
        status: 'pending',
    };

    if (!item && !drop) throw new Error('Item or drop is required');
    if (!time || !fare) throw new Error('Time & fair is required');
    payload.time = time;
    payload.fare = fare;

    if (item === 'true') {
        if (!itemNeeded) throw new Error('Item needed is required');
        payload.item = true;
        payload.itemNeeded = itemNeeded;
    }

    if (drop === 'true') {
        if (!dropLocation) throw new Error('Drop location is required');
        payload.drop = true;
        payload.dropLocation = dropLocation;
    }

    return await database.client.collection(collections.REQUESTS).insertOne(payload);
}

create.getRequests = async (req) => {
    const { userId } = req.user;

    const limit = parseInt(req.query.limit) || 5;
    const page = parseInt(req.query.page) || 1;
    const startTime = req.query.startTime || 0;
    const endTime = req.query.endTime || 0;
    const { status, role } = req.query;

    const key = {}

    status && (key.status = status);
    role === 'rider' ? (key.acceptedBy = userId) : (key.uid = userId);


    if (startTime && endTime) {
        key.time = {
            $gte: startTime,
            $lte: endTime,
        }
    }

    const count = await database.client.collection(collections.REQUESTS).countDocuments(key);
    const totalPages = Math.ceil(count / limit);
    const offset = (page - 1) * limit;

    const requests = await database.client.collection(collections.REQUESTS)
        .find(key)
        .skip(offset)
        .limit(limit)
        .toArray();

    return {
        requests,
        totalPages,
        currentPage: page,
        totalDocuments: count,
    };
}

create.acceptRequests = async (req) => {
    const { userId } = req.user;
    const { requestIds } = req.body;
    const status = req.query.status || 'accepted';

    if (!requestIds || !requestIds.length) throw new Error('Request ids are required');

    const payload = {
        acceptedBy: userId,
        acceptedAt: new Date().toISOString(),
        status,
    }

    let dbCall =  await Promise.all(
        requestIds.map(requestId => database.client.collection(collections.REQUESTS).findOneAndUpdate({ _id: new ObjectId(requestId) }, { $set: payload }))
    )

    dbCall = dbCall.map((item) => {
        return {_id: item.value._id, ok: item.ok}
    });

    return { dbCall };
}
