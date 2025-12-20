import Billing from "../models/billing.js";

export const getReports = async (req, res) => {
  try {
    const { search, from, to } = req.query;

    let query = {};

    if (search) {
      query.productName = { $regex: search, $options: "i" };
    }

    if (from && to) {
      query.billedAt = {
        $gte: new Date(from),
        $lte: new Date(to),
      };
    }

    const reports = await Billing.find(query).sort({ billedAt: -1 });
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch reports" });
  }
};
