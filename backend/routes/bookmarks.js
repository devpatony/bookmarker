const express = require('express');
const { body, validationResult } = require('express-validator');
const axios = require('axios');
const cheerio = require('cheerio');
const Bookmark = require('../models/Bookmark');
const auth = require('../middleware/auth');

const router = express.Router();

// Helper function to fetch title from URL
const fetchTitleFromUrl = async (url) => {
  try {
    const response = await axios.get(url, {
      timeout: 5000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    const $ = cheerio.load(response.data);
    let title = $('title').text().trim();
    
    // Fallback to og:title if regular title is empty
    if (!title) {
      title = $('meta[property="og:title"]').attr('content') || '';
    }
    
    return title || 'Untitled';
  } catch (error) {
    console.error('Error fetching title:', error.message);
    return 'Untitled';
  }
};

// Get all bookmarks with optional search and tag filtering
router.get('/', auth, async (req, res) => {
  try {
    const { q, tags, page = 1, limit = 10 } = req.query;
    
    let query = { user: req.user._id };
    
    // Text search
    if (q) {
      query.$text = { $search: q };
    }
    
    // Tag filtering
    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim().toLowerCase());
      query.tags = { $in: tagArray };
    }

    const bookmarks = await Bookmark.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Bookmark.countDocuments(query);

    res.json({
      bookmarks,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single bookmark
router.get('/:id', auth, async (req, res) => {
  try {
    const bookmark = await Bookmark.findOne({ 
      _id: req.params.id, 
      user: req.user._id 
    });

    if (!bookmark) {
      return res.status(404).json({ message: 'Bookmark not found' });
    }

    res.json(bookmark);
  } catch (error) {
    console.error(error);
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Bookmark not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Create bookmark
router.post('/', [
  auth,
  body('url').trim().notEmpty().withMessage('URL is required').isURL().withMessage('Please enter a valid URL'),
  body('title').optional().trim().isLength({ max: 200 }).withMessage('Title must be less than 200 characters'),
  body('description').optional().trim().isLength({ max: 500 }).withMessage('Description must be less than 500 characters'),
  body('tags').optional().isArray().withMessage('Tags must be an array'),
  body('isFavorite').optional().isBoolean().withMessage('isFavorite must be a boolean')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let { title, url, description = '', tags = [], isFavorite = false } = req.body;

    // Auto-fetch title if not provided
    if (!title || title.trim() === '') {
      title = await fetchTitleFromUrl(url);
    }

    const bookmark = new Bookmark({
      title,
      url,
      description,
      tags: tags.map(tag => tag.trim().toLowerCase()),
      isFavorite,
      user: req.user._id
    });

    await bookmark.save();
    res.status(201).json(bookmark);
  } catch (error) {
    console.error(error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Update bookmark
router.put('/:id', [
  auth,
  body('url').optional().trim().notEmpty().withMessage('URL cannot be empty').isURL().withMessage('Please enter a valid URL'),
  body('title').optional().trim().isLength({ max: 200 }).withMessage('Title must be less than 200 characters'),
  body('description').optional().trim().isLength({ max: 500 }).withMessage('Description must be less than 500 characters'),
  body('tags').optional().isArray().withMessage('Tags must be an array'),
  body('isFavorite').optional().isBoolean().withMessage('isFavorite must be a boolean')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const updates = req.body;
    if (updates.tags) {
      updates.tags = updates.tags.map(tag => tag.trim().toLowerCase());
    }

    // Auto-fetch title if URL is updated but title is empty
    if (updates.url && (!updates.title || updates.title.trim() === '')) {
      updates.title = await fetchTitleFromUrl(updates.url);
    }

    const bookmark = await Bookmark.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      updates,
      { new: true, runValidators: true }
    );

    if (!bookmark) {
      return res.status(404).json({ message: 'Bookmark not found' });
    }

    res.json(bookmark);
  } catch (error) {
    console.error(error);
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Bookmark not found' });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete bookmark
router.delete('/:id', auth, async (req, res) => {
  try {
    const bookmark = await Bookmark.findOneAndDelete({ 
      _id: req.params.id, 
      user: req.user._id 
    });

    if (!bookmark) {
      return res.status(404).json({ message: 'Bookmark not found' });
    }

    res.json({ message: 'Bookmark deleted successfully' });
  } catch (error) {
    console.error(error);
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Bookmark not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
