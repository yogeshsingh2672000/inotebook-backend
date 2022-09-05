const express = require("express");
const fetchuser = require("../middleware/fetchuser");
const Note = require("../models/Note");
const { body, validationResult } = require("express-validator");
const router = express.Router();

// Route 1: Get all the notes Login required GET: /api/notes/fetchallnotes
router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal server Error");
  }
});

// Route 2: Create Notes Login required POST: /api/notes/addnote
router.post(
  "/addnote",
  fetchuser,
  [
    body("title", "Enter a valid Title").isLength({
      min: 3,
    }),
    body("description", "Desc atleast 5 character long").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;
      console.log(req.body);

      // If there is error then return bad request and error
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const note = new Note({
        title,
        description,
        tag,
        user: req.user.id,
      });
      const saveNote = await note.save();
      res.json(saveNote);
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Internal server Error");
    }
  }
);

// Route 3: Update an existing Notes Login required PUT: /api/notes/updatenote
router.put("/updatenote/:id", fetchuser, async (req, res) => {
  try {
    const { title, description, tag } = req.body;
    const newNote = {};
    if (title) {
      newNote.title = title;
    }
    if (description) {
      newNote.description = description;
    }
    if (tag) {
      newNote.tag = tag;
    }

    //  find the the note to update
    let note = await Note.findById(req.params.id);
    if (!note) {
      return req.status(404).send("Not found");
    }

    if (note.user.toString() !== req.user.id) {
      return req.status(401).send("Not allowed");
    }

    note = await Note.findByIdAndUpdate(
      req.params.id,
      { $set: newNote },
      { new: true }
    );

    // return
    res.json({ note });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal server Error");
  }
});

// Route 3: Delete an existing Notes Login required DELETE: /api/notes/deletenote
router.delete("/deletenote/:id", fetchuser, async (req, res) => {
  try {
    const { title, description, tag } = req.body;

    //  find the the note to be delete and delete it
    let note = await Note.findById(req.params.id);
    if (!note) {
      return req.status(404).send("Not found");
    }

    // allow deletion only if the user owns this note
    if (note.user.toString() !== req.user.id) {
      return req.status(401).send("Not allowed");
    }

    note = await Note.findByIdAndDelete(req.params.id);

    // return
    res.json({ Success: "Note has been deleted", note: note });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal server Error");
  }
});
module.exports = router;
