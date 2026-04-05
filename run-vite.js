import { build } from 'vite';

async function runBuild() {
  try {
    await build();
  } catch (e) {
    import('fs').then(fs => fs.writeFileSync('real-error.txt', e.stack || e.message));
    console.error('Error written to real-error.txt');
  }
}

runBuild();
