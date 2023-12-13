import { ObjectId } from 'mongodb'
let contacts

export default class ContactsDAO {
    static async injectDB(conn) {
        if (contacts) {
            return
        }
        try {
            contacts = await conn.db(process.env.QVIKS_DB).collection('contacts')
        }
        catch (e) {
            console.error(`unable to connect in ContactsDAO: ${e}`)
        }
    }


    static async getContacts({
        filters = null,
        page = 0,
        contactsPerPage = 20,
    } = {}) {
        let query

        if (filters) {
            if ("name" in filters) {
                query = { $text: { $search: filters['name'] } }
            }
        }
        let cursor
        try {
            cursor = await contacts
                .find(query)
                .limit(contactsPerPage)
                .skip(contactsPerPage * page)
            const contactsList = await cursor.toArray()
            const totalNumContacts = await contacts.countDocuments(query)
            return { contactsList, totalNumContacts }
        } catch (e) {
            console.error(`Unable to issue find command, ${e}`)
            return { contactsList: [], totalNumContacts: 0 }
        }
    }

    // TODO
    // static async getCategories() {
    //     let categories = []
    //     try {
    //         categories = await contacts.distinct("category")
    //         return categories
    //     } catch (e) {
    //         console.error(`unable to get categories, $(e)`)
    //         return categories
    //     }
    // }

    static async getContactById(id) {
        try {
            return await contacts.aggregate([
                {
                    $match: { _id: new ObjectId(id) }
                },

                // TODO
                // {
                //     $lookup: {
                //         from: 'foreingCollection',
                //         localField: '_id',
                //         foreignField: 'contact_id',
                //         as: 'foreingCollection'
                //     }
                // }
            ]).next()
        } catch (e) {
            console.error(`something went wrong in getContactById: ${e}`)
            throw e
        }
    }


    static async addContact(name, date) {
        try {
            const contactDoc = {
                name: name,
                date: date,
            };
            return await contacts.insertOne(contactDoc);
        } catch (e) {
            console.error(`unable to post review: ${e}`);
            return { error: e };
        }
    }

    static async updateContact(contactId, name, lastUpdate) {
        try {
            const updateContactResponse = await contacts.updateOne(
                { _id: new ObjectId(contactId) },
                { $set: { name: name, lastUpdate: lastUpdate } }
            );
            return updateContactResponse;
        } catch (e) {
            console.error(`unable to update review: ${e}`);
            return { error: e };
        }
    }

    static async deleteContact(contactId) {
        try {
            const deleteResponse = await contacts.deleteOne({ _id: new ObjectId(contactId) });
            return deleteResponse;
        } catch (e) {
            console.error(`unable to delete review: ${e}`);
            return { error: e };
        }
    }


}