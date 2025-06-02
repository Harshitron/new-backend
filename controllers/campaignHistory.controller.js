import Campaign from "../models/campaign.model.js";
import CommunicationLog from "../models/communicationLog.model.js";
import Customer from "../models/customer.model.js";

export const getCampaignHistory = async (req, res) => {
  try {
    const includeCustomers = req.query.includeCustomers === "true";

    const campaigns = await Campaign.find().sort({ createdAt: -1 });

    let totalSentEmail = 0;
    let totalAudienceSize = 0;
    let totalFailed = 0;

    const history = await Promise.all(
      campaigns.map(async (campaign) => {
        let log = await CommunicationLog.findOne({ campaignId: campaign._id });

        if (!log) {
          const targetCustomerIds = campaign.targetCustomers || [];
          const total = targetCustomerIds.length;
          const successRate = Math.floor(Math.random() * (90 - 85 + 1)) + 85;
          const successfulCount = Math.floor((successRate / 100) * total);

          const shuffled = [...targetCustomerIds].sort(() => 0.5 - Math.random());
          const successfulIds = new Set(shuffled.slice(0, successfulCount));

          const customersStatus = targetCustomerIds.map(customerId => ({
            customerId,
            status: successfulIds.has(customerId) ? "delivered" : "failed",
            sentAt: new Date(),
          }));

          log = await CommunicationLog.create({
            campaignId: campaign._id,
            customersStatus,
          });
        }

        const total = log?.customersStatus?.length || 0;
        const failed = log?.customersStatus?.filter(c => c.status === "failed").length || 0;
        const sent = total;
        const success = sent - failed;
        const successRate = sent > 0 ? ((success / sent) * 100).toFixed(2) + "%" : "0%";

        let customers = [];

        if (includeCustomers && log?.customersStatus?.length) {
          const customerIds = log.customersStatus.map(c => c.customerId);
          const customerDataMap = await Customer.find({ customerId: { $in: customerIds } })
            .then(docs =>
              docs.reduce((acc, doc) => {
                acc[doc.customerId] = doc;
                return acc;
              }, {})
            );

          customers = log.customersStatus.map(({ customerId, status, sentAt }) => {
            const customer = customerDataMap[customerId] || {};
            return {
              ...customer._doc,
              deliveryStatus: status,
              sentAt,
            };
          });
        }

        totalSentEmail += sent;
        totalAudienceSize += campaign.targetCustomers.length;
        totalFailed += failed;

        return {
          campaignId: campaign.campaignId,
          name: campaign.name,
          rules: campaign.targetingRules,
          audienceSize: campaign.targetCustomers.length,
          sent,
          failed,
          successRate,
          status: campaign.status,
          createdAt: campaign.createdAt,
          customers: includeCustomers ? customers : undefined,
        };
      })
    );

    res.status(200).json({
      message: "Fetched all campaign successfully",
      history,
      totalSize: history.length,
      totalSent: totalSentEmail,
      totalAudienceSize,
      successRate:
        totalAudienceSize > 0
          ? (((totalSentEmail - totalFailed) / totalAudienceSize) * 100).toFixed(2)
          : "0",
    });
  } catch (error) {
    console.error("Error fetching campaign history:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
