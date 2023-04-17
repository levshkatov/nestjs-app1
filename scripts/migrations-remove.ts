// @ts-nocheck
import { statSync, readdirSync, existsSync, mkdirSync, rmSync } from 'fs';
import { writeFile, readFile } from 'fs/promises';
import { join } from 'path';

let modulesPath = join(process.cwd(), 'src', 'orm', 'modules');
const pathArg = process.argv.slice(2).find((el) => el.includes('path='));
if (pathArg) {
  const path = pathArg.split('=')[1];
  if (path) {
    modulesPath = join(modulesPath, path);
  }
}

const processFolder = async (dir) => {
  const migrationsPath = join(dir, 'migrations');
  if (existsSync(migrationsPath)) {
    rmSync(migrationsPath, { recursive: true, force: true });
  }

  const folders = getFolderPaths(dir);
  folders.map(async (folder) => await processFolder(folder));
};

const getFolderPaths = (dir) =>
  readdirSync(dir)
    .map((name) => join(dir, name))
    .filter((path) => statSync(path).isDirectory());

(async () => {
  await processFolder(modulesPath);
})();
