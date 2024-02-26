//services file
const { text } = require('body-parser');
const { Post, Comment, User } = require('../models/post.js');
const jwt = require('jsonwebtoken');

let postId = 0;

async function getPosts(username) {
    const posts = await Post.find({users: username });
    const result = await Promise.all(posts.map(async (post)=> {
        const otherUsername = await post.users.filter((str)=>str!==username)[0];
        const otherUser = await User.findOne({username:otherUsername})
        const modified = {
            id: post.id,
            user: {
                username: otherUser.username,
                displayName: otherUser.displayName,
                profilePic: otherUser.profilePic
            
            },
            lastComment:post.lastComment,
            text: post.text,
            likes: post.likes,
            date: post.date,
            picture: post.picture
        }
        return modified;
    }))

    return result;
}

async function createPost(username, targetUsername) {
    if(username===targetUsername) {
        return null;
    }
    const user = await User.findOne({ username: username });
    if (!user) {
        return null;
    }
    const targetUser = await User.findOne({ username: targetUsername });
    if (!targetUser) {
        return null;
    }
    // Get the ID of the last saved post
    const lastPost = await Post.findOne({}, {}, { sort: { id: -1 } }).lean();
    const lastPostId = lastPost ? lastPost.id : 0;

    // Increment the ID by 1 for the new chat
    const newPostId = lastPostId + 1;

    const post = new Post({
        id: newPostId,
        text: postData.text,
        picture: postData.picture,
        date: new Date(),
        users: [username,
        targetUsername],
        comments: [],
        lastComment:null
    });
    await post.save();
    const result = {
        id: post.id,
        user: {
            username: targetUser.username,
            displayName: targetUser.displayName,
            profilePic: targetUser.profilePic
        },
        text: post.text,
        picture: post.picture,
        date: post.date,
        likes: post.likes,
        lastComment: post.lastComment
    };
    return result;
}

async function getPostById(postId) {
    const post = await Post.findOne({ id: postId })
        .populate('users', 'username displayName profilePic')
        .populate('comments', 'id created content');
    return chat;
}

async function deletePost(postId) {
    const post = await Post.findOneAndDelete({ id: postId });
    if (post === null) {
        console.log('No post found with the specified id.');
    }
    return post;
}
async function editPost(postId) {
    const post = await Post.findOneAndEdit({ id: postId });
    if (post === null) {
        console.log('No post found with the specified id.');
    }
    return post;
}
async function likePost(postId) {
    const post = await Post.findOne({ id: postId });
    if (post) {
        post.likes++;
        await post.save();
        return post.likes;
    } else {
        return 0;
    }
}

async function createComment(postId, commentData) {
    const { senderUsername, content } = commentData;
    const post = await Post.findOne({ id: postId });
    if (!post) {
        return null;
    }
    let id = 0;
    if(post.comments.length !== 0) {
        id = post.comments[0].id+1;
    }
    const comment = new Comment({ id: id, sender: {username:senderUsername}, content: content });
    post.comments.unshift(comment);
    Post.lastComment= comment;
    await post.save();
    return comment;
}

async function getCommentsByPostId(postId) {
    const chat = await Post.findOne({ id: postId }).populate('comments');
    if(!post) {
        return null;
    }

    return post.comments;
}
async function deleteComment(commentId) {
    const post = await Comment.findOneAndDelete({ id: commentId });
    if (comment === null) {
        console.log('No comment found with the specified id.');
    }
    return post.comment;
}
async function editComment(commentId) {
    const post = await Comment.findOneAndEdit({ id: commentId });
    if (comment === null) {
        console.log('No comment found with the specified id.');
    }
    return post.comment;
}

async function getUserByUsername(username) {
    const user = await User.findOne({ username: username }, 'username displayName profilePic');
    return user || null;
}

async function registerUser(userData) {
    const { username } = userData;
    const existingUser = await User.findOne({ username : username });
    if (existingUser) {
        return null;
    }
    const user = new User(userData);
    await user.save();
    return user;
}

async function generateToken(user) {
    const { username, password } = user
    const existingUser = await User.findOne({ username : username, password: password });
    if (!existingUser) {
        return null;
    }
    const payload = { username: username };
    const secretKey = 'your-secret-key';

    return jwt.sign(payload, secretKey);
}

module.exports = {
    getPosts,
    createPost,
    getPostById,
    deletePost,
    editPost,
    createComment,
    getCommentsByPostId,
    deleteComment,
    editComment,
    getUserByUsername,
    registerUser,
    generateToken,
    likePost
};
