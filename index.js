import express from 'express';
import morgan from 'morgan';
import cors from 'cors';

const app = express();

// Middleware
app.use(cors());
app.use(morgan('tiny'));

// List of packages to return latest versions for
const packages = ['express', 'morgan', 'cors'];

// Helper to fetch @latest version from npm registry
async function getLatestVersions(pkgList) {
  const result = {};
  await Promise.all(
    pkgList.map(async (pkg) => {
      try {
        const res = await fetch(`https://registry.npmjs.org/${pkg}/latest`);
        const data = await res.json();
        result[pkg] = data.version; // latest version
      } catch (err) {
        console.error(`Failed to fetch latest version for ${pkg}:`, err);
        result[pkg] = '*';
      }
    })
  );
  return result;
}

app.get('/api/clients/:name', async (req, res) => {
  const clientName = req.params.name;
  const dependencies = await getLatestVersions(packages);

  res.json({
    name: clientName,
    dependencies
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Client API running on port ${PORT}`);
});
