const express = require("express");
const router = express.Router();

// Require Controller Modules
const author_controller = require("../controllers/authorController");
const component_controller = require("../controllers/componentController");
const language_controller = require("../controllers/languageController");
const note_controller = require("../controllers/noteController");


/// NOTE Routes ///

// GET Catalog Home Page
router.get("/", note_controller.index); // Maps to '/catalog/' because Route is imported with '/catalog' prefix

// GET Request to Create a Note
// NOTE: This MUST come before Routes that display individual Notes, using id
router.get("/note/create", note_controller.note_create_get);

// POST Request to Create a Note
router.post("/note/create", note_controller.note_create_post);

// GET Request to Delete a Note
router.get("/note/:id/delete", note_controller.note_delete_get);

// POST Request to Delete a Note
router.post("/note/:id/delete", note_controller.note_delete_post);

// GET Request to Update a Note
router.get("/note/:id/update", note_controller.note_update_get);

// POST Request to Update a Note
router.post("/note/:id/update", note_controller.note_update_post);

// GET Request for Specified Note
router.get("/note/:id", note_controller.note_detail);

// GET Request for List of all Notes
router.get("/notes", note_controller.note_list);


/// AUTHOR Routes ///

// GET Request to Create an Author
// NOTE: This MUST come before Routes that display individual Authors, using id
router.get("/author/create", author_controller.author_create_get);

// POST Request to Create an Author
router.post("/author/create", author_controller.author_create_post);

// GET Request to Delete an Author
router.get("/author/:id/delete", author_controller.author_delete_get);

// POST Request to Delete an Author
router.post("/author/:id/delete", author_controller.author_delete_post);

// GET Request to Update an Author
router.get("/author/:id/update", author_controller.author_update_get);

// POST Request to Update an Author
router.post("/author/:id/update", author_controller.author_update_post);

// GET Request for Specified Author
router.get("/author/:id", author_controller.author_detail);

// GET Request for List of all Authors
router.get("/authors", author_controller.author_list);


/// LANGUAGE Routes ///

// GET Request to Create a Language
// NOTE: This MUST come before Routes that display individual Languages, using id
router.get("/language/create", language_controller.language_create_get);

// POST Requeset to Create a Language
router.post("/language/create", language_controller.language_create_post);

// GET Request to Delete a Language
router.get("/language/:id/delete", language_controller.language_delete_get);

// POST Request to Delete a Language
router.post("/language/:id/delete", language_controller.language_delete_post);

// GET Request to Update a Language
router.get("/language/:id/update", language_controller.language_update_get);

// POST Request to Update a Language
router.post("/language/:id/update", language_controller.language_update_post);

// GET Request for a Specified Language
router.get("/language/:id", language_controller.language_detail);

// GET Request for List of Languages
router.get("/languages", language_controller.language_list);


/// COMPONENT Routes ///

// GET Request to Create a Component
// NOTE: This MUST come before Routes that display individual Components, using id
router.get("/component/create", component_controller.component_create_get);

// POST Request to Create a Component
router.post("/component/create", component_controller.component_create_post);

// GET Request to Delete a Component
router.get("/component/:id/delete", component_controller.component_delete_get);

// POST Request to Delete a Component
router.post("/component/:id/delete", component_controller.component_delete_post);

// GET Request to Update a Component
router.get("/component/:id/update", component_controller.component_update_get);

// POST Request to Update a Component
router.post("/component/:id/update", component_controller.component_update_post)

// GET Request for a Specified Component
router.get("/component/:id", component_controller.component_detail);

// GET Request for List of Components
router.get("/components", component_controller.component_list);

module.exports = router;