import Billing from "../models/billing.js";

/* ---------- GET REPORTS (USER-SCOPED) ---------- */
export const getReports = async (req, res) => {
  try {
    const { search, from, to } = req.query;

    const query = {
      userId: req.userId,
    };

    // PRODUCT SEARCH
    if (search) {
      query.productName = {
        $regex: search,
        $options: "i",
      };
    }

    // DATE RANGE FILTER 
    if (from || to) {
      query.billedAt = {};

      if (from) {
        query.billedAt.$gte = new Date(from);
      }

      if (to) {
        const endOfDay = new Date(to);
        endOfDay.setHours(23, 59, 59, 999);
        query.billedAt.$lte = endOfDay;
      }
    }

    const reports = await Billing.find(query).sort({
      billedAt: -1,
    });

    res.status(200).json(reports);
  } catch (err) {
    console.error("REPORT ERROR:", err);
    res.status(500).json({ message: "Failed to fetch reports" });
  }
};
