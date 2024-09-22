const path = require('path');
const fs = require('fs');
const { File, FILE_STATUSES } = require('../model/file.model');
const { compressFile } = require('../utils/fileUtils');

exports.uploadFile = async (req, res) => {
  //const io = req.app.get('socketio');
  const file = req.file;
  try {
    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const existingFile = await File.findOne({ originalName: file.originalname, size: file.size });
    if (existingFile) {
      return res.status(400).json({ message: 'File already exists' });
    }

    if (!file.path || typeof file.path !== 'string') {
      return res.status(400).json({ message: 'Invalid file path' });
    }

    const outputFilePath = `${file.path}.zip`;

    const newFile = new File({
      name: file.filename,
      originalName: file.originalname,
      compressedName: path.basename(outputFilePath),
      size: file.size,
      user: req.userData.userId,
      status: FILE_STATUSES.PROCESSING,
      filePath: file.path,
    });

    await newFile.save();


    res.status(200).json({
      message: 'File uploaded successfully',
      file: {
        id: newFile._id,
        name: newFile.name,
        compressedName: path.basename(outputFilePath),
        size: newFile.size,
        status: newFile.status,
        filePath: newFile.filePath
      }
    });

    if (!file.path) {
      throw new Error('Invalid input file path');
    }

    await compressFile(file.path, outputFilePath);

    newFile.status = FILE_STATUSES.COMPLETED;
    newFile.filePath = outputFilePath;
    await newFile.save();

    /** The idea of this function was to used as socket so it can update the file status once the file is being compressed, but socket is not working propertly */
    //io.emit('fileCompressed', { fileId: newFile._id, name: path.basename(newFile.filePath), status: newFile.status });

  } catch (err) {
    return res.status(500).json({ message: 'Error uploading or compressing file', error: err.message });

    /** The idea of this function was for update the file status once the file compression throw error, but socket is not working propertly */
    // if (newFile) {
    //   newFile.status = FILE_STATUSES.FAILED;
    //   await newFile.save();
    // }
    // if (!res.headersSent) {
    //   return res.status(500).json({ message: 'Error uploading or compressing file', error: err.message });
    // }
  }
};

exports.getAllUserFiles = async (req, res) => {
  try {
    const userId = req.userData.userId;
    const files = await File.find({ user: userId });
    res.status(200).json(files.length > 0 ? files : []);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.downloadCompressedFile = async (req, res) => {

  try {
    const fileId = req.params.id;

    const file = await File.findById(fileId);

    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    const compressedFilePath = file.filePath;

    if (!fs.existsSync(compressedFilePath)) {
      return res.status(404).json({ message: 'Compressed file not found' });
    }

    res.download(compressedFilePath, path.basename(compressedFilePath), (err) => {
      if (err) {
        return res.status(500).json({ message: 'Error downloading the file', error: err.message });
      }
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }



};

exports.checkStatus = async (req, res) => {
  try {
    const fileId = req.params.id;
    const file = await File.findById(fileId);

    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    res.status(200).json({
      fileId: file._id,
      status: file.status,
      compressedName: file.compressedName,
      name: file.originalName,
      size: file.size,
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.deleteFile = async (req, res) => {
  const fileId = req.params.id;

  try {
    const file = await File.findById(fileId);

    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    const filePath = path.resolve(file.filePath);

    if (fs.existsSync(filePath)) {
      fs.unlink(filePath, async (err) => {
        if (err) {
          return res.status(500).json({ message: 'Error deleting the file from the system', error: err.message });
        }
        await File.findByIdAndDelete(fileId);
        return res.status(200).json({ message: 'File deleted successfully' });
      });
    } else {
      await File.findByIdAndDelete(fileId);
      return res.status(200).json({ message: 'File deleted from database, but not found on the file system' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
