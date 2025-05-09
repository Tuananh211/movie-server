const connection = require('../databases');
const Emp = require('../models/emp.model');
const bcrypt = require('bcrypt');
exports.getEmps = async (req, res) => {
  try {
    const emps = await Emp.getEmps();
    res.json(emps);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.getListManager = async (req, res) => {
  try {
    const emps = await Emp.getManagers();
    res.json(emps);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.getListEmpsOfCinema = async (req, res) => {
  try {
    const cinema_id= req.params;
    const emps = await Emp.getListEmpsOfCinema(cinema_id);
    res.json(emps);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.getListUser = async (req, res) => {
  try {
    console.log(1)
    const emps = await Emp.getUsers();
    res.json(emps);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.createEmp = async (req, res) => {
  const { fullName, email, password, address,role,cinema_id } = req.body;
  try {
    const resultEmp = await Emp.findEmpByEmail(email);
    if (resultEmp.length > 0) {
      res.json({
        success: false,
        data: {
          message: 'Email đã được sử dụng',
        },
      });
      return;
    }
    const hashPassword = bcrypt.hashSync(password, 10);
    const results = await Emp.createEmp(fullName, address, email, hashPassword,role,cinema_id);
    res.json({
      success: true,
      data: {
        message: 'Thêm nhân viên thành công',
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createManager = async (req, res) => {
  const { fullName, email, password, address,cinema_id } = req.body;
  try {
    const resultEmp = await Emp.findEmpByEmail(email);
    if (resultEmp.length > 0) {
      res.json({
        success: false,
        data: {
          message: 'Email quản lý đã tồn tại',
        },
      });
      return;
    }
    const hashPassword = bcrypt.hashSync(password, 10);
    const results = await Emp.createManager(fullName, address, email, hashPassword,cinema_id);
    res.json({
      success: true,
      data: {
        message: 'Thêm quản lý thành công',
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createUser = async (req, res) => {
  const { fullName, email, password, address } = req.body;
  try {
    const resultEmp = await Emp.findEmpByEmail(email);
    if (resultEmp.length > 0) {
      res.json({
        success: false,
        data: {
          message: 'Email người dùng đã tồn tại',
        },
      });
      return;
    }
    const hashPassword = bcrypt.hashSync(password, 10);
    const results = await Emp.createUser(fullName, address, email, hashPassword);
    res.json({
      success: true,
      data: {
        message: 'Thêm người dùng thành công',
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getEmpById = async (req, res) => {
  const { empId } = req.params;
  try {
    const emp = await Emp.getEmpById(empId);
    res.json(emp);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.updateEmp = async (req, res) => {
  const { id, fullName, email, password, address,role,cinema_id } = req.body;

  try {
    const emp= await Emp.getEmpById(id)
    const existEmp = emp[0];
    const isPassword = bcrypt.compareSync(password,existEmp.password);
    let hashedPassword;
    if(!isPassword){
      hashedPassword= bcrypt.hashSync(password, 10)
    }
    else{
      hashedPassword = password;
    }
    const results = await Emp.updateEmp(fullName, address, email, hashedPassword,role,cinema_id, id);
    res.json({
      success: true,
      data: {
        message: 'Cập nhật thành công',
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateUser = async (req, res) => {
  const { id, fullName, email, password, address } = req.body;

  try {
    const results = await Emp.update(fullName, address, email, password, id);
    res.json({
      success: true,
      data: {
        message: 'Cập nhật người dùng thành công',
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.lockEmp = async (req, res) => {
  const { userId } = req.params;
  console.log(userId)
  try {
    const results = await Emp.lockEmp(userId);
    res.json({
      success: true,
      data: {
        message: 'Tài khoản này đã bị khóa',
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.unLockEmp = async (req, res) => {
  const { userId } = req.params;

  try {
    const results = await Emp.unLockEmp(userId);
    res.json({
      success: true,
      data: {
        message: 'Tài khoản này đã được mở khóa',
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteEmp = async (req, res) => {
  const { id } = req.body;
  try {
    const results = await Emp.delete(id);
    res.json({
      success: true,
      data: {
        message: 'Xóa nhân viên thành công',
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  const { id } = req.body;
  try {
    const results = await Emp.deleteUser(id);
    res.json({
      success: true,
      data: {
        message: 'Xóa tài khoản thành công',
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
