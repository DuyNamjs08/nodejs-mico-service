// const mongoose = require("mongoose");

// const connectDB = async () => {
//   try {
//     const uri = process.env.MONGODB_URL;
//     if (!uri) {
//       throw new Error("❌ MONGODB_URL is not defined in environment variables");
//     }

//     await mongoose.connect(uri);

//     console.log("✅ MongoDB connected!");
//   } catch (err) {
//     console.error("❌ MongoDB connection error:", err);
//     process.exit(1);
//   }
// };

// module.exports = connectDB;

// =======================================================
const mongoose = require('mongoose');
require('dotenv').config();
const { Client } = require('@elastic/elasticsearch');
const { prepareForEs } = require('../helpers');
const esClient = new Client({
  node: process.env.ELASTICSEARCH_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URL;
    if (!uri) {
      throw new Error('❌ MONGODB_URL is not defined in environment variables');
    }
    await mongoose.connect(uri);
    console.log('✅ MongoDB connected!');
    initialSync();
    const db = mongoose.connection.db;
    const changeStream = db.watch([], { fullDocument: 'updateLookup' });
    changeStream.on('change', async (change) => {
      const ns = change.ns; // namespace: { db: 'yourDB', coll: 'users' }
      const indexName = ns.coll.toLowerCase(); // dùng tên collection làm index
      const docId = change.documentKey._id.toString();

      switch (change.operationType) {
      case 'insert':
      case 'update':
      case 'replace':
        const doc = change.fullDocument;
        if (!doc) {
          console.warn(`⚠️ No fullDocument in change event for ${indexName}`);
          return;
        }
        const docForEs = prepareForEs(change.fullDocument);
        await esClient.index({
          index: indexName,
          id: docId,
          body: docForEs,
        });
        console.log(`📤 Synced ${indexName}: ${docId}`);
        break;

      case 'delete':
        await esClient.delete({
          index: indexName,
          id: docId,
        });
        console.log(`❌ Deleted from ${indexName}: ${docId}`);
        break;
      }
    });
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};
async function initialSync() {
  try {
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();

    for (const collectionInfo of collections) {
      const collectionName = collectionInfo.name;
      const indexName = collectionName.toLowerCase();
      const collection = db.collection(collectionName);

      // Kiểm tra index có tồn tại trong ES không
      const { body: exists } = await esClient.indices.exists({
        index: indexName,
      });
      if (!exists) {
        await esClient.indices.create({ index: indexName });
      }

      // Đồng bộ toàn bộ dữ liệu
      const cursor = collection.find({});
      while (await cursor.hasNext()) {
        const doc = await cursor.next();
        const docForEs = prepareForEs(doc);
        await esClient.index({
          index: indexName,
          id: doc._id.toString(),
          body: docForEs,
        });
      }
      console.log(`🔄 Initial sync completed for ${indexName}`);
    }
  } catch (error) {
    console.error('❌ Initial sync error:', error);
  }
}

module.exports = connectDB;
