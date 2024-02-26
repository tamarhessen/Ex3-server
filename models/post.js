const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    displayName: {
        type: String,
        required: true
    },
    profilePic: {
        type: String,
        required: true
    }
});


const CommentSchema = new Schema({
    id: {
        type: Number,
        integer: true
    },
    created: {
        type: Date,
        default: Date.now
    },
    sender: {
        username:{
            type:String,
            required:true
        },
    },
    content: {
        type: String,
        required: true
    }
});

const PostSchema = new Schema({
    id: {
        type: Number,
        integer: true
    },
    Creator: {
        username:{
            type:String,
            required:true
        },
    },
    Comments: [{
        type: CommentSchema,
        nullable: true
    }],
    PostImg:{
        type: String,
        nullable:true
    },
    PostText:{
        type:String,
        nullable:true
    },
    PostLikes:{
        type: Number,
        integer: true
    },
    IsPostLiked:{
        type: Boolean,
        required: true
    }
});

const FriendsSchema = new Schema({
    FriendList: [{
        type: String,
        nullable: true
    }]
})


const Post = mongoose.model('Post', PostSchema);
const Comment = mongoose.model('Comment', CommentSchema);
const User = mongoose.model('User', UserSchema);
const Friends = mongoose.model('Friends', FriendsSchema);

module.exports = { Post, Comment, User, Friends };