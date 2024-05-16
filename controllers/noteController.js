const Note = require("../models/note");
const Author = require("../models/author");
const Language = require("../models/language");
const Component = require("../models/component");

const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const language = require("../models/language");
const component = require("../models/component");


// Display Site Home Page (Index)
exports.index = asyncHandler(async (req, res, next) => {
  // Get count of Notes, Authors, Languages, Components, in parallel 
  const [
    numNotes,
    numAuthors,
    numLanguages,
    numComponents,
  ] = await Promise.all([
    Note.countDocuments({}).exec(),
    Author.countDocuments({}).exec(),
    Language.countDocuments({}).exec(),
    Component.countDocuments({}).exec(),
  ]);

  res.render("index", {
    title: "Coding Notes: Quick Reference Guide",
    note_count: numNotes,
    author_count: numAuthors,
    language_count: numLanguages,
    component_count: numComponents,
  });

  // Superseded Code
  // res.send("NOT IMPLEMENTED: Site Home Page");
});


// Display List of all Notes
exports.note_list = asyncHandler(async (req, res, next) => {
  const allNotes = await Note.find({}, "title author") // Returns two (2) Data Fields, title and author
    .sort({ title: 1 })
    .populate("author")
    .exec();

  // Calls note_list (.pug) View template
  // Title in this code-block refers to webpage Title
  res.render("note_list", { title: "Note List", note_list: allNotes });

  // Superseded Code
  // res.send("NOT IMPLEMENTED: Note List");
});


// Display Detail Page for specified Note
exports.note_detail = asyncHandler(async (req, res, next) => {
  // Get details specified Note
  const note = await Note.findById(req.params.id).populate("author").populate("language").exec();

  if (note === null) {
    // No Note is returned
    const err = new Error("Note not found.");
    err.status = 404;
    return next(err);
  }

  res.render("note_detail", {
    title: note.title,
    note: note,
  });

  // Superseded Code
  // res.send(`NOT IMPLEMENTED: Note Detail: ${req.params.id}`);
});


// Display Note Create Form on GET Request
exports.note_create_get = asyncHandler(async (req, res, next) => {
  // Get all Authors and Languages, as Drop-Down Menu
  const [allAuthors, allLanguages, allComponents] = await Promise.all([
    Author.find().sort({ family_name: 1 }).exec(),
    Language.find().sort({ name: 1 }).exec(),
    Component.find().sort({ name: 1 }).exec(),
  ]);

  res.render("note_form", {
    title: "Create Note",
    authors: allAuthors,
    languages: allLanguages,
    components: allComponents,
  });

  // Superseded Code
  // res.send("NOT IMPLEMENTED: Note Create on GET Request");
});


// Handle Note Create on POST Request
exports.note_create_post = [
  // Convert Language to an Array
  (req, res, next) => {
    if (!Array.isArray(req.body.language)) {
      req.body.language = typeof req.body.language === "undefined" ? [] : [req.body.language];
    }
    next();
  },

  // Validate and sanitize data
  body("title", "Title must be populated.")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body("author", "Author must be populated.")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body("summary", "Summary must be populated.")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body("text", "Text must be populated.")
    .trim()
    .isLength({ min: 10 })
    .escape(),
  body("language.*").escape(),
  body("component.*").escape(),
  body("date_created", "Date Created must be populated.")
    .isISO8601()
    .toDate(),

  // Process Request after Validation
  asyncHandler(async (req, res, next) => {
    // Extract Validation Errors from a Request
    const errors = validationResult(req);

    // Create Note Object with Escaped and Trimmed Data
    const note = new Note({
      title: req.body.title,
      author: req.body.author,
      summary: req.body.summary,
      text: req.body.text,
      language: req.body.language,
      component: req.body.component,
      date_created: req.body.date_created,
    });

    if (!errors.isEmpty()) {
      // Errors are present; re-Render Form with Validation Errors
      // Get all Authors, Languages, Components for Form
      const [allAuthors, allLanguages, allComponents] = await Promise.all([
        Author.find().sort({ family_name: 1 }).exec(),
        Language.find().sort({ name: 1 }).exec(),
        Component.find().sort({ name: 1 }).exec(),
      ]);

      // Mark selected Languages as checked
      for (const language of allLanguages) {
        if (note.language.includes(language._id)) {
          language.checked = "true";
        }
      }

      // Mark selected Components as checked
      for (const component of allComponents) {
        if (note.component.includes(component._id)) {
          component.checked = "true";
        }
      }

      res.render("note_form", {
        title: "Create Note",
        authors: allAuthors,
        languages: allLanguages,
        components: allComponents,
        note: note,
        errors: errors.array(),
      });
    } else {
      // Form Data is valid; save new Note
      await note.save();
      res.redirect(note.url);
    }
  }),
];

// Superseded Code
// exports.note_create_post = asyncHandler(async (req, res, next) => {
//   res.send("NOT IMPLEMENTED: Note Create on POST Request");
// });


// Display Note Delete Form on GET Request
exports.note_delete_get = asyncHandler(async (req, res, next) => {
  const note = await Note.findById(req.params.id)
    .populate("title").populate("language").populate("component")
    .exec();

  if (note === null) {
    // Selected Note is not present; Re-Direct to list of all Notes
    res.redirect("/catalog/notes");
  }

  res.render("note_delete", {
    title: "Delete Selected Note",
    note: note,
  });

  // Superseded Code
  // res.send("NOT IMPLEMENTED: Note Delete on POST Request");
});


// Handle Note Delete on POST Request
exports.note_delete_post = asyncHandler(async (req, res, next) => {
  await Note.findByIdAndDelete(req.params.id)
  res.redirect("/catalog/notes");

  // Superseded Code
  // res.send("NOT IMPLEMENTED: Note Delete on POST Request");
});


// Display Note Update Form on GET Request
exports.note_update_get = asyncHandler(async (req, res, next) => {
  // Get Note, Authors (all), Languages (all), Components (all) for Form
  const [note, allLanguages, allComponents] = await Promise.all([
    Note.findById(req.params.id).populate("author").exec(),
    Author.find().sort({ family_name: 1 }).exec(),
    Language.find().sort({ name: 1 }).exec(),
    Component.find().sort({ name: 1 }).exec(),
  ]);

  if (note === null) {
    // No Note is returned
    const err = new Error("Note not found.");
    err.status = 404;
    return next(err);
  }

  // Mark selected Languages as checked
  allLanguages.forEach((language) => {
    if (note.language.includes(language._id)) language.checked = "true";
  });

  // Mark selected Components as checked
  allComponents.forEach((component) => {
    if (note.component.includes(component._id)) component.checked = "true";
  });

  res.render("note_form", {
    title: "Update Note",
    authors: allAuthors,
    languages: allLanguages,
    components: allComponents,
    note: note,
  });

  // Superseded Code
  // res.send("NOT IMPLEMENTED: Note Update on GET Request");
});


// Handle Note Update on POST Request
exports.note_update_post = [
  // Convert Language to an Array
  (req, res, next) => {
    if (!Array.isArray(req.body.language)) {
      req.body.language = 
        typeof req.body.language === "undefined" ? [] : [req.body.language];
    }
    next();
  },

  // Validate Data Fields
  body("title", "Title must be populated.")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body("author", "Author must be populated.")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body("summary", "Summary must be populated.")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body("text", "Text must be populated.")
    .trim()
    .isLength({ min: 10 })
    .escape(),
  body("language.*").escape(),
  body("component.*").escape(),
  body("date_created", "Date Created must be populated.")
    .isISO8601()
    .toDate(),

  // Process Request after Validation
  asyncHandler(async (req, res, next) => {
    // Extract Validation Errors from Request
    const errors = validationResult(req);

    // Create Note Object with Escaped and Trimmed data and existing ID
    const note = new Note({
      title: req.body.title,
      author: req.body.author,
      summary: req.body.summary,
      text: req.body.text,
      language: typeof req.body.language === "undefined" ? [] : req.body.language,
      component: typeof req.body.component === "undefined" ? [] : req.body.component,
      date_created: req.body.date_created,
      _id: req.params.id, // Required or new ID will be assigned
    });

    if (!errors.isEmpty()) {
      // Errors are present; re-Render Form with Validation Error Messages
      
      // Get all Authors, Languages, Components for Form
      const [allAuthors, allLanguages, allComponents] = await Promise.all([
        Author.find().sort({ family_name: 1 }).exec(),
        Language.find().sort({ name: 1 }).exec(),
        Component.find().sort({ name: 1 }).exec(),
      ]);

      // Mark selected Languages as Checked
      for (const language of allLanguages) {
        if (note.language.indexOf(language._id) > -1) {
          language.checked = "true";
        }
      }

      // Mark selected Components as Checked
      for (const component of allComponents) {
        if (note.component.indexOf(component._id) > -1) {
          language.checked = "true";
        }
      }

      res.render("note_form", {
        title: "Update Note",
        authors: allAuthors,
        languages: allLanguages,
        components: allComponents,
        note: note,
        errors: errors.array(),
      });
      return;
    } else {
      // Data is valid; update Note record
      const updatedNote = await Note.findByIdAndUpdate(req.params.id, note, {});
      
      // Redirect to Note Detail page
      res.redirect(updatedNote.url);
    }
  }),
];

// Superseded Code
// exports.note_update_post = asyncHandler(async (req, res, next) => {
//   res.send("NOT IMPLEMENTED: Note Update on POST Request");
// });

