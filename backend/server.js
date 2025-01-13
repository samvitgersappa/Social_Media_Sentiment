import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const app = express();
const PORT = 3000;
const JWT_SECRET = 'your-secret-key';

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'hello123#@',
  database: 'Social_Media',
  waitForConnections: true,
  connectionLimit: 10
});

app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log('Request body:', req.body);
  next();
});

// Add this endpoint to fetch posts
app.get('/api/posts', async (req, res) => {
  const connection = await pool.getConnection();

  try {
    const [posts] = await connection.query(`
      SELECT p.post_id, p.content AS caption, p.image_url AS imageUrl, u.username, u.name, u.email
      FROM Post p
      JOIN User u ON p.p_user_id = u.user_id
      ORDER BY p.created_at DESC
    `);

    const postIds = posts.map(post => post.post_id);
    const [comments] = await connection.query(`
      SELECT c.comment_id AS id, c.post_id, c.text, c.created_at AS timestamp, u.username
      FROM Comment c
      JOIN User u ON c.user_id = u.user_id
      WHERE c.post_id IN (?)
      ORDER BY c.created_at ASC
    `, [postIds]);

    const postsWithComments = posts.map(post => ({
      ...post,
      comments: comments.filter(comment => comment.post_id === post.post_id)
    }));

    res.status(200).json({
      success: true,
      posts: postsWithComments
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch posts'
    });
  } finally {
    connection.release();
  }
});

// Login endpoint
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const connection = await pool.getConnection();

  try {
    const [users] = await connection.query(
      'SELECT * FROM User WHERE email = ?',
      [email]
    );

    console.log('Login attempt for:', email);

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    const user = users[0];
    const isValidPassword = await bcrypt.compare(password, user.password);

    console.log('Password validation:', { isValid: isValidPassword });

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    const token = jwt.sign(
      { userId: user.user_id, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user.user_id,
        email: user.email,
        username: user.username
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Authentication failed'
    });
  } finally {
    connection.release();
  }
});

// Signup endpoint
app.post('/api/auth/signup', async (req, res) => {
  const { email, password, name, username, dob } = req.body;
  const connection = await pool.getConnection();

  try {
    const [existing] = await connection.query(
      'SELECT * FROM User WHERE email = ? OR username = ?',
      [email, username]
    );

    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Email or username already exists'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const birthDate = new Date(dob);
    const age = new Date().getFullYear() - birthDate.getFullYear();

    const [result] = await connection.query(
      'INSERT INTO User (email, password, name, username, dob, age) VALUES (?, ?, ?, ?, ?, ?)',
      [email, hashedPassword, name, username, dob, age]
    );

    const token = jwt.sign(
      { userId: result.insertId, email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      success: true,
      token,
      user: {
        id: result.insertId,
        email,
        username
      }
    });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create account'
    });
  } finally {
    connection.release();
  }
});

// Post creation endpoint
app.post('/api/posts', async (req, res) => {
  const { imageUrl, caption, userId, mentions, hashtags } = req.body;
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [userExists] = await connection.query(
      'SELECT user_id FROM User WHERE user_id = ?',
      [userId]
    );

    if (userExists.length === 0) {
      throw new Error('User not found');
    }

    const [postResult] = await connection.query(
      'INSERT INTO Post (content, image_url, p_user_id) VALUES (?, ?, ?)',
      [caption, imageUrl, userId]
    );

    const postId = postResult.insertId;

    if (hashtags?.length > 0) {
      for (const tag of hashtags) {
        const [hashtagResult] = await connection.query(
          'INSERT INTO Hashtag (text) VALUES (?) ON DUPLICATE KEY UPDATE hashtag_id=LAST_INSERT_ID(hashtag_id)',
          [tag.slice(1)]
        );

        await connection.query(
          'INSERT INTO Post_Hashtag (post_id, hashtag_id) VALUES (?, ?)',
          [postId, hashtagResult.insertId]
        );
      }
    }

    if (mentions?.length > 0) {
      for (const mention of mentions) {
        const [mentionedUser] = await connection.query(
          'SELECT user_id FROM User WHERE username = ?',
          [mention.slice(1)]
        );

        if (mentionedUser.length > 0) {
          await connection.query(
            'INSERT INTO Post_Mention (post_id, user_id) VALUES (?, ?)',
            [postId, mentionedUser[0].user_id]
          );
        }
      }
    }

    await connection.commit();
    res.status(200).json({
      success: true,
      message: 'Post created successfully',
      postId
    });

  } catch (error) {
    await connection.rollback();
    console.error('Post creation error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to create post'
    });
  } finally {
    connection.release();
  }
});

// Add this endpoint to handle adding comments
app.post('/api/posts/:postId/comments', async (req, res) => {
  const { postId } = req.params;
  const { userId, text, mentions, hashtags } = req.body;
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [userExists] = await connection.query(
      'SELECT user_id FROM User WHERE user_id = ?',
      [userId]
    );

    if (userExists.length === 0) {
      throw new Error('User not found');
    }

    const [postExists] = await connection.query(
      'SELECT post_id FROM Post WHERE post_id = ?',
      [postId]
    );

    if (postExists.length === 0) {
      throw new Error('Post not found');
    }

    const [commentResult] = await connection.query(
      'INSERT INTO Comment (post_id, user_id, text) VALUES (?, ?, ?)',
      [postId, userId, text]
    );

    const commentId = commentResult.insertId;

    if (hashtags?.length > 0) {
      for (const tag of hashtags) {
        const [hashtagResult] = await connection.query(
          'INSERT INTO Hashtag (text) VALUES (?) ON DUPLICATE KEY UPDATE hashtag_id=LAST_INSERT_ID(hashtag_id)',
          [tag.slice(1)]
        );

        await connection.query(
          'INSERT INTO Comment_Hashtag (comment_id, hashtag_id) VALUES (?, ?)',
          [commentId, hashtagResult.insertId]
        );
      }
    }

    if (mentions?.length > 0) {
      for (const mention of mentions) {
        const [mentionedUser] = await connection.query(
          'SELECT user_id FROM User WHERE username = ?',
          [mention.slice(1)]
        );

        if (mentionedUser.length > 0) {
          await connection.query(
            'INSERT INTO Comment_Mention (comment_id, user_id) VALUES (?, ?)',
            [commentId, mentionedUser[0].user_id]
          );
        }
      }
    }

    await connection.commit();
    res.status(200).json({
      success: true,
      message: 'Comment added successfully',
      commentId
    });

  } catch (error) {
    await connection.rollback();
    console.error('Comment creation error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to add comment'
    });
  } finally {
    connection.release();
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

process.on('unhandledRejection', (error) => {
  console.error('Unhandled promise rejection:', error);
  process.exit(1);
});