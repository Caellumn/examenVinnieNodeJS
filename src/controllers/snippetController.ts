import { Request, Response } from "express";
import { Snippet } from "../models/snippetModel";
import { Error as MongooseError } from "mongoose";
const { ValidationError } = MongooseError;



export const getSnippets = async (req: Request, res: Response) => {
  try {
    const snippets = await Snippet.find().select('+expiresIn');
    res.status(200).json(snippets);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Something went wrong" });
    }
  }
};


export const getSnippetById = async(req: Request, res: Response) =>{
try{
  const {id} = req.params;
  const snippet = await Snippet.findById(id);
  res.status(200).json(snippet);
} catch (error: unknown) {
  if (error instanceof Error) {
    res.status(500).json({ message: error.message });
  } else {
    res.status(500).json({ message: "Something went wrong" });
  }
}
}

export const addSnippet = async (req: Request, res: Response) => {
  try {
    const { title, code, language, tags } = req.body;
    if(req.body.expiresIn){
      const snippet = await Snippet.create({ title, code, language, tags, expiresIn: req.body.expiresIn });
      res.status(201).json(snippet);
    }
    const snippet = await Snippet.create({ title, code, language, tags });
    res.status(201).json(snippet);
  } catch (error: unknown) {
    if (error instanceof ValidationError) {
      res.status(400).json({ message: error.message });
    } else if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Something went wrong" });
    }
  }
};


export const updateSnippet = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, code, language, tags, expiresIn } = req.body;
    const snippet = await Snippet.findByIdAndUpdate(
      id,
      { title, code, language, tags, expiresIn },
      { new: true }
    );
    res.status(200).json(snippet);
  } catch (error: unknown) {
    if (error instanceof ValidationError) {
      res.status(400).json({ message: error.message });
    } else if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Something went wrong" });
    }
  }
};
