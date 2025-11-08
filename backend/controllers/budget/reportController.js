import Report from "../../models/budget/reportSchema.js"
import Employee from "../../models/budget/EmployeeSchema.js";
export const createReport = async (req, res) => {
  const { title, type, data } = req.body;
  console.log('Creating report for tenant:', req.user.tenantId);

  try {
    const report = new Report({
      title,
      type,
      data,
      createdBy: req.user.id,
      tenantId: req.user.tenantId,
    });
    await report.save();

    console.log('Report created successfully:', report._id);
    return res.status(201).json(report);
  } catch (error) {
    console.error('Create report error:', error);
    return res.status(400).json({ error: error.message });
  }
};

export const getReports = async (req, res) => {
  console.log('Fetching reports for tenant:', req.user.tenantId);

  try {
    const reports = await Report.find({ tenantId: req.user.tenantId });
    return res.status(200).json(reports);
  } catch (error) {
    console.error('Get reports error:', error);
    return res.status(400).json({ error: error.message });
  }
};


