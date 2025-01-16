import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { exec } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3000;
const JWT_SECRET = 'your-secret-key';

const analyzeSentiment = (text) => {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(__dirname, '../model/analysis.py');
    const venvActivatePath = 'D:/Development/DBMS_EL/venv/Scripts/activate.bat';
    const command = `cmd /c "call ${venvActivatePath} && python ${scriptPath} "${text.replace(/"/g, '\\"')}"`;
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error('Sentiment analysis error:', error);
        reject(error);
      } else {
        console.log('Sentiment analysis result:', stdout);
        resolve(JSON.parse(stdout));
      }
    });
  });
};

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

app.get('/api/posts', async (req, res) => {
  const connection = await pool.getConnection();

  try {
    const [posts] = await connection.query(`
      SELECT p.post_id, p.content AS caption, p.image_url AS imageUrl, u.username, u.name, u.email, sa.scale AS sentimentScore, sa.label AS sentimentLabel,
             (SELECT COUNT(*) FROM likes l WHERE l.post_id = p.post_id) AS likeCount,
             (SELECT COUNT(*) FROM Comment c WHERE c.post_id = p.post_id) AS commentCount
      FROM Post p
      JOIN User u ON p.p_user_id = u.user_id
      LEFT JOIN sentiment_analysis sa ON p.post_id = sa.post_id
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
            'INSERT INTO Mention (post_id, user_id, created_at) VALUES (?, ?, NOW())',
            [postId, mentionedUser[0].user_id]
          );
          console.log(`Mention added for user ${mentionedUser[0].user_id} in post ${postId}`);
        } else {
          console.log(`User ${mention.slice(1)} not found for mention`);
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

app.post('/api/posts/:postId/comments', async (req, res) => {
  const { postId } = req.params;
  const { userId, text } = req.body;
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    await connection.query(
      'INSERT INTO Comment (post_id, user_id, text) VALUES (?, ?, ?)',
      [postId, userId, text]
    );

    console.log('Inserted comment:', { postId, userId, text });

    const [comments] = await connection.query(
      'SELECT c.comment_id AS id, c.post_id, c.text, c.created_at AS timestamp, u.username FROM Comment c JOIN User u ON c.user_id = u.user_id WHERE c.post_id = ? ORDER BY c.created_at ASC',
      [postId]
    );

    await connection.commit();

    // Return the updated comments list immediately
    res.status(201).json({
      success: true,
      comments,
      commentCount: comments.length
    });

    // Run sentiment analysis in the background
    const allCommentsText = comments.map(comment => comment.text).join(' ');
    const sentimentResult = await analyzeSentiment(allCommentsText);
    const sentimentScore = (sentimentResult[0].label === 'POSITIVE' ? 1 : -1) * (sentimentResult[0].score * 5);
    const sentimentLabel = sentimentResult[0].label;

    console.log('Sentiment analysis result:', { postId, sentimentScore, sentimentLabel });

    await connection.query(
      'INSERT INTO sentiment_analysis (post_id, scale, label) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE scale = VALUES(scale), label = VALUES(label)',
      [postId, sentimentScore, sentimentLabel]
    );

    console.log('Inserted/Updated sentiment analysis:', { postId, sentimentScore, sentimentLabel });

  } catch (error) {
    await connection.rollback();
    console.error('Error adding comment:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add comment',
    });
  } finally {
    connection.release();
  }
});

app.post('/api/posts/:postId/like', async (req, res) => {
  const { postId } = req.params;
  const { userId } = req.body;
  const connection = await pool.getConnection();

  try {
    const [existingLike] = await connection.query(`
      SELECT * FROM likes WHERE post_id = ? AND user_id = ?
    `, [postId, userId]);

    if (existingLike.length > 0) {
      await connection.query(`
        DELETE FROM likes WHERE post_id = ? AND user_id = ?
      `, [postId, userId]);
      console.log('Removed like:', { postId, userId });
      res.status(200).json({
        success: true,
        message: 'Post unliked successfully',
        action: 'unliked'
      });
    } else {
      await connection.query(`
        INSERT INTO likes (post_id, user_id)
        VALUES (?, ?)
      `, [postId, userId]);
      console.log('Inserted like:', { postId, userId });
      res.status(201).json({
        success: true,
        message: 'Post liked successfully',
        action: 'liked'
      });
    }
  } catch (error) {
    console.error('Error toggling like:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to toggle like',
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