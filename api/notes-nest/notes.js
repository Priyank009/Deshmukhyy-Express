const database = require('../../database');
const {collections} = require('../../database');
const utilities = require('../../utilities');

const noteApi = module.exports;

noteApi.create = async (request) => {
    const {userId} = req.userId;
    const {content, title} = request.body;

    const timestamp = utilities.getISOTimestamp();
    const note = {};

    note.uid = userId;
    note.title = title;
    note.content = content;
    note.createdAt = timestamp;
    note.updatedAt = timestamp;

    return await database.client.collection(collections.NOTES).insertOne(note);
}