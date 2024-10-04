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

        // Get a list of all databases
        const databases = await client.db().admin().listDatabases();
        
        const allResults = [];

        // Iterate through each database
        for (const db of databases.databases) {
            const database = client.db(db.name);
            const collections = await database.listCollections().toArray();
            
            // Iterate through each collection in the database
            for (const collection of collections) {
                const coll = database.collection(collection.name);
                const results = await coll.find({ name: { $regex: searchTerm, $options: 'i' } }).toArray(); // Adjust query as needed
                allResults.push({ collection: collection.name, results });
            }
        }

        // Return all search results
        return res.status(200).json(allResults);
    } catch (error) {
        // Handle errors
        return res.status(500).json({ error: error.message });
    } finally {
        // Close the database connection
        await client.close();
    }
};
