
const fs = require('fs');
const archiver = require('archiver');
const path = require('path');



const compressFile = (filePath, outputFilePath) => {
  return new Promise((resolve, reject) => {
    if (typeof filePath !== 'string' || !filePath) {
      return reject(new Error('Invalid input file path'));
    }

    if (!fs.existsSync(filePath)) {
      return reject(new Error('Input file does not exist'));
    }

    try {
      const baseName = path.basename(filePath);

      const output = fs.createWriteStream(outputFilePath);
      const archive = archiver('zip', {
        zlib: { level: 9 }
      });

      output.on('close', () => {
        console.log(`${archive.pointer()} total bytes`);
        console.log('Archiver has been finalized and the output file descriptor has closed.');
        resolve();
      });

      archive.on('error', (err) => {
        reject(err);
      });

      archive.pipe(output);
      archive.file(filePath, { name: baseName });
      archive.finalize();

    } catch (err) {
      return reject(err);
    }
  });
};


const deleteFile = (filePath) => {
  if (fileExists(filePath)) {
    fs.unlinkSync(filePath);
  }
};

const getFilePath = (fileName) => {
  return path.join(__dirname, '../uploads', fileName);
};

module.exports = {
  //fileExists,
  deleteFile,
  getFilePath,
  compressFile
};
