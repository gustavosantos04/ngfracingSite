import { readdir } from "node:fs/promises";
import path from "node:path";

const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);

type DirectoryConfig = {
  publicDir: string;
  publicPrefix: string;
};

export type RepositoryImageOption = {
  url: string;
  label: string;
  group: string;
};

async function readImageDirectory(config: DirectoryConfig): Promise<RepositoryImageOption[]> {
  const absoluteDir = path.join(process.cwd(), "public", config.publicDir);

  try {
    const entries = await readdir(absoluteDir, { withFileTypes: true });
    return entries
      .filter((entry) => entry.isFile() && IMAGE_EXTENSIONS.has(path.extname(entry.name).toLowerCase()))
      .sort((left, right) => left.name.localeCompare(right.name))
      .map((entry) => ({
        url: `/${config.publicPrefix}/${entry.name}`.replace(/\\/g, "/"),
        label: entry.name,
        group: config.publicDir
      }));
  } catch {
    return [];
  }
}

async function listRepositoryImages(configs: DirectoryConfig[]) {
  const results = await Promise.all(configs.map((config) => readImageDirectory(config)));
  const unique = new Map<string, RepositoryImageOption>();

  for (const list of results) {
    for (const item of list) {
      if (!unique.has(item.url)) {
        unique.set(item.url, item);
      }
    }
  }

  return Array.from(unique.values());
}

export async function getRepositoryCarImages() {
  return listRepositoryImages([
    { publicDir: "images/carros", publicPrefix: "images/carros" },
    { publicDir: "cars", publicPrefix: "cars" }
  ]);
}

export async function getRepositoryProductImages() {
  return listRepositoryImages([{ publicDir: "images/produtos", publicPrefix: "images/produtos" }]);
}
