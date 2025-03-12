import { Request, Response } from "express";
import { Snippet } from "../models/snippetModel";
import { Error as MongooseError } from "mongoose";
import { msToSeconds, secondsToMs, replaceQuotes, checkTime, isExpired } from "../utils/helpers";
const { ValidationError } = MongooseError;



export const getSnippets = async (req: Request, res: Response) => {
  try {
    const snippets = await Snippet.find().select('+expiresIn');
    //decode the "code" from each snippets in the response
    snippets.forEach((snippets) => {
      snippets.code = Buffer.from(snippets.code, "base64").toString("utf-8");
    });
    //filter on language
    if(req.query.language){
      const language = (req.query.language as string).split(",").map((language) => language.trim());
      const filteredSnippets = snippets.filter((snippet) => language.includes(snippet.language));
      res.status(200).json(filteredSnippets);
      return;
    }
    //filter on tags
   if(req.query.tags){
    const tags = (req.query.tags as string).split(",").map((tag) => tag.trim());
    const filteredSnippets = snippets.filter((snippet) => snippet.tags?.some((tag) => tags.includes(tag)));
    res.status(200).json(filteredSnippets);
    return;
   }

   // pagination with ?page and ?limit
   if(req.query.page || req.query.limit){
   const page = parseInt(req.query.page as string) || 1;
   const limit = parseInt(req.query.limit as string) || 10;
   const startIndex = (page - 1) * limit;
   const endIndex = page * limit;
   const paginatedSnippets = snippets.slice(startIndex, endIndex);
   res.status(200).json(paginatedSnippets);
   return;
  }
  //check for each snippet if it is expired
  const filteredSnippets = snippets.filter((snippet) => {
    // If expiresIn is not set, consider the snippet as not expired
    if (!snippet.expiresIn) {
      return true;
    }
  });
 
  res.status(200).json(filteredSnippets);
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
  if (!snippet) {
   res.status(404).json({ message: "Snippet not found" });
   return;
  }
  snippet.code = Buffer.from(snippet.code, "base64").toString("utf-8");

  //check if the snippit has expiresin
  if(!snippet.expiresIn){
    res.status(200).json(snippet);
    return;
  }
  // //check if the snippet is expired
  //  if(isExpired(snippet.expiresIn) ===true){
  //   res.status(400).json({ message: "Snippet is expired" });
  //   return;
  //  }

  const isSnippetExpired = isExpired(snippet.expiresIn);
  console.log(isSnippetExpired);

  if(!isSnippetExpired === true){
    res.status(400).json({ message: "Snippet is expired" });
    return;
  }

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
    const expiresIn=req.body.expiresIn;
        // Encode
const encodedCode = Buffer.from(code).toString("base64");
    if(expiresIn){
      const snippet = await Snippet.create({ title, code:encodedCode, language, tags, expiresIn: msToSeconds(expiresIn) })
  
      res.status(201).json({ snippet});
    }else{
    const snippet = await Snippet.create({ title, code:encodedCode, language, tags });
    res.status(201).json(snippet);}
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

export const deleteSnippet = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const snippet = await Snippet.findByIdAndDelete(id);
    if (!snippet) {
      res.status(404).json({ message: "Snippet not found try again" });
      return;
    }
    res.status(200).json({ message: "Snippet deleted successfully" });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Something went wrong" });
    }
  }
};

