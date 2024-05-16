const Author = require("../models/author");
const Note = require("../models/note")

const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");


// Display List of all Authors
exports.author_list = asyncHandler(async (req, res, next) => {
  const allAuthors = await Author.find().sort({ family_name: 1 }).exec();
  res.render("author_list", {
    title: "Author List",
    author_list: allAuthors,
  });

  // Superseded Code
  // res.send("NOT IMPLEMENTED: Author List");
});


// Display Detail Page for specified Author
exports.author_detail = asyncHandler(async (req, res, next) => {
  // Get Details of Author and their Notes (in parallel)
  const [author, allNotesByAuthor] = await Promise.all([
    Author.findById(req.params.id).exec(),
    Note.find({ author: req.params.id }, "title text").exec(),
  ]);

  if (author === null) {
    // No Author is found
    const err = new Error("Author not found.");
    err.status = 404;
    return next(err);
  }

  res.render("author_detail", {
    title: "Author Detail",
    author: author,
    author_notes: allNotesByAuthor,
  });

  // Superseded Code
  // res.send(`NOT IMPLEMENTED: Author Detail: ${req.params.id}`);
});


// Display Author Create Form on GET Request
exports.author_create_get = (req, res, next) => {
  res.render("author_form", { title: "Create Author" });
};

// Superseded Code
// exports.author_create_get = asyncHandler(async (req, res, next) => {
//   res.send("NOT IMPLEMENTED: Author Create on GET Request");
// });


// Handle Author Create on POST Request
exports.author_create_post = [
  // Validate and sanitize data
  body("first_name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("First Name must be specified.")
    .isAlphanumeric()
    .withMessage("First Name can only include alpha-numeric characters."),
  body("family_name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Family Name must be specified.")
    .isAlphanumeric()
    .withMessage("Family Name can only include alpha-numeric characters."),
  body("date_joined")
    // .optional({ values: "falsy" })
    .isISO8601()
    .toDate(),

  asyncHandler(async (req, res, next) => {
    // Extract Validation Errors from a Request
    const errors = validationResult(req);

    // Create Author Object with Escaped and Trimmed Data
    const author = new Author({
      first_name: req.body.first_name,
      family_name: req.body.family_name,
      date_joined: req.body.date_joined,
    });

    if (!errors.isEmpty()) {
      // Errors are present; re-Render Form with Error Messages
      res.render("author_form", {
        title: "Create Author",
        author: author,
        errors: errors.array(),
      });
      return;
    } else {
      // Data is Valid
      // Save Author
      await author.save();

      // Redirect to new Author Record
      res.redirect(author.url);
    }
  }),
];

// Superseded Code
// exports.author_create_post = asyncHandler(async (req, res, next) => {
//   res.send("NOT IMPLEMENTED: Author Create on POST Request");
// });


// Display Author Delete Form on GET Request
exports.author_delete_get = asyncHandler(async (req, res, next) => {
  // Get details of Author and all related Notes (in parallel)
  const [author, allNotesByAuthor] = await Promise.all([
    Author.findById(req.params.id).exec(),
    Note.find({ author: req.params.id }, "title summary").exec(),
  ]);

  if (author === null) {
    // No results are returned
    res.redirect("/catalog/authors");
  }

  res.render("author_delete", {
    title: "Delete Author",
    author: author,
    author_notes: allNotesByAuthor,
  });

  // Superseded Code
  // res.send("NOT IMPLEMENTED: Author Delete on GET Request");
});


// Handle Author Delete on POST Request
exports.author_delete_post = asyncHandler(async (req, res, next) => {
  // Get details of Author and all related Notes (in parallel)
  const [author, allNotesByAuthor] = await Promise.all([
    Author.findById(req.params.id).exec(),
    Book.find({ author: req.params.id }, "title summary").exec(),
  ]);

  if (allNotesByAuthor.length > 0) {
    // Author is associated with Notes; Render as for GET Route
    res.render("author_delete", {
      title: "Delete Author",
      author: author,
      author_notes: allNotesByAuthor,
    });
    return;
  } else {
    // Author is not associated with Notes; Delete Author Object and redirect to list of Authors
    await Author.findByIdAndDelete(req.body.authorid);
    res.redirect("/catalog/authors");
  }

  // Superseded Code
  // res.send("NOT IMPLEMENTED: Author Delete on POST Request");
});


// Display Author Update Form on GET Request
exports.author_update_get = asyncHandler(async (req, res, next) => {
  // Get Author data for Form
  const [author, allNotesByAuthor] = await Promise.all([
      Author.findById(req.params.id).exec(),
      Note.find({ author: req.params.id }, "title summary").exec(),
  ]);

  if (author === null) {
    // Selected Author is not present
    const err = new Error("Author not found.");
    err.status = 404;
    return next(err);
  }

  res.render("author_form", {
    title: "Update Author",
    notes: allNotesByAuthor,
  });

  // Superseded Code
  // res.send("NOT IMPLEMENTED: Author Update on GET Request");
});


// Handle Author Update on POST Request
exports.author_update_post = [
  body("first_name", "First Name must be specified.")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .isAlphanumeric()
    .withMessage("First Name can only include alpha-numeric characters."),    
  body("family_name", "Family Name must be specified.")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .isAlphanumeric()
    .withMessage("Family Name can only include alpha-numeric characters."),
  body("date_joined")
    // .optional({ values: "falsy" })
    .isISO8601()
    .toDate(),

  // Process Requeset after Data Validation
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    // Create Author Object with formatted Data and EXISTING ID
    const author = new Author({
      first_name: req.body.first_name,
      family_name: req.body.family_name,
      date_joined: req.body.date_joined,
      _id: req.params.id,  // Required or NEW ID will be assigned!
    });

    if (!errors.isEmpty()) {
      // Errors are present; Re-Render Form with Error Messages
      res.render("author_form", {
        title: "Update Author",
        notes: allNotesByAuthor,
        errors: errors.array(),
      });
      return
    } else {
      // Data is Valid; Update Author record
      const updatedAuthor = await Author.findByIdAndUpdate(req.params.id, author, {});
      // Re-Direct to Author Detail page
      res.redirect(updatedAuthor.url);
    }
  }),
];

// Superseded Code
// exports.author_update_post = asyncHandler(async (req, res, next) => {
//   res.send("NOT IMPLEMENTED: Author Update on POST Request");
// });
