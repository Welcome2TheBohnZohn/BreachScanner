// api/search.js
const { MongoClient } = require('mongodb');

// MongoDB connection string
const uri = "mongodb+srv://labradorintelgroup:n2gUTi0VII3Px0qy@cluster0.ywh9j.mongodb.net/";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

exports.handler = async (req, res) => {
    const searchTerm = req.query.term;

    // Check if search term is provided
    if (!searchTerm) {
        return res.status(400).json({ error: 'Search term is required' });
    }

    try {
        // Connect to the MongoDB client
        await client.connect();

        // Specify the 'test' database
        const database = client.db('test'); // Use the database name 'test'
        const collection = database.collection('nyc link'); // Specify the collection name 'nyc link'
        
        // Perform the search query using regex
        const results = await collection.find({ name: { $regex: searchTerm, $options: 'i' } }).toArray(); // Adjust query as needed

        // Return search results
        return res.status(200).json(results);
    } catch (error) {
        // Handle errors
        return res.status(500).json({ error: error.message });
    } finally {
        // Close the database connection
        await client.close();
    }
};
