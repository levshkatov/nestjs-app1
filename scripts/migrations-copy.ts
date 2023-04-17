// @ts-nocheck
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync } from 'fs';
import { copyFile, writeFile } from 'fs/promises';
import { join } from 'path';

let modulesPath = join(process.cwd(), 'dist', 'src', 'orm', 'modules');
const pathArg = process.argv.slice(2).find((el) => el.includes('path='));
if (pathArg) {
  const path = pathArg.split('=')[1];
  if (path) {
    modulesPath = join(modulesPath, path);
  }
}

const migrationFolder = join(process.cwd(), 'dist', 'src', 'orm', 'migrations');

const processFolder = async (dir) => {
  const migrationsPath = join(dir, 'migrations');
  if (existsSync(migrationsPath)) {
    const migrations = readdirSync(migrationsPath).filter((el) => el.endsWith('.js'));
    for (const migration of migrations) {
      const index = dir.split('/').findIndex((el) => el === 'modules');
      const remainingPath = dir.split('/').slice(index).join('/');

      let file = readFileSync(join(migrationsPath, migration), { encoding: 'utf-8' });
      file = file.replace(
        /require\("\.\.\/interfaces/gm,
        `require("../${remainingPath}/interfaces`,
      );
      file = file.replace(/require.*shared\/interfaces/gm, `require("../../shared/interfaces`);

      await writeFile(join(migrationFolder, migration), file);
    }
  }

  const folders = getFolderPaths(dir);
  folders.map((folder) => processFolder(folder));
};

const getFolderPaths = (dir) =>
  readdirSync(dir)
    .map((name) => join(dir, name))
    .filter((path) => statSync(path).isDirectory());

(async () => {
  if (existsSync(migrationFolder)) {
    rmSync(migrationFolder, { recursive: true, force: true });
  }
  mkdirSync(migrationFolder);

  processFolder(modulesPath);
})();
