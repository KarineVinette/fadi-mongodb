import express from 'express';
import jwt from 'jsonwebtoken';
import { posts, TOKEN_SECRET, users } from './posts.js';
import './db.js';
import { Post } from './db.js';

// mongodb+srv://admin:P@ss1234@blog.ibllukm.mongodb.net/?retryWrites=true&w=majority

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static('public'));

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username == username && u.password == password);
    if (!user) {
        return res.status(400).json('Wrong username or password!');
    }

    const token = jwt.sign({ username: user.username, role: user.role },
        TOKEN_SECRET);

    return res.json({
        token
    });
});


function authorize(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json('Unauthorized');

    jwt.verify(token, TOKEN_SECRET, (err, user) => {
        if (err) {
            console.log(err);
            return res.status(401).json('Unauthorized');
        }

        next();
    });
}

app.get('/api', (req, res) => res.json({
    name: 'Blog App',
    author: 'ALGOSUP',
    description: `This is a blog website app. It's used for publishing and reading articles online.`
}));

app.get('/api/posts', async (req, res) => {
    const posts = await Post.find();
    console.log(posts);
    return res.json(posts);
});

app.get('/api/posts/:id', async (req, res) => {
    const postId = req.params.id;
    // const post = posts.find(p => p.id == postId);
    const post = await Post.findById(postId);
    if (post) {
        return res.json(post);
    }

    return res.status(404).json('Post not found');
});

app.post('/api/posts', (req, res) => {
    const newPost = req.body;
    if (newPost) {
        posts.push(newPost);
        // posts = [...posts, newPost];
        return res.status(201).json('Post created');
    }
    return res.status(400).json('Post is missing!');
});

app.put('/api/posts/:id', (req, res) => {
    const postId = req.params.id;
    const i = posts.findIndex(p => p.id == postId);
    if (i < 0) {
        return res.status(404).json('Post not found!');
    }

    const updatedPost = req.body;
    console.log(updatedPost);
    if (updatedPost) {
        posts[i] = updatedPost;
        return res.json('Post updated');
    }

    return res.status(400).json('Post updates missing!');
});

app.delete('/api/posts/:id', (req, res) => {
    const postId = req.params.id;
    const i = posts.findIndex(p => p.id == postId);
    if (i < 0) {
        return res.status(404).json('Post not found!');
    }

    posts.splice(i, 1);
    res.json('Post deleted');
});

app.listen(3000, () => {
    console.log(`Server running on http://localhost:${port}`);
});