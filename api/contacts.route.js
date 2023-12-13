import express from 'express'
import ContactsController from './contacts.controller.js'


const router = express.Router() // get access to express router
router.route('/').get(ContactsController.apiGetContacts)
router.route("/id/:id").get(ContactsController.apiGetContactById) 


router
    .route("/contact")
    .post(ContactsController.apiPostContact)
    .put(ContactsController.apiUpdateContact)
    .delete(ContactsController.apiDeleteContact)

export default router