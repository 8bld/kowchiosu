import { Router, Request, Response } from "express";
import { readConfig, writeConfig, getDefaultConfig, setConfigPath } from "../config-handler";

const router = Router();

// Get current config
router.get("/", (_req: Request, res: Response) => {
  try {
    const config = readConfig();
    res.json(config);
  } catch (error) {
    console.error("Error getting config:", error);
    res.status(500).json({ error: "Failed to read config" });
  }
});

// Update a single config value
router.post("/update", (req: Request, res: Response) => {
  try {
    const { key, value } = req.body;
    if (!key || value === undefined) {
      return res.status(400).json({ error: "Missing key or value" });
    }

    const config = readConfig();
    (config as any)[key] = value;
    writeConfig(config);

    res.json({ success: true, config });
  } catch (error) {
    console.error("Error updating config:", error);
    res.status(500).json({ error: "Failed to update config" });
  }
});

// Update multiple config values
router.post("/update-batch", (req: Request, res: Response) => {
  try {
    const updates = req.body;
    if (!updates || typeof updates !== "object") {
      return res.status(400).json({ error: "Invalid updates object" });
    }

    const config = readConfig();
    Object.assign(config, updates);
    writeConfig(config);

    res.json({ success: true, config });
  } catch (error) {
    console.error("Error updating config:", error);
    res.status(500).json({ error: "Failed to update config" });
  }
});

// Reset to defaults
router.post("/reset", (_req: Request, res: Response) => {
  try {
    const defaults = getDefaultConfig();
    writeConfig(defaults);
    res.json({ success: true, config: defaults });
  } catch (error) {
    console.error("Error resetting config:", error);
    res.status(500).json({ error: "Failed to reset config" });
  }
});

// Set config file path
router.post("/set-path", (req: Request, res: Response) => {
  try {
    const { path } = req.body;
    if (!path) {
      return res.status(400).json({ error: "Missing path" });
    }

    setConfigPath(path);
    const config = readConfig();
    res.json({ success: true, path, config });
  } catch (error) {
    console.error("Error setting config path:", error);
    res.status(500).json({ error: "Failed to set config path" });
  }
});

export default router;
