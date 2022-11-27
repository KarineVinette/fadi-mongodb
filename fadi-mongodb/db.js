import mongoose from 'mongoose';
// mongodb+srv://admin:P@ss1234@blog.ibllukm.mongodb.net/?retryWrites=true&w=majority
await mongoose.connect('mongodb+srv://admin:P%40ss1234@blog.ibllukm.mongodb.net/blog?retryWrites=true&w=majority',
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => console.log(" Mongoose is connected"));

const db = mongoose.connection;
db.on('error', (err) => {
    console.log(err);
});

const postsSchema = mongoose.Schema({
    id: Number,
    title: String,
    content: String,
    author: String
});

export const Post = mongoose.model('Post', postsSchema, 'posts');

// console.log(await Post.find());