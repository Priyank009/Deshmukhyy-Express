const { ObjectId } = require('mongodb');
const database = require('../../database');
const {collections} = require('../../database');
const utilities = require('../../utilities');

const movieApi = module.exports;

const validMovieStatuses = ['cancelled', 'waiting', 'confirmed'];

movieApi.create = async (request) => {
    const {user} = request;
    const {releaseYear, title, rating, director, fare, showTime} = request.body;

/* 
    Step 1: Getting details about the person making the request.
    Tech World: Extracting the logged-in user information from the incoming request.
*/
    // Write your code here

    movie.uid = _______;//  user.userId
    movie.title = _______; // give title 
    movie.rating = _______; // give rating 
    movie.director = ________; // give  director 
    movie.releaseYear = ________; // give releaseYear 
    movie.fare = _______; //give fare
    movie.showTime = ________;  // give showTime
    movie.createdAt = _________;//give time
    movie.updatedAt = timestamp;

    return await database.client.collection(collections.MOVIES).insertOne(movie);
}

movieApi.get = async (request) => {
    const { userId } = request.user;

    const limit = parseInt(request.query.limit) || 10;
    const page = parseInt(request.query.page) || 0;
    const offset = page*limit;
    const key = { uid: userId }

    const [movies, count] = await Promise.all([
        database.client.collection(collections.MOVIES).find(key).skip(offset).limit(limit).toArray(),
        database.client.collection(collections.MOVIES).countDocuments(key)
    ]);

    return utilities.paginate(`/api/movie${request.url}`, movies, count, limit, page);
}

movieApi.update = async (req) => {
    const {id} = req.params;
    const userId = req.user.userId;
    const {status} = req.body;
    const payload = {};

    if (!ObjectId.isValid(id)) {
        throw new Error('Invalid id supplied');
    }

    const movie = await database.client.collection(collections.MOVIES).findOne({_id: new ObjectId(id)});
    if (!movie) {
        throw new Error('Movie not found');
    }

    ['title', 'rating', 'director', 'releaseYear', 'fare', 'showTime'].forEach(field => {
        if (req.body[field]) {
            payload[field] = req.body[field];
        }
    });

    if (status) {
        if (!validMovieStatuses.includes(status)) {
            throw new Error('Invalid status: ' + status);
        }

        payload.status = status;
    }

    payload.updatedAt = utilities.getISOTimestamp();

    await database.client.collection(collections.MOVIES).findOneAndUpdate({_id: new ObjectId(id)}, {$set: payload});
}
