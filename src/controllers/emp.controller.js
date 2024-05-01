const connection = require('../databases');
const Emp = require('../models/emp.model');
exports.getEmps = async (req, res) => {
  try {
    const emps = await Emp.getEmps();
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
  const { fullName, email, password, address,cinema_id } = req.body;
  try {
    const resultEmp = await Emp.findEmpByEmail(email);
    if (resultEmp.length > 0) {
      res.json({
        success: false,
        data: {
          message: 'Email nhân viên đã tồn tại',
        },
      });
      return;
    }

    const results = await Emp.createEmp(fullName, address, email, password,cinema_id);
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

    const results = await Emp.createUser(fullName, address, email, password);
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
  const { id, fullName, email, password, address } = req.body;

  try {
    const results = await Emp.update(fullName, address, email, password, id);
    res.json({
      success: true,
      data: {
        message: 'Cập nhật nhân viên thành công',
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
