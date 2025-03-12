import { Request, Response } from "express";
import { Snippet } from "../models/snippetModel";

export const getDashboard = async (req: Request, res: Response) => {
  try {
    const currentTime = Date.now();
    const nonExpiredSnippets = await Snippet.find().select('+expiresIn');
    
    const snippets = nonExpiredSnippets.filter((snippet) => {
      if (!snippet.expiresIn) {
        return true;
      }
      const updatedAtTimestamp = new Date(snippet.updatedAt).getTime();
      const expirationTime = updatedAtTimestamp + (snippet.expiresIn * 1000);
      return currentTime <= expirationTime;
    });
    
    snippets.forEach(snippet => {
      snippet.code = Buffer.from(snippet.code, "base64").toString("utf-8");
    });
  
    let filteredSnippets = [...snippets];
    
    if (req.query.language) {
      const language = req.query.language as string;
      filteredSnippets = filteredSnippets.filter(snippet => 
        snippet.language.toLowerCase() === language.toLowerCase()
      );
    }

    if (req.query.tags) {
      const tags = (req.query.tags as string).split(',').map(tag => tag.trim().toLowerCase());
      filteredSnippets = filteredSnippets.filter(snippet => 
        snippet.tags && snippet.tags.some(tag => 
          tags.includes(tag.toLowerCase())
        )
      );
    }
    res.render('dashboard', { 
      snippets: filteredSnippets,
      currentFilter: {
        language: req.query.language || '',
        tags: req.query.tags || ''
      }
    });
    
  } catch (error: unknown) {
    console.error('Dashboard error:', error); 
    res.status(500).render('dashboard', { 
      snippets: [],
      error: 'Something went wrong'
    });
  }
};
