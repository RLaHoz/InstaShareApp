const User = require('../model/user.model');
const { File } = require('../model/file.model');

exports.reset = async (req, res) => {

  const { method } = req.body;

  try{
    if(method === 'all'){
      await User.deleteMany({});
      await File.deleteMany({});
    }
    res.status(204).json({ message: 'Database cleaned'});
  } catch (err) {
    res.status(500).json({ error: 'Error reseting data base', errorMsg: err });
  }
};
