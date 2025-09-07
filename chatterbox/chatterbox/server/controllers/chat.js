const Chat = require('../models/Chat');
const Message = require('../models/Message');
const User = require('../models/User');

exports.getChats = async (req, res) => {
  try {
    const chats = await Chat.find({ participants: req.user._id })
      .populate('participants', 'name avatar email')
      .populate('lastMessage')
      .sort({ updatedAt: -1 });
    
    res.json(chats);
  } catch (error) {
    console.error('Error fetching chats:', error);
    res.status(500).json({ message: 'Error fetching chats' });
  }
};

exports.createChat = async (req, res) => {
  try {
    const { participantId } = req.body;
    
    // Check if chat already exists
    let chat = await Chat.findOne({
      participants: { $all: [req.user._id, participantId] }
    });
    
    if (chat) {
      return res.json(chat);
    }
    
    // Create new chat
    chat = new Chat({
      participants: [req.user._id, participantId]
    });
    
    await chat.save();
    await chat.populate('participants', 'name avatar email');
    
    res.status(201).json(chat);
  } catch (error) {
    console.error('Error creating chat:', error);
    res.status(500).json({ message: 'Error creating chat' });
  }
};

exports.getChat = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id)
      .populate('participants', 'name avatar email')
      .populate('lastMessage');
    
    if (!chat || !chat.participants.some(p => p._id.toString() === req.user._id.toString())) {
      return res.status(404).json({ message: 'Chat not found' });
    }
    
    res.json(chat);
  } catch (error) {
    console.error('Error fetching chat:', error);
    res.status(500).json({ message: 'Error fetching chat' });
  }
};

exports.deleteChat = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id);
    
    if (!chat || !chat.participants.includes(req.user._id)) {
      return res.status(404).json({ message: 'Chat not found' });
    }
    
    await Chat.findByIdAndDelete(req.params.id);
    await Message.deleteMany({ chat: req.params.id });
    
    res.json({ message: 'Chat deleted successfully' });
  } catch (error) {
    console.error('Error deleting chat:', error);
    res.status(500).json({ message: 'Error deleting chat' });
  }
};



