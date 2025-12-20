import Billing from "../models/billing.js";

/* ---------- GET REPORTS (USER-SCOPED) ---------- */
export const getReports = async (req, res) => {
  try {
    const { search, from, to } = req.query;

    // 🔥 START WITH USER FILTER
    const query = {
      userId: req.userId,
    };

    // 🔎 PRODUCT SEARCH
    if (search) {
      query.productName = { $regex: search, $options: "i" };
    }

    // 📅 DATE RANGE FILTER (USING createdAt)
    if (from && to) {
      query.createdAt = {
        $gte: new Date(from),
        $lte: new Date(to),
      };
    }

    const reports = await Billing.find(query).sort({
      createdAt: -1,
    });

    res.status(200).json(reports);
  } catch (err) {
    console.error("REPORT ERROR:", err);
    res.status(500).json({ message: "Failed to fetch reports" });
  }
};
