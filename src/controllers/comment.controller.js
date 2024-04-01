const connection = require('../databases');
const Comments = require('../models/comment.model');


exports.getComments = async (req, res) => {
    const {movieId} = req.params;
    try {
      const comments = await Comments.getComment(movieId);
      res.json(comments);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  exports.getUserComments = async (req, res) => {
    const {movieId} = req.params;
    const user_id= req.userId
    try {
      const comments = await Comments.getUserComment(movieId,user_id);
      res.json(comments);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };

exports.createComment = async (req, res) => {
    const {
      movie_id,
      content,
      rate
    } = req.body;
    const user_id= req.userId
    try {
      const results = await Comments.create(
       user_id,movie_id,content,rate
      );
      res.json(results);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  
  exports.updateComment = async (req, res) => {
    try {
      const {
        id,
        content,
        rate,
        movie_id,
      } = req.body;
  
      const results = await Comments.update(
        id,content,rate,movie_id
      );
  
        res.json(results);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  
  exports.deleteComment = async (req, res) => {
    try {
      const { id,movie_id } = req.body;
      const results = await Comments.delete(id,movie_id);
      res.json(results);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };