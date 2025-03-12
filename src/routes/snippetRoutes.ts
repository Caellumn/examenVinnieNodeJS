import express from "express";
import {
  getSnippets,
  addSnippet,
  updateSnippet,
  getSnippetById
} from "../controllers/snippetController";

const router = express.Router();

router
  .get("/snippets", getSnippets)
  .post("/snippets", addSnippet)
  .put("/snippets/:id", updateSnippet)
  .get("/snippets/:id",getSnippetById)

export default router;
