const Language = require("../models/language");
const Note = require("../models/note");

const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");


// Display List of all Languages
exports.language_list = asyncHandler(async (req, res, next) => {
  const allLanguages = await Language.find().sort({ name: 1 }).exec();
  res.render("language_list", {
    title: "Language List",
    language_list: allLanguages,
  });

  // Superseded Code
  // res.send("NOT IMPLEMENTED: Language List");
});


// Display Detail Page for specified Language
exports.language_detail = asyncHandler(async (req, res, next) => {
  // Get Language Details and all associated Notes (in parallel)
  const [language, notesInLanguage] = await Promise.all([
    Language.findById(req.params.id).exec(),
    Note.find({ language: req.params.id }, "note summary").exec(),
  ]);
  if (language === null) {
    // No Languages are returned
    const err = new Error("Language not found.");
    err.status = 404;
    return next(err);
  }

  res.render("language_detail", {
    title: "Langugage Detail",
    language: language,
    language_notes: notesInLanguage,
  });

  // Superseded Code
  // res.send(`NOT IMPLEMENTED: Language Detail: ${req.params.id}`);
});


// Display Language Create Form on GET Request
exports.language_create_get = (req, res, next) => {
  res.render("language_form", { title: "Create Language" });
};

// Superseded Code
// exports.language_create_get = asyncHandler(async (req, res, next) => {
//   res.send("NOT IMPLEMENTED: Language Create on GET Request");
// });


// Handle Language Create on POST Request
exports.language_create_post = [
  // Validate Name data field
  body("name", "Language Name must contain at least two (2) characters.")
    .trim()
    .isLength({ min: 2 })
    .escape(),
  body("description")
    .trim()
    .isLength({ min: 10 })
    .escape()
    .withMessage("Description must be specified."),

  // Process request after Validation
  asyncHandler(async (req, res, next) => {
    // Extract Validation Errors from request
    const errors = validationResult(req);

    // Create Language Object with escaped and trimmed data
    const language = new Language({ 
      name: req.body.name,
      description: req.body.description,
     });

    if (!errors.isEmpty()) {
      // There are Errors, re-Render Form with Error Messages
      res.render("language_form", {
        title: "Create Language",
        language: language,
        errors: errors.array(),
      });
      return;
    } else {
      // Data is Valid
      // Confirm Language does not already exist
      const languageExists = await Language.findOne({ name: req.body.name }).exec();
      if (languageExists) {
        res.redirect(languageExists.url);
      } else {
        await language.save();
        // New Language saved, redirect to Language Details page
        res.redirect(language.url);
      }
    }
  }),
];

// Superseded Code
// exports.language_create_post = asyncHandler(async (req, res, next) => {
//   res.send("NOT IMPLEMENTED: Language Create on POST Request");
// });


// Display Language Delete Form on GET Requeset
exports.language_delete_get = asyncHandler(async (req, res, next) => {
  const language = await Language.findById(req.params.id)
    .populate("name")
    .exec();

  if (language === null) {
    // Selected Language is not present; Re-Direct to list of all Languages
    res.redirect("/catalog/languages");
  }
  
  res.render("language_delete", {
    title: "Delete Selected Language",
    language: language,
  });

  // Superseded Code
  // res.send("NOT IMPLEMENTED: Language Delete on GET Request");
});


// Handle Language Delete on POST Request
exports.language_delete_post = asyncHandler(async (req, res, next) => {
  await Language.findByIdAndDelete(req.params.id);
  res.redirect("/catalog/languages");

  // Superseded Code
  // res.send("NOT IMPLEMENTED: Language Delete on POST Request");
});


// Display Language Update Form on GET Request
exports.language_update_get = asyncHandler(async (req, res, next) => {
  const [language, allNotesWithLanguage] = await Promise.all([
    Language.findById(req.params.id).exec(),
    Note.find({ language: req.params.id }, "title summary").exec(),
  ]);

  if (language === null) {
    // Selected Language is not present
    const err = new Error("Language not found.");
    err.status = 404;
    return next(err);
  }

  res.render("language_form", {
    title: "Update Language",
    notes: allNotesWithLanguage,
  });

  // Superseded Code
  // res.send("NOT IMPLEMENTED: Language Update on GET Request");
});


// Handle Language Update on POST Request
exports.language_update_post = [
  body("name", "Language Name must contain at least two (2) characters.")
    .trim()
    .isLength({ min: 2 })
    .escape(),
  body("description", "Description must be specified.")
    .trim()
    .isLength({ min: 10 })
    .escape(),

  // Process Request after Data Validation
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    // Create Language Object with formatted Data and EXISTING ID
    const language = new Language({
      name: req.body.name,
      description: req.body.description,
      _id: req.params.id,  // Required or NEW ID will be assigned!
    });

    if (!errors.isEmpty()) {
      // Errors are present; Re-Render Form with Error Messages
      res.render("language_form", {
        title: "Update Language",
        note: allNotesWithLanguage,
        errors: errors.array(),
      });
      return
    } else {
      // Data is Valid; Update Component record
      const updatedLanguage = await Language.findByIdAndUpdate(req.params.id, language, {});
      // Re-Direct to Language Detail page
      res.redirect(updatedLanguage.url);
    }
  }),
];

// Superseded Code
// exports.language_update_post = asyncHandler(async (req, res, next) => {
//   res.send("NOT IMPLEMENTED: Language Update on POST Request");
// });