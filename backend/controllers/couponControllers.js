const db = require("../model/db");

// Get All Coupon Codes
const getAllCoupons = async (req, res) => {
  try {
    const coupons = db.emptyOrRows(await db.query(`SELECT * FROM Codes`, []));
    res.json(coupons);
  } catch (error) {
    res.status(500).json({
      message: "Couldn't Fetch Data from Database",
    });
  }
};

const getCoupon = async (req, res) => {
  try {
    const coupon = db.emptyOrRows(
      await db.query(`SELECT * FROM Codes WHERE code=?`, [req.params.id])
    );
    res.json(coupon[0]);
  } catch (error) {
    res.status(500).json({
      message: "Couldn't Fetch Data from Database",
    });
  }
};

// Add new Coupon Code
const addCoupon = async (req, res) => {
  const { code, discount } = req.body;

  try {
    const oldCoupon = db.emptyOrRows(
      await db.query(`SELECT * FROM Codes WHERE code=?`, [code])
    );
    if (oldCoupon.length !== 0) {
      return res.json({ message: "Code Already exists" });
    } else {
      const newCoupon = await db.query(
        `INSERT INTO Codes (code, discount) VALUES (?, ?); `,
        [code, discount]
      );
      if (newCoupon.affectedRows) {
        res.json({ id: newCoupon.insertId, code, discount });
      }
    }
  } catch (err) {
    res.status(401).json({
      message: "Couldn't add Coupon",
    });
  }
};

// Delete a coupon based on id
const deleteCoupon = async (req, res) => {
  const couponId = req.params.id;
  try {
    const currentCoupon = db.emptyOrRows(
      await db.query(`SELECT * FROM Codes WHERE id=?`, [couponId])
    );
    if (currentCoupon.length === 0)
      return res.json({ message: "No Coupon found with this id" });
    else {
      await db.query("DELETE FROM Codes WHERE id=?", [couponId]);
      res.json({ message: "Successfully deleted" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  getAllCoupons,
  getCoupon,
  addCoupon,
  deleteCoupon,
};
