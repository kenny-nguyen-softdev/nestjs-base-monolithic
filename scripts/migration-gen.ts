import { execSync } from 'child_process';

const name = process.argv[2];
const lifecycleEvent = process.env.npm_lifecycle_event; // get script name

if (!name) {
  console.error(`Missing name.\nUsage: npm run ${lifecycleEvent} <name>`);
  process.exit(1);
}

// Determine if it's a seed or migration
const isSeed = lifecycleEvent?.startsWith('seed');
const isGenerate = lifecycleEvent?.includes('generate');

const baseDir = isSeed ? 'src/seeds' : 'src/migrations';
const folder = `${baseDir}/${name}`;

// Determine command
let command = '';
if (isGenerate) {
  // Generate a migration or seed (using typeorm migration:generate)
  command = `npx typeorm-ts-node-commonjs migration:generate ${folder} -d src/core/database/data-source.ts`;
} else {
  // Create an empty migration or seed (using typeorm migration:create)
  command = `npx typeorm-ts-node-commonjs migration:create ${folder}`;
}

console.log(`${isSeed ? 'Creating seed' : 'Creating migration'}: ${name} into ${folder}...`);
execSync(command, { stdio: 'inherit' });
