const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connection = require('./db');  // Import the MySQL connection from db.js

const app = express();
app.use(cors());
app.use(bodyParser.json());

// CREATE: Upload image information to the database
app.post('/upload', async (req, res) => {
  console.log('Received request:', req.body);  // Log the request body

  const { imagePath, userId, deviceId } = req.body;
  const query = 'INSERT INTO images (image_path, user_id, device_id) VALUES (?, ?, ?)';

  try {
    const [result] = await connection.query(query, [imagePath, userId, deviceId]);
    console.log('Query result:', result);  // Log the result of the query
    res.status(201).send(`Image uploaded successfully with ID: ${result.insertId}`);
  } catch (err) {
    console.error('Error inserting data:', err);  // Log the error
    res.status(500).send('Database error');
  }
});

// READ: Get image information by ID
app.get('/images/:id', async (req, res) => {
    console.log('Received GET request:', req.params);  // Log the request params
  
    const { id } = req.params;  // Extract the image ID from the URL
    const query = 'SELECT * FROM images WHERE image_id = ?';
  
    try {
      // Add a timeout to prevent hanging queries
      const [result] = await Promise.race([
        connection.query(query, [id]),  // Execute the query
        new Promise((_, reject) => setTimeout(() => reject(new Error('Query timed out')), 5000))  // Timeout after 5 seconds
      ]);
  
      console.log('Query result:', result);  // Log the query result
  
      if (result.length === 0) {
        return res.status(404).send('Image not found');  // Send 404 if no rows were found
      }
  
      res.status(200).json(result[0]);  // Send the image data as JSON
    } catch (err) {
      console.error('Error fetching data:', err);  // Log any errors
      res.status(500).send('Database error or timeout');  // Send error response
    }
  });

// READ: Get image information by ID
app.post('/upload', async (req, res) => {
    console.log('Received request:', req.body);  // Log the request body
  
    const { imagePath, userId, deviceId } = req.body;
    const query = 'INSERT INTO images (image_path, user_id, device_id) VALUES (?, ?, ?)';
  
    try {
      const [result] = await connection.query(query, [imagePath, userId, deviceId]);
      console.log('Query result:', result);  // Log the result of the query
      res.status(201).send(`Image uploaded successfully with ID: ${result.insertId}`);
    } catch (err) {
      console.error('Error inserting data:', err);  // Log the error
      res.status(500).send('Database error');
    }
  });

// UPDATE: Update image information by ID
app.put('/images/:id', async (req, res) => {
    console.log('Received PUT request:', req.params, req.body);  // Log the request params and body
  
    const { id } = req.params;  // Extract the image ID from the URL
    const { imagePath, userId, deviceId } = req.body;  // Extract data from the request body
    const query = 'UPDATE images SET image_path = ?, user_id = ?, device_id = ? WHERE image_id = ?';
  
    try {
      // Add a timeout to prevent hanging queries, like we did with POST
      const [result] = await Promise.race([
        connection.query(query, [imagePath, userId, deviceId, id]),  // Execute the query
        new Promise((_, reject) => setTimeout(() => reject(new Error('Query timed out')), 5000))  // Timeout after 5 seconds
      ]);
  
      console.log('Query result:', result);  // Log the result of the query
  
      if (result.affectedRows === 0) {
        return res.status(404).send('Image not found');  // Send 404 if no rows were affected
      }
  
      res.status(200).send('Image information updated successfully');  // Send success response
    } catch (err) {
      console.error('Error updating data:', err);  // Log any errors
      res.status(500).send('Database error or timeout');  // Send error response
    }
  });

// DELETE: Delete image information by ID
app.delete('/images/:id', async (req, res) => {
    console.log('Received DELETE request:', req.params);  // Log the request params
  
    const { id } = req.params;  // Extract the image ID from the URL
    const query = 'DELETE FROM images WHERE image_id = ?';
  
    try {
      // Add a timeout to prevent hanging queries
      const [result] = await Promise.race([
        connection.query(query, [id]),  // Execute the query
        new Promise((_, reject) => setTimeout(() => reject(new Error('Query timed out')), 5000))  // Timeout after 5 seconds
      ]);
  
      console.log('Query result:', result);  // Log the result of the query
  
      if (result.affectedRows === 0) {
        return res.status(404).send('Image not found');  // Send 404 if no rows were affected
      }
  
      res.status(200).send('Image deleted successfully');  // Send success response
    } catch (err) {
      console.error('Error deleting data:', err);  // Log any errors
      res.status(500).send('Database error or timeout');  // Send error response
    }
  });

// Listen on port 3000
app.listen(3000, () => {
  console.log('Server running on port 3000...');
});