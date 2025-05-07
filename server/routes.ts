import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { profileFormSchema } from "@shared/schema";
import fs from "fs";
import path from "path";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes
  const apiPrefix = "/api";
  
  // Get all schemes
  app.get(`${apiPrefix}/schemes`, async (req, res) => {
    try {
      const schemes = await storage.getSchemes();
      console.log("Found schemes:", schemes.length);
      // Log a sample scheme to debug
      if (schemes.length > 0) {
        console.log("Sample scheme:", JSON.stringify(schemes[0], null, 2));
      }
      return res.json(schemes);
    } catch (error) {
      console.error("Error fetching schemes:", error);
      return res.status(500).json({ message: "Failed to fetch schemes" });
    }
  });
  
  // Get scheme by ID
  app.get(`${apiPrefix}/schemes/:id`, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid scheme ID" });
      }
      
      const scheme = await storage.getSchemeById(id);
      if (!scheme) {
        return res.status(404).json({ message: "Scheme not found" });
      }
      
      return res.json(scheme);
    } catch (error) {
      console.error("Error fetching scheme:", error);
      return res.status(500).json({ message: "Failed to fetch scheme" });
    }
  });
  
  // Recommend schemes based on user profile
  app.post(`${apiPrefix}/schemes/recommend`, async (req, res) => {
    try {
      // Validate the profile data
      const profileData = profileFormSchema.parse(req.body);
      
      // Get recommended schemes
      const recommendedSchemes = await storage.recommendSchemes(profileData);
      
      // Store the user profile for future reference
      await storage.createUserProfile(profileData);
      
      return res.json(recommendedSchemes);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      
      console.error("Error recommending schemes:", error);
      return res.status(500).json({ message: "Failed to recommend schemes" });
    }
  });
  
  // Download application form for a scheme
  app.get(`${apiPrefix}/schemes/:id/form`, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid scheme ID" });
      }
      
      const scheme = await storage.getSchemeById(id);
      if (!scheme) {
        return res.status(404).json({ message: "Scheme not found" });
      }
      
      // Check if the scheme has a form path
      if (!scheme.applicationFormPath) {
        return res.status(404).json({ message: "Application form not available for this scheme" });
      }
      
      // Get the form file path
      const formFilePath = path.resolve(process.cwd(), scheme.applicationFormPath);
      
      // Check if the file exists
      if (!fs.existsSync(formFilePath)) {
        return res.status(404).json({ message: "Application form file not found" });
      }
      
      // Set the content type and disposition headers
      const fileName = `${scheme.name.replace(/\s+/g, '_')}_Application_Form.pdf`;
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
      
      // Stream the file
      const fileStream = fs.createReadStream(formFilePath);
      fileStream.pipe(res);
    } catch (error) {
      console.error("Error downloading application form:", error);
      return res.status(500).json({ message: "Failed to download application form" });
    }
  });
  
  // Get scheme categories
  app.get(`${apiPrefix}/scheme-categories`, async (req, res) => {
    try {
      const categories = await storage.getSchemeCategories();
      return res.json(categories);
    } catch (error) {
      console.error("Error fetching scheme categories:", error);
      return res.status(500).json({ message: "Failed to fetch scheme categories" });
    }
  });
  
  // Debug endpoint: Get all data for troubleshooting
  app.get(`${apiPrefix}/debug`, async (req, res) => {
    try {
      const schemes = await storage.getSchemes();
      const categories = await storage.getSchemeCategories();
      
      return res.json({
        schemes,
        categories,
        schemeCount: schemes.length,
        categoryCount: categories.length
      });
    } catch (error) {
      console.error("Error in debug endpoint:", error);
      return res.status(500).json({ message: "Error in debug endpoint", error: String(error) });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
