import express from 'express';
import cors from 'cors';
import contactsRouter from './api/contacts.route.js';
import mongodb from "mongodb"
import dotenv from "dotenv"
import ContactsDAO from './api/contactsDAO.js'

async function main() {

  dotenv.config()

  const client = new mongodb.MongoClient(process.env.DB_URI)
  const port = process.env.PORT
  const url = process.env.URL

  try {
    await client.connect()
    await ContactsDAO.injectDB(client)

    const app = express();
    app.use(cors());
    app.use(express.json());
    app.use(url, contactsRouter);
    app.use('*', (req, res) => {
      res.status(404).json({ error: "not found" })
    })

    app.listen(port, () => {
      console.log('server is running on port:' + port);
    })

  }
  catch (e) {
    console.error(e);
    process.exit(1)
  }
}

main().catch(console.error);
