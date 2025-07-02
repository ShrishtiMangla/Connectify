import User from '../models/user.model.js';
import FriendRequest from '../models/friendRequest.model.js';

export async function getRecommendedUsers(req, res) {
    try {
        const currentUserId = req.user._id;
        const currentUser = req.user;

        const RecommendedUsers = await User.find({
            $and:[
                {_id: {$ne: currentUserId}}, // Exclude current user
                {$id: {$nin: currentUser.friends}}, // Exclude friends
                { isOnboarded: true } // Only include onboarded users
            ],
        });
        res.status(200).json(RecommendedUsers);
    } catch (error) {
        console.error("Error in getRecommendedUsers controller :", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}


export async function getMyFriends(req, res) {
    try {
        const user = await User.findById(req.user._id)
        .select("friends")
        .populate('friends', "fullName profilePic nativeLanguage learningLanguage");
        
        res.status(200).json(user.friends);
    } catch (error) {
        console.error("Error in getMyFriends controller :", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function sendFriendRequest(req, res) {
    try {
        
        const myId = req.user.id;
        const {id:recipientId} = req.params;

        if (myId === recipientId) {
            return res.status(400).json({ message: "You cannot send a friend request to yourself." });
        }

        const recipient = await User.findById(recipientId);

        if(!recipient) {
            return res.status(404).json({ message: "recipient not found." });
        }

        if (recipient.friends.includes(myId)) {
            return res.status(400).json({ message: "You are already friends with this user." });
        }

        //check if a friend request already exists
        const existingRequest = await FriendRequest.findOne({
            $or: [
                { sender: myId, recipient: recipientId },
                { sender: recipientId, recipient: myId }
            ]
        });

        if (existingRequest) {
            return res.status(400).json({ message: "Friend request already exists." });
        }

        const friendRequest = new FriendRequest.create({
            sender: myId,
            recipient: recipientId
        });

        res.status(201).json(friendRequest);


    } catch (error) {
        console.error("Error in sendFriendRequest controller:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
} 

export async function acceptFriendRequest(req, res) {
    try {
        
        const {id:requestId} = req.params;

        const friendRequest = await FriendRequest.findById(requestId);

        if (!friendRequest) {
            return res.status(404).json({ message: "Friend request not found." });
        }

        //Verify the current user is the recipient
        if ( friendRequest.recipient.toString() !== req.user._id) {
            return res.status(403).json({ message: "You are not authorized to accept this friend request." });
        }

        //update the friend request status to accepted
        friendRequest.status = "accepted";
        await friendRequest.save();

        //add each other to friends list
        await User.findByIdAndUpdate( friendRequest.sender, { $addToSet: { friends: friendRequest.recipient } });

        await User.findByIdAndUpdate(friendRequest.recipient, { $addToSet: { friends: friendRequest.sender } });

        res.status(200).json({ message: "Friend request accepted successfully." });

    } catch (error) {
        console.error("Error in acceptFriendRequest controller:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}