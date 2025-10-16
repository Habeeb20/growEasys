
import Compliance from "../../models/budget/complianceSchema.js"
export const createCompliance = async (req, res) => {
  const { type, metric, value } = req.body;
  console.log('Creating compliance record for tenant:', req.user.tenantId);

  try {
    const compliance = new Compliance({
      type,
      metric,
      value,
      tenantId: req.user.tenantId,
    });
    await compliance.save();

    console.log('Compliance record created successfully:', compliance._id);
    return res.status(201).json(compliance);
  } catch (error) {
    console.error('Create compliance error:', error);
    return res.status(400).json({ error: error.message });
  }
};

export const getCompliance = async (req, res) => {
  console.log('Fetching compliance records for tenant:', req.user.tenantId);

  try {
    const complianceRecords = await Compliance.find({ tenantId: req.user.tenantId });
    return res.status(200).json(complianceRecords);
  } catch (error) {
    console.error('Get compliance error:', error);
    return res.status(400).json({ error: error.message });
  }
};