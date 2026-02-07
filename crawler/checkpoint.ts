import fs from "fs";

const CHECKPOINT_FILE = "crawl_checkpoint.json";

export const saveCheckpoint = (data: any) => {
  fs.writeFileSync(CHECKPOINT_FILE, JSON.stringify(data, null, 2));
};

export const loadCheckpoint = () => {
  if (!fs.existsSync(CHECKPOINT_FILE)) {
    return null;
  }
  return JSON.parse(fs.readFileSync(CHECKPOINT_FILE, "utf-8"));
};
