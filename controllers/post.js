//controllers file
const postService = require('../services/post');
const {join} = require("path");

// Post Controllers
async function getPosts(req, res) {
    const posts = await postService.getPosts(req.user.username);
    res.json(posts);
}

async function createPost(req, res) {
    const post = await postService.createPost(req.user.username, req.body.username);
    if (!post) {
        return res.status(404).json({ error: 'User not found' });
    }
    res.json(post);
}

async function getPostById(req, res) {
    const post = await postService.getPostById(req.params.postId);
    if (!post) {
        return res.status(404).json({ error: 'post not found' });
    }
    res.json(post);
}

async function deletePost(req, res) {
    const post = await postService.deletePost(req.params.postId);
    if (!post) {
        return res.status(404).json({ error: 'post not found' });
    }
    res.json(post);
}
async function editPost(req, res) {
    const post = await postService.editPost(req.params.postId);
    if (!post) {
        return res.status(404).json({ error: 'post not found' });
    }
    res.json(post);
}
async function likePost(req, res) {
    const post = await postService.likePost(req.params.postId);
    if (!post) {
        return res.status(404).json({ error: 'post not found' });
    }
    res.json(post);
}
async function createComment(req, res) {
    const comment = await postService.createComment(req.params.postId, {
        senderUsername: req.user.username,
        content: req.body.msg
    });
    if (!comment) {
        return res.status(404).json({ error: 'post not found' });
    }
    res.json(comment);
}

async function getCommentsByPostId(req, res) {
    const comments = await postService.getCommentsByPostId(req.params.postId);
    if(!comments) {
        return res.status(404)({error:'Post not found'});
    }
    res.json(comments);
}
async function deleteComment(req, res) {
    const comments = await postService.deleteComment(req.params.commentId);
    if (!comments) {
        return res.status(404).json({ error: 'post not found' });
    }
    res.json(comment);
}
async function editComment(req, res) {
    const comments = await postService.editComment(req.params.commentId);
    if(!comments) {
        return res.status(404).json({error:'Comment not found'});
    }
    res.json(comments);
}


// Token Controller
async function generateToken(req, res) {
    const token = await postService.generateToken(req.body);
    if (!token) {
        return res.status(404).json({ error: 'invalid username and or password' });
    }
    // res.json({ token });
    res.send(token);
}

// User Controller
async function getUserByUsername(req, res) {
    const user = await postService.getUserByUsername(req.params.username);
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
}

async function registerUser(req, res) {
    const user = await postService.registerUser(req.body);
    if (!user) {
        return res.status(400).json({ error: 'Username already exists' });
    }
    res.json(user);
}

async function redirectHome(req, res) {
    res.sendFile(join(__dirname,'..', 'public', 'index.html'));
}
async function redirectHome(req, res) {
    res.redirect('/');
}



module.exports = {
    getPosts,
    createPost,
    getPostById,
    deletePost,
    editPost,
    createComment,
    deleteComment,
    editComment,
    getCommentsByPostId,
    generateToken,
    getUserByUsername,
    registerUser,
    redirectHome,
    likePost,
    redirectHome 
};
