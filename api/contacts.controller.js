import ContactsDAO from './contactsDAO.js';

export default class ContactsController {
    static async apiGetContacts(req, res, next) {
        const contactsPerPage = req.query.contactsPerPage ? parseInt(req.query.contactsPerPage) : 20;
        const page = req.query.page ? parseInt(req.query.page) : 0;
        let filters = {};

        if (req.query.rated) {
            filters.rated = req.query.rated;
        } else if (req.query.name) {
            filters.name = req.query.name;
        }

        const { contactsList, totalNumContacts } = await ContactsDAO.getContacts({ filters, page, contactsPerPage });

        let response = {
            contacts: contactsList,
            page: page,
            filters: filters,
            entries_per_page: contactsPerPage,
            total_results: totalNumContacts,
        };

        res.json(response);
    }

    static async apiGetContactById(req, res, next) {
        try {
            let id = req.params.id || {};
            let contact = await ContactsDAO.getContactById(id);
            if (!contact) {
                res.status(404).json({ error: "not found" });
                return;
            }
            res.json(contact);
        } catch (e) {
            console.log(`api, ${e}`);
            res.status(500).json({ error: e });
        }
    }

    static async apiGetRatings(req, res, next) {
        try {
            let propertyTypes = await ContactsDAO.getRatings();
            res.json(propertyTypes);
        } catch (e) {
            console.log(`api,${e}`);
            res.status(500).json({ error: e });
        }
    }


    static async apiPostContact(req, res) {
        console.log(req.body);
        try {
            const name = req.body.name;
            const date = new Date();
            const ContactResponse = await ContactsDAO.addContact(
                name,
                date
            );
            res.json({ status: "success " });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }


    static async apiUpdateContact(req, res) {
        try {
            const contactId = req.body.id;
            const contact = req.body.name;
            const lastUpdate = new Date();
            const ContactResponse = await ContactsDAO.updateContact(
                contactId,
                contact,
                lastUpdate
            );
            let { error } = ContactResponse;
            if (error) {
                res.status(500).json({ error: error.message });
            }
            // if (ContactResponse.modifiedCount === 0) {
            //     throw new Error("unable to update contact. User may not be original poster");
            // }
            res.json({ status: "success " });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

    static async apiDeleteContact(req, res, next) {
        console.log(req.body);
        try {
            const contactId = req.body.id;        
            const ContactResponse = await ContactsDAO.deleteContact(contactId);
            res.json({ status: "success" });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }



}
