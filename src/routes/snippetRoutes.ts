import express from "express";
import {
  getSnippets,
  addSnippet,
  updateSnippet,
  getSnippetById,
  deleteSnippet
} from "../controllers/snippetController";

const router = express.Router();

router
  .get("/snippets", getSnippets)
  .post("/snippets", addSnippet)
  .put("/snippets/:id", updateSnippet)
  .delete("/snippets/:id", deleteSnippet)
  .get("/snippets/:id",getSnippetById)

export default router;
