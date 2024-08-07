const {Post, Comment, User, Friends} = require('../models/post.js');
const jwt = require('jsonwebtoken');

let postId = 0;
let commentId = 0;

async function generateToken(user) {
    const {username, password} = user
    console.log(username, password);
    const existingUser = await User.findOne({username: username, password: password});
    if (!existingUser) {
        return null;
    }
    const payload = {username: username};
    const secretKey = 'your-secret-key';

    return jwt.sign(payload, secretKey);
}

async function registerUser(userData) {
    const {username} = userData;
    const existingUser = await User.findOne({username: username});
    if (existingUser) {
        return null;
    }
    userData.friends = new Friends({
        FriendList: [],
        PendingList: []
    })
    const user = new User(userData);
    await user.save();
    return user;
}

async function getUserByUsername(username) {
    const user = await User.findOne({username: username}, 'username displayName profilePic friends');
    return user || null;
}


const maxFriendPosts = 20;
const maxNonFriendPosts = 5;

async function getPosts(username) {
    const user = await getUserByUsername(username);
    // console.log(user, username)
    let friendsList = user.friends.FriendList;
    // console.log(friendsList)
    console.log("hellooooo")
    const allPosts = await Post.find();
    console.log(allPosts)
    allPosts.reverse()
    const posts = [];
    let friendPosts = 0;
    let nonFriendPosts = 0;
    allPosts.forEach((post, index) => {
        let friend = false;
        //console.log("holaaaa", friendsList);
        friendsList.forEach((friendUsername) => {
            if (post.CreatorUsername === friendUsername) {
                friend = true;
            }
        })
        if (friend) {
            if (friendPosts < maxFriendPosts) {
                posts.push(post)
                friendPosts++
            }
        } else {
            if (nonFriendPosts < maxNonFriendPosts) {
                posts.push(post)
                nonFriendPosts++
            }
        }
    })
    return await Promise.all(posts.map(async (post) => {
        return post
    }));
}

async function createPost(displayName, username, userImg, text, img) {
    // Get the ID of the last saved chat
    const lastPost = await Post.findOne({}, {}, {sort: {id: -1}}).lean();
    const lastPostId = lastPost ? lastPost.id : 0;
    console.log("hola")
    const newPostId = lastPostId + 1;
    const newPost = new Post({
        id: newPostId,
        Creator: displayName,
        CreatorUsername: username,
        CreatorImg: userImg,
        Comments: [],
        PostImg: img,
        PostText: text,
        PostLikes: 0,
        PeopleLiked: []
    })
    await newPost.save()
    return newPost;
}

async function getPostById(postId) {
    console.log(postId)
    console.log(Post.findOne({id: postId}));
    console.log(postId)
    return Post.findOne({id: postId});
}

async function editPost(originalPost, text, img) {
    console.log("hello world")
    if (text) {
        originalPost.PostText = text;
    }
    if (img) {
        originalPost.PostImg = img;
    }
    await originalPost.save();
    return originalPost;
}

async function deletePost(postId) {
    const post = await Post.findOneAndRemove({id: postId});
    if (post === null) {
        console.log('No chat found with the specified id.');
    }
    return post;
}

async function getFriendsListByUserId(userId) {
    const user = await User.findOne({username: userId});
    if (!user) {
        console.log('couldn\'t find user');
    }
    console.log(user.friends);
    return user.friends;
}

async function askToBeFriendOfUser(userId, username) {
    const user = await User.findOne({username: userId});
    if (userId === username) {
        console.log("can\'t be your own friend")
        return null
    }
    if (!user) {
        console.log('couldn\'t find user');
        return null
    }
    if (user.friends.PendingList.includes(username) || user.friends.FriendList.includes(username)) {
        console.log('already asked');
        return null
    }
    console.log(user.friends.PendingList);
    user.friends.PendingList = [...user.friends.PendingList, username]
    await user.save();
    return user.friends;
}

async function acceptFriendRequest(userId, friendId) {
    const user = await User.findOne({username: userId});
    if (userId === friendId) {
        console.log("can\'t be your own friend")
        return null
    }
    if (!user) {
        console.log('couldn\'t find user');
        return null
    }
    if (!user.friends.PendingList.includes(friendId)) {
        console.log('friend didn\'t ask');
        return null
    }
    const friend = await User.findOne({username: friendId});
    if (!friend) {
        console.log('couldn\'t find friend');
        return null
    }
    user.friends.PendingList = user.friends.PendingList.filter(element => element !== friendId);
    user.friends.FriendList = user.friends.FriendList.filter(element => element !== friendId);
    user.friends.FriendList = [...user.friends.FriendList, friendId];
    friend.friends.PendingList = friend.friends.PendingList.filter(element => element !== userId);
    friend.friends.FriendList = friend.friends.FriendList.filter(element => element !== userId);
    friend.friends.FriendList = [...friend.friends.FriendList, userId];
    await user.save();
    await friend.save();
    return user.friends;
}

async function deleteFriend(userId, friendId) {
    const user = await User.findOne({username: userId});
    const friend = await User.findOne({username: friendId});
    if (!user) {
        console.log('couldn\'t find user');
        return null
    }
    if (!friend) {
        console.log('couldn\'t find friend');
        return null
    }
    if (!user.friends.PendingList.includes(friendId) && !user.friends.FriendList.includes(friendId)) {
        console.log('user didn\'t ask and isn\'t your friend');
        return null
    }
    user.friends.PendingList = user.friends.PendingList.filter(element => element !== friendId);
    user.friends.FriendList = user.friends.FriendList.filter(element => element !== friendId);
    friend.friends.PendingList = friend.friends.PendingList.filter(element => element !== userId);
    friend.friends.FriendList = friend.friends.FriendList.filter(element => element !== userId);
    await user.save();
    await friend.save();
    return user.friends;
}

async function getAllPostsByUserId(userId, realUser) {
    const user = await User.findOne({username: userId});
    console.log(user, userId, realUser)
    if (!(user.friends.FriendList.includes(realUser) || userId === realUser)) {
        console.log("you aren\'t friends");
        return null
    }
    const posts = await Post.find({Creator: user.displayName})

    if (!posts) {
        console.log('couldn\'t find posts');
        return null
    }
    console.log("showarma", posts.length);
    posts.reverse()
    console.log(user.displayName, userId)
    return posts;
}

async function deleteUserById(userId) {
    console.log("gsagsfsfd", userId);
    const displayName = (await User.findOne({username: userId})).displayName;
    console.log("displayName", displayName);
    const posts = await Post.deleteMany({CreatorUsername: userId});
    const all_posts = await Post.find();
    await all_posts.forEach(async (post) => {
        post.Comments = post.Comments.filter((comment) => {
            if (comment.creator != displayName) {
                return comment
            }
        })
    })
    const all_users = await User.find();
    await all_users.forEach(async (user) => {
        user.friends.FriendList = user.friends.FriendList.filter(friend => friend !== userId)
        user.friends.PendingList = user.friends.PendingList.filter(friend => friend !== userId)
        if (user.username == userId) {

        } else {
            user.save();
        }
    })
    const user = await User.findOneAndRemove({username: userId})
    return user;
}

async function updateUserById(userId, newUsername, newImg, newDisplayName, newPassword) {
    console.log("hello", userId)
    const user = await User.findOne({username: userId});
    if (!user) {
        console.log('user doesn\'t exist');
        return null
    }
    if ((await User.findOne({username: newUsername}))) {
        console.log('couldn\'t change username stopping process');
        return null
    }
    if ((await User.findOne({displayName: newDisplayName}))) {
        console.log('couldn\'t change display name stopping process');
        return null
    }
    if (newUsername) {
        if (!(await User.findOne({username: newUsername}))) {
            let users = await User.find();
            await users.forEach(async (user) => {
                console.log(user);
                if (user !== userId) {
                    let newList = [];
                    user.friends.FriendList.forEach((friend) => {
                        if (friend == userId) {
                            newList.push(newUsername)
                        } else {
                            newList.push(friend)
                        }

                    })
                    user.friends.FriendList = newList;
                    console.log("after", user)
                    let newList2 = [];
                    user.friends.PendingList.forEach((friend) => {
                        if (friend == userId) {
                            newList2.push(newUsername)
                        } else {
                            newList2.push(friend)
                        }

                    })
                    user.friends.PendingList = newList2;
                    console.log(user);
                    await user.save();
                }
            })
            user.username = newUsername
        } else {
            console.log('couldn\'t change username stopping process');
            return null
        }
    }
    if (newImg) {
        console.log("1")
        let posts = await Post.find();
        console.log("2", posts.length)
        await posts.forEach(async (post) => {
            console.log("2.5")
            if (post.Creator === user.displayName) {
                console.log("3")
                post.CreatorImg = newImg;

            }
            await post.Comments.forEach(async (comment) => {
                console.log("4")
                if (comment.creator === user.displayName) {
                    console.log("5")
                    comment.creatorImg = newImg;
                }
            })
            console.log("6", post)
            await post.save();
            console.log("7")
        })
        console.log("8")
        let comments = await Comment.find();
        console.log("9", comments.length)
        await comments.forEach(async (comment) => {
            console.log("10")
            if (comment.creator === user.displayName) {
                console.log("11")
                comment.creatorImg = newImg;
                await comment.save();
            }
        })
        console.log("12")
        user.profilePic = newImg;

    }
    if (newDisplayName) {
        console.log("helloo2", newDisplayName)
        if ((await User.findOne({displayName: newDisplayName}))) {
            console.log('couldn\'t change display name stopping process');
            return null
        }
        let posts = await Post.find();
        await posts.forEach(async (post) => {
            console.log("yes")
            if (post.Creator === user.displayName) {
                console.log("no?")
                post.Creator = newDisplayName;

            }
            await post.Comments.forEach(async (comment) => {
                if (comment.creator === user.displayName) {
                    comment.creator = newDisplayName;
                }
            })
            await post.save();
        })
        console.log("here")
        let comments = await Comment.find();
        console.log(comments)
        await comments.forEach(async (comment) => {
            if (comment.creator === user.displayName) {
                comment.creator = newDisplayName;
                await comment.save();
            }
        })
        console.log("hereee")
        user.displayName = newDisplayName;
    }

    if (newPassword) {
        user.password = newPassword;
    }
    console.log("lastone", user)
    await user.save();
    console.log("no way")
    return user;
}

async function likePost(postId, username) {
    const post = await Post.findOne({id: postId});
    if (!post) {
        console.log('could\'t find post');
        return null
    }
    if (post.PeopleLiked.includes(username)) {
        post.PeopleLiked = post.PeopleLiked.filter(element => element !== username);
    } else {
        post.PeopleLiked = [...post.PeopleLiked, username];
    }
    post.PostLikes = post.PeopleLiked.length;
    await post.save();
    return post;
}

async function createComment(postId, username, userImg, commentText) {
    console.log("got here")
    const post = await Post.findOne({id: postId});
    console.log("early post", post);
    if (!post) {
        console.log('could\'t find post');
        return null
    }
    const lastComment = await Comment.findOne({}, {}, {sort: {id: -1}}).lean();
    const lastCommentId = lastComment ? lastComment.id : 0;
    console.log("hola")
    const newCommentId = lastCommentId + 1;
    let newComment = new Comment({
        id: newCommentId,
        creator: username,
        creatorImg: userImg,
        content: commentText
    })
    console.log("and here?")
    await newComment.save();
    post.Comments = [newComment, ...post.Comments];
    console.log("surely not here?")
    console.log("post", post)
    await post.save();
    console.log("what?")
    return post;

}

async function editComment(postId, username, commentText, commentId) {
    const post = await Post.findOne({id: postId});
    if (!post) {
        console.log('could\'t find post');
        return null
    }
    const comment = await Comment.findOne({id: commentId});
    if (!comment) {
        console.log('could\'t find comment');
        return null
    }
    if (username !== comment.creator) {
        console.log('not your comment');
        return null
    }
    if (commentText) {
        comment.content = commentText;
    }
    post.Comments = post.Comments.filter(comment => {
        if (comment.id == commentId) {
            if (commentText) {
                comment.content = commentText;
            }
        }
        return true;
    })
    await post.save()
    await comment.save()
    return post
}

async function deleteComment(postId, username, commentId) {
    const post = await Post.findOne({id: postId});
    if (!post) {
        console.log('could\'t find post');
        return null
    }
    const comment = await Comment.findOne({id: commentId});
    if (!comment) {
        console.log('could\'t find comment');
        return null
    }
    if (username !== comment.creator) {
        console.log('not your comment');
        return null
    }
    console.log("hi")
    const deleteComment = await Comment.findOneAndRemove({id: commentId});
    console.log("hola")
    post.Comments = post.Comments.filter(comment => {
        console.log(commentId, comment.id);
        return (commentId != comment.id)
    })
    console.log("hola2")

    await post.save()
    console.log("hola3")
    console.log("hola")
    return post
}

async function getCommentsByPostId(postId) {
    const post = await Post.findOne({id: postId})
    if (!post) {
        console.log('couldn\'t find post')
        return null
    }
    return post.Comments;
}

module.exports = {
    generateToken,
    registerUser,
    getUserByUsername,
    getPosts,
    createPost,
    editPost,
    getPostById,
    deletePost,
    getFriendsListByUserId,
    askToBeFriendOfUser,
    acceptFriendRequest,
    deleteFriend,
    getAllPostsByUserId,
    deleteUserById,
    updateUserById,
    likePost,
    createComment,
    editComment,
    deleteComment,
    getCommentsByPostId
};

