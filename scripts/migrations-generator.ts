// @ts-nocheck
import { statSync, readdirSync, existsSync, mkdirSync, rmSync } from 'fs';
import { writeFile, readFile } from 'fs/promises';
import { join } from 'path';

const basePath = join(process.cwd(), 'src', 'orm', 'modules');
let modulesPaths = [];
const pathArg = process.argv.slice(2).find((el) => el.includes('path='));
if (pathArg) {
  const paths = pathArg.split('=')[1]?.split(',');
  if (paths) {
    paths.forEach((path) => {
      modulesPaths.push(join(basePath, path));
    });
  } else {
    modulesPaths.push(basePath);
  }
}

const processFolder = async (dir, templates) => {
  const newModels = getModels(dir);
  if (newModels.length) {
    const migrationsPath = join(dir, 'migrations');

    if (existsSync(migrationsPath)) {
      rmSync(migrationsPath, { recursive: true, force: true });
    }

    if (!existsSync(migrationsPath)) {
      mkdirSync(migrationsPath);
    }

    for (const modelName of newModels) {
      const model = await readFile(join(dir, modelName), { encoding: 'utf-8' });
      const attributes = [];
      const tableName = model.match(/(?<=tableName: ')(.*?)(?=',)/)[0];
      if (!tableName) {
        throw Error(`No tablename for model: ${model}`);
      }

      const matches = model.match(/(?<=@Column\({)([\S\s]*?)(?=}\))|(?<=}\)\n)(.*?)(?=!:)/gm);

      matches.forEach((match, i, arr) => {
        arr[i] = match
          .split('\n')
          .map((el) => el.trim())
          .filter((el) => el)
          .join('\n');
        if (i % 2 !== 0) {
          attributes.push(`${arr[i]}: {
          ${arr[i - 1]}
          },`);
        }
      });

      let migration = templates.create
        // .substring(templates.create.indexOf('\n') + 1)
        .replace(/TABLENAME/gm, tableName)
        .replace(/\/\/ TABLEATTRIBUTES,/gm, attributes.join('\n'));

      const imports = model
        .match(/(?=import)([\S\s]*?)(?<=;)/gm)
        ?.filter((el) => el.includes('interfaces/'));
      const extraImports = [];

      imports.forEach((str) => {
        const interfaces = str
          .match(/(?<={)([\S\s]*?)(?=})/gm)[0]
          .split(',')
          .map((el) => el.trim());

        for (const name of interfaces) {
          if (migration.includes(name)) {
            extraImports.push(str.replace("'../", "'../../").replace("'./", "'../"));
            break;
          }
        }
      });

      if (extraImports.length) {
        migration = migration
          .split('\nmodule.exports')
          .join(`${extraImports.join('\n')}\n\nmodule.exports`);
      }

      const migrationName = `${now()}-create-${modelName.split('.')[0]}.ts`;
      await writeFile(join(migrationsPath, migrationName), migration);
    }
  }

  const folders = getFolderPaths(dir);
  folders.map(async (folder) => await processFolder(folder, templates));
};

const getFolderPaths = (dir) =>
  readdirSync(dir)
    .map((name) => join(dir, name))
    .filter((path) => statSync(path).isDirectory());

const getModels = (dir) =>
  readdirSync(dir).filter(
    (name) => name.endsWith('model.ts') && statSync(join(dir, name)).isFile(),
  );

const now = () => {
  const now = new Date().toLocaleString('ru-ru', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
  const date = now.split(',')[0].split('.').reverse().join('');
  const time = now.split(',')[1].trim().split(':').join('');
  return `${date}${time}`;
};

(async () => {
  const templates = {};
  templates.create = await readFile(join(__dirname, 'templates', 'create.template.ts'), {
    encoding: 'utf-8',
  });

  for (const path of modulesPaths) {
    await processFolder(path, templates);
  }
})();
