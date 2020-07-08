const fs = require('fs');
const path = require('path');

module.exports = {
  getLitlJson,
  updateLitlJson,
};

function getLitlJson(projPath) {
  const litl = readJson(projPath);
  return {
    projectId: litl.projectId,
    distDir: litl.distDir || '.',
  };
}

function updateLitlJson(projPath, { projectId, distDir }) {
  let shouldWrite = false;
  const litl = readJson(projPath);
  if (!litl.projectId || litl.projectId !== projectId) {
    console.log('updated project');
    litl.projectId = projectId;
    shouldWrite = true;
  }

  if (!litl.distDir || litl.distDir !== distDir) {
    console.log('updated dist');
    litl.distDir = distDir;
    shouldWrite = true;
  }

  console.log('new litl', { litl, shouldWrite });

  if (shouldWrite) {
    writeJson(projPath, litl);
  }
}

function readJson(projPath) {
  try {
    return JSON.parse(fs.readFileSync(path.join(projPath, 'litl.json')));
  } catch (error) {
    return {};
  }
}

function writeJson(projPath, litl) {
  const { projectId, distDir, routes, ...others } = { ...litl };

  try {
    // write ordered
    fs.writeFileSync(
      path.join(projPath, 'litl.json'),
      JSON.stringify(
        {
          projectId,
          distDir: distDir || '.',
          routes: routes || [],
          ...others,
        },
        null,
        2,
      ),
    );
  } catch (error) {
    console.log('failed to update litl.json', error);
  }
}
