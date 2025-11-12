import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

interface FreedomConfig {
  ar_lock: boolean;
  ar_value: number;
  cs_lock: boolean;
  cs_value: number;
  od_lock: boolean;
  od_value: number;
  visible: boolean;
  font_size: number;
  relax: boolean;
  relax_style: string;
  aimbot: boolean;
  spins_per_minute: number;
  fraction_modifier: number;
  replay: boolean;
  replay_aim: boolean;
  replay_keys: boolean;
  replay_hardrock: boolean;
  sm_lock: boolean;
  sm_value: number;
  drpc: boolean;
  drpc_state: string;
  drpc_large: string;
  drpc_small: string;
  fl: boolean;
  hd: boolean;
  tw_lock: boolean;
  tw_value: number;
  jump_window: boolean;
  show_debug: boolean;
}

const DEFAULT_CONFIG: FreedomConfig = {
  ar_lock: false,
  ar_value: 9.0,
  cs_lock: false,
  cs_value: 4.0,
  od_lock: false,
  od_value: 8.0,
  visible: true,
  font_size: 30,
  relax: false,
  relax_style: "a",
  aimbot: false,
  spins_per_minute: 300,
  fraction_modifier: 0.5,
  replay: false,
  replay_aim: true,
  replay_keys: true,
  replay_hardrock: false,
  sm_lock: false,
  sm_value: 1.0,
  drpc: false,
  drpc_state: "",
  drpc_large: "",
  drpc_small: "",
  fl: false,
  hd: false,
  tw_lock: false,
  tw_value: 200.0,
  jump_window: false,
  show_debug: false,
};

let configPath = process.env.FREEDOM_CONFIG_PATH || "./config.ini";

export function setConfigPath(path: string) {
  configPath = path;
}

export function getConfigPath(): string {
  return configPath;
}

export function parseIniLine(line: string): { key: string; value: string } | null {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("[") || trimmed.startsWith(";")) {
    return null;
  }
  const eqIndex = trimmed.indexOf("=");
  if (eqIndex === -1) return null;
  return {
    key: trimmed.substring(0, eqIndex).trim(),
    value: trimmed.substring(eqIndex + 1).trim(),
  };
}

export function readConfig(): FreedomConfig {
  try {
    if (!existsSync(configPath)) {
      return { ...DEFAULT_CONFIG };
    }

    const content = readFileSync(configPath, "utf-8");
    const config: Partial<FreedomConfig> = { ...DEFAULT_CONFIG };

    const lines = content.split("\n");
    for (const line of lines) {
      const parsed = parseIniLine(line);
      if (!parsed) continue;

      const { key, value } = parsed;

      if (key === "ar_lock") config.ar_lock = value === "1";
      else if (key === "ar_value") config.ar_value = parseFloat(value) || DEFAULT_CONFIG.ar_value;
      else if (key === "cs_lock") config.cs_lock = value === "1";
      else if (key === "cs_value") config.cs_value = parseFloat(value) || DEFAULT_CONFIG.cs_value;
      else if (key === "od_lock") config.od_lock = value === "1";
      else if (key === "od_value") config.od_value = parseFloat(value) || DEFAULT_CONFIG.od_value;
      else if (key === "visible") config.visible = value === "1";
      else if (key === "font_size") config.font_size = parseInt(value) || DEFAULT_CONFIG.font_size;
      else if (key === "relax") config.relax = value === "1";
      else if (key === "relax_style") config.relax_style = value || "a";
      else if (key === "aimbot") config.aimbot = value === "1";
      else if (key === "spins_per_minute") config.spins_per_minute = parseInt(value) || DEFAULT_CONFIG.spins_per_minute;
      else if (key === "fraction_modifier") config.fraction_modifier = parseFloat(value) || DEFAULT_CONFIG.fraction_modifier;
      else if (key === "replay") config.replay = value === "1";
      else if (key === "replay_aim") config.replay_aim = value === "1";
      else if (key === "replay_keys") config.replay_keys = value === "1";
      else if (key === "replay_hardrock") config.replay_hardrock = value === "1";
      else if (key === "sm_lock") config.sm_lock = value === "1";
      else if (key === "sm_value") config.sm_value = parseFloat(value) || DEFAULT_CONFIG.sm_value;
      else if (key === "drpc") config.drpc = value === "1";
      else if (key === "drpc_state") config.drpc_state = value;
      else if (key === "drpc_large") config.drpc_large = value;
      else if (key === "drpc_small") config.drpc_small = value;
      else if (key === "fl") config.fl = value === "1";
      else if (key === "hd") config.hd = value === "1";
      else if (key === "tw_lock") config.tw_lock = value === "1";
      else if (key === "tw_value") config.tw_value = parseFloat(value) || DEFAULT_CONFIG.tw_value;
      else if (key === "jump_window") config.jump_window = value === "1";
      else if (key === "show_debug") config.show_debug = value === "1";
    }

    return config as FreedomConfig;
  } catch (error) {
    console.error("Error reading config:", error);
    return { ...DEFAULT_CONFIG };
  }
}

export function writeConfig(config: Partial<FreedomConfig>) {
  try {
    const fullConfig = { ...DEFAULT_CONFIG, ...config };

    let iniContent = "[Config][Settings]\n";
    iniContent += `ar_lock=${fullConfig.ar_lock ? 1 : 0}\n`;
    iniContent += `ar_value=${fullConfig.ar_value.toFixed(1)}\n`;
    iniContent += `cs_lock=${fullConfig.cs_lock ? 1 : 0}\n`;
    iniContent += `cs_value=${fullConfig.cs_value.toFixed(1)}\n`;
    iniContent += `od_lock=${fullConfig.od_lock ? 1 : 0}\n`;
    iniContent += `od_value=${fullConfig.od_value.toFixed(1)}\n`;
    iniContent += `visible=${fullConfig.visible ? 1 : 0}\n`;
    iniContent += `font_size=${fullConfig.font_size}\n`;
    iniContent += `relax=${fullConfig.relax ? 1 : 0}\n`;
    iniContent += `relax_style=${fullConfig.relax_style}\n`;
    iniContent += `aimbot=${fullConfig.aimbot ? 1 : 0}\n`;
    iniContent += `spins_per_minute=${fullConfig.spins_per_minute}\n`;
    iniContent += `fraction_modifier=${fullConfig.fraction_modifier.toFixed(2)}\n`;
    iniContent += `replay=${fullConfig.replay ? 1 : 0}\n`;
    iniContent += `replay_aim=${fullConfig.replay_aim ? 1 : 0}\n`;
    iniContent += `replay_keys=${fullConfig.replay_keys ? 1 : 0}\n`;
    iniContent += `replay_hardrock=${fullConfig.replay_hardrock ? 1 : 0}\n`;
    iniContent += `sm_lock=${fullConfig.sm_lock ? 1 : 0}\n`;
    iniContent += `sm_value=${fullConfig.sm_value.toFixed(2)}\n`;
    iniContent += `drpc=${fullConfig.drpc ? 1 : 0}\n`;
    iniContent += `drpc_state=${fullConfig.drpc_state}\n`;
    iniContent += `drpc_large=${fullConfig.drpc_large}\n`;
    iniContent += `drpc_small=${fullConfig.drpc_small}\n`;
    iniContent += `fl=${fullConfig.fl ? 1 : 0}\n`;
    iniContent += `hd=${fullConfig.hd ? 1 : 0}\n`;
    iniContent += `tw_lock=${fullConfig.tw_lock ? 1 : 0}\n`;
    iniContent += `tw_value=${fullConfig.tw_value.toFixed(1)}\n`;
    iniContent += `jump_window=${fullConfig.jump_window ? 1 : 0}\n`;
    iniContent += `show_debug=${fullConfig.show_debug ? 1 : 0}\n`;
    iniContent += "\n";

    writeFileSync(configPath, iniContent, "utf-8");
    console.log(`Config saved to ${configPath}`);
  } catch (error) {
    console.error("Error writing config:", error);
  }
}

export function getDefaultConfig(): FreedomConfig {
  return { ...DEFAULT_CONFIG };
}
