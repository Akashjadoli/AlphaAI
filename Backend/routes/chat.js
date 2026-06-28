import express from "express";
import Thread from "../models/Thread.js";
import getOpenAIAPIResponse from "../utils/openai.js";
import admin from "../utils/firebaseAdmin.js";

const router = express.Router();

// Auth middleware
const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token provided" });

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.userId = decoded.uid;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};

// Test route
router.post("/test", async(req, res) => {
    try {
        const thread = new Thread({
            threadId: "abc",
            title: "Testing New Thread2"
        });
        const response = await thread.save();
        res.send(response);
    } catch(err) {
        console.log(err);
        res.status(500).json({error: "Failed to save in DB"});
    }
});

// Get all threads — sirf us user ke
router.get("/thread", verifyToken, async(req, res) => {
    try {
        const threads = await Thread.find({ userId: req.userId }).sort({updatedAt: -1});
        res.json(threads);
    } catch(err) {
        console.log(err);
        res.status(500).json({error: "Failed to fetch threads"});
    }
});

// Get single thread
router.get("/thread/:threadId", verifyToken, async(req, res) => {
    const {threadId} = req.params;
    try {
        const thread = await Thread.findOne({ threadId, userId: req.userId });
        if(!thread) return res.status(404).json({error: "Thread not found"});
        res.json(thread.messages);
    } catch(err) {
        console.log(err);
        res.status(500).json({error: "Failed to fetch chat"});
    }
});

// Delete thread
router.delete("/thread/:threadId", verifyToken, async (req, res) => {
    const {threadId} = req.params;
    try {
        const deletedThread = await Thread.findOneAndDelete({ threadId, userId: req.userId });
        if(!deletedThread) return res.status(404).json({error: "Thread not found"});
        res.status(200).json({success: "Thread deleted successfully"});
    } catch(err) {
        console.log(err);
        res.status(500).json({error: "Failed to delete thread"});
    }
});

// Post chat
router.post("/chat", verifyToken, async(req, res) => {
    const {threadId, message} = req.body;
    if(!threadId || !message) return res.status(400).json({error: "missing required fields"});

    try {
        let thread = await Thread.findOne({ threadId, userId: req.userId });
        if(!thread) {
            thread = new Thread({
                threadId,
                userId: req.userId,
                title: message,
                messages: [{role: "user", content: message}]
            });
        } else {
            thread.messages.push({role: "user", content: message});
        }

        const assistantReply = await getOpenAIAPIResponse(message);
        thread.messages.push({role: "assistant", content: assistantReply});
        thread.updatedAt = new Date();

        await thread.save();
        res.json({reply: assistantReply});
    } catch(err) {
        console.log(err);
        res.status(500).json({error: "something went wrong"});
    }
});

export default router;