const Component = require("../models/component");
const Note = require("../models/note");

const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");


// Display List of all Components
exports.component_list = asyncHandler(async (req, res, next) => {
  const allComponents = await Component.find().sort({ name: 1 }).exec();
  res.render("component_list", {
    title: "Component List",
    component_list: allComponents, 
  });

  // Superseded Code
  // res.send("NOT IMPLEMENTED: Component List");
});


// Display Detail Page for specified Component
exports.component_detail = asyncHandler(async (req, res, next) => {
  // Get Component Details and all associated Notes (in parallel)
  const [component, notesInComponent] = await Promise.all([
    Component.findById(req.params.id).exec(),
    Note.find({ component: req.params.id }, "note summary").exec(),
  ]);

  if (component == null) {
    // No Components are returned
    const err = new Error("Component not found.");
    err.status = 404;
    return next(err);
  }

  res.render("component_detail", {
    title: "Component Detail",
    component: component,
    component_notes: notesInComponent,
  });

  // Superseded Code
  // res.send(`NOT IMPLEMENTED: Component Detail: ${req.params.id}`);
});


// Display Component Create Form on GET Request
exports.component_create_get = (req, res, next) => {
  res.render("component_form", { title: "Create Component" });
};

// Superseded Code
// exports.component_create_get = asyncHandler(async (req, res, next) => {
//   res.send("NOT IMPLEMENTED: Component Create on GET Request");
// });


// Handle Component Create on POST Request
exports.component_create_post = [
  // Validate Name data field
  body("name", "Component Name must contain at least two (2) characters.")
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

    // Create Component Object with escaped and trimmed data
    const component = new Component({ 
      name: req.body.name,
      description: req.body.description,
     });

    if (!errors.isEmpty()) {
      // There are Errors, re-Render Form with Error Messages
      res.render("component_form", {
        title: "Create Component",
        component: component,
        errors: errors.array(),
      });
      return;
    } else {
      // Data is Valid
      // Confirm Component does not already exist
      const componentExists = await Component.findOne({ name: req.body.name }).exec();
      if (componentExists) {
        res.redirect(componentExists.url);
      } else {
        await component.save();
        // New Language saved, redirect to Component Details page
        res.redirect(component.url);
      }
    }
  }),
];

// Superseded Code
// exports.component_create_post = asyncHandler(async (req, res, next) => {
//   res.send("NOT IMPLEMENTED: Component Create on POST Request");
// });


// Display Component Delete Form on GET Requeset
exports.component_delete_get = asyncHandler(async (req, res, next) => {
  // Get details of Component and all associated Notes (in parallel)
  const [component, allNotesWithComponent] = await Promise.all([
    Component.findById(req.params.id).exec(),
    Note.find({ component: req.params.id }, "name").exec(),
  ]);

  if (component === null) {
    // No results are returned
    res.redirect("/catalog/components");
  }

  res.render("component_delete", {
    title: "Delete Component",
    component: component,
    description: description,
    component_notes: allNotesWithComponent,
  });

  // Superseded Code
  // res.send("NOT IMPLEMENTED: Component Delete on GET Request");
});


// Handle Component Delete on POST Request
exports.component_delete_post = asyncHandler(async (req, res, next) => {
  // Get details of Component and all associated Notes (in parallel)
  const [component, allNotesWithComponent] = await Promise.all([
    Component.findById(req.params.id).exec(),
    Note.find({ component: req.params.id }, "name").exec(),
  ]);

  if (allNotesWithComponent.length > 0) {
    // Component is associated with Notes; Render as for GET Route
    res.render("component_delete", {
      title: "Delete Component",
      component: component,
      description, description,
      component_notes: allNotesWithComponent,
    });
    return;
  } else {
    // Component is not associated with Notes; Delete Component Object and redirect to list of Components
    await Component.findByIdAndDelete(req.params.componentid);
    res.redirect("/catalog/components")
  }

  // Superseded Code
  // res.send("NOT IMPLEMENTED: Component Delete on POST Request");
});


// Display Component Update Form on GET Request
exports.component_update_get = asyncHandler(async (req, res, next) => {
  const [component, allNotesWithComponent] = await Promise.all([
    Component.findById(req.params.id).exec(),
    Note.find({ component: req.params.id }, "title summary").exec(),
  ]);

  if (component === null) {
    // Selected Component is not present
    const err = new Error("Component not found.");
    err.status = 404;
    return next(err);
  }

  res.render("component_form", {
    title: "Update Component",
    notes: allNotesWithComponent,
  });

  // Superseded Code
  // res.send("NOT IMPLEMENTED: Component Update on GET Request");
});


// Handle Component Update on POST Request
exports.component_update_post = [
  body("name", "Component Name must contain at least two (2) characters.")
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

    // Create Component Object with formatted Data and EXISTING ID
    const component = new Component({
      name: req.body.name,
      description: req.body.description,
      _id: req.params.id,  // Required or NEW ID will be assigned! 
    });
    
    if (!errors.isEmpty()) {
      // Errors are present; Re-Render Form with Error Messages
      res.render("component_form", {
        title: "Update Component",
        note: allNotesWithComponent,
        errors: errors.array(),
      });
      return
    } else {
      // Data is Valid; Update Component record
      const updatedComponent = await Component.findByIdAndUpdate(req.params.id, component, {});
      // Re-Direct to Component Detail page
      res.redirect(updatedComponent.url);
    }
  }),
];

// Superseded Code
// exports.component_update_post = asyncHandler(async (req, res, next) => {
//   res.send("NOT IMPLEMENTED: Component Update on POST Request");
// });