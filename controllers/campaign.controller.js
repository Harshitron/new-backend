import { CountTokensResponse } from "@google/genai";
import { chatSession } from "../config/GeminiModal.js";
import { extractJsonArrayFromText } from "../helper/ParseAIResponse.js";
import Campaign from "../models/campaign.model.js";
import CampaignHistory from "../models/campaignHistory.model.js";
import CommunicationLog from "../models/communicationLog.model.js";
import Customer from "../models/customer.model.js";
import { generateSequence } from "../utils/generateSequence.js";

const buildMongoQueryFromRules = (rules = []) => {
  const query = {};

  for (const rule of rules) {
    const { field, operator, value } = rule;

    console.log(field, operator,typeof value);

    switch (operator) {
      case "equals":
        query[field] = value;
        break;
      case "not_equals":
        query[field] = { $ne: value };
        break;
      case "greater_than":
        query[field] = { $gt: value };
        break;
      case "greater_than_equals":
        query[field] = { $gt: value };
        break;
      case "less_than":
        query[field] = { $lt: value };
        break;
      case "less_than_equals":
        query[field] = { $lt: value };
        break;
      case "contains":
        query[field] = { $regex: value, $options: "i" };
        break;
      case "not_contains":
        query[field] = { $not: { $regex: value, $options: "i" } };
        break;
      case "in":
        query[field] = { $in: value };
        break;
      case "not_in":
        query[field] = { $nin: value };
        break;
      default:
        throw new Error(`Unsupported operator: ${operator}`);
    }
  }

  return query;
};

export const previewCampaign = async (req, res) => {
  try {
    const { rules = [] } = req.body;

    const filter = buildMongoQueryFromRules(rules);
    const customers = await Customer.find(filter);

    return res.status(200).json({
      success: true,
      matchedCount: customers.length,
      customers,
    });
  } catch (error) {
    console.error("Preview error:", error);
    return res.status(500).json({
      success: false,
      message: "Error previewing campaign audience",
    });
  }
};

export const createCampaign = async (req, res) => {
  try {
    const {
      name,
      description,
      startDate,
      endDate,
      budget,
      rules = [],
    } = req.body;

    if (!rules.length) {
      return res.status(400).json({
        success: false,
        message: "Targeting rules are required to create a campaign",
      });
    }

    const campaignId = await generateSequence("campaign_seq");

    const filter = buildMongoQueryFromRules(rules);

    const matchingCustomers = await Customer.find(filter, { customerId: 1 });

    const targetCustomers = matchingCustomers.map((c) => c.customerId);

    const newCampaign = new Campaign({
      campaignId: `CAMP${campaignId.toString().padStart(3, "0")}`,
      name,
      description,
      startDate,
      endDate,
      targetingRules: rules,
      budget,
      targetCustomers,
      history: [
        {
          event: "Campaign Created",
          details: `Targeted ${targetCustomers.length} customers based on rules`,
        },
      ],
    });

    await newCampaign.save();

    const customerStatusList = matchingCustomers.map(({ customerId }) => ({
      customerId,
      status: "delivered", // You can change this logic based on actual delivery status
    }));

    const newCampaignHistory = new CampaignHistory({
      campaign: newCampaign._id,
      segmentRules: rules,
      audienceSize: targetCustomers.length,
      sent: 0,
      failed: 0,
      successRate: 0,
      status: newCampaign.status || "planned",
      customers: customerStatusList,
    });

    await newCampaignHistory.save();

      const newCommunicationLog = new CommunicationLog({
        campaignId: newCampaign._id,
        customersStatus: customerStatusList,
      });

      await newCommunicationLog.save();

    return res.status(201).json({
      success: true,
      message: "Campaign created successfully",
      campaign: newCampaign,
      campaignHistory: newCampaignHistory,
    });
  } catch (error) {
    console.error("Create campaign error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create campaign",
      error: error.message,
    });
  }
};

export const getAllCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, campaigns });
  } catch (error) {
    console.error("Get all campaigns error:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching campaigns",
    });
  }
};

export const getCampaignById = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);

    if (!campaign) {
      return res.status(404).json({ success: false, message: "Campaign not found" });
    }

    return res.status(200).json({ success: true, campaign });
  } catch (error) {
    console.error("Get campaign by ID error:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching campaign",
    });
  }
};

export const updateCampaign = async (req, res) => {
  try {
    const { rules = [], ...updateFields } = req.body;

    if (rules.length > 0) {
      const filter = buildMongoQueryFromRules(rules);
      const matchingCustomers = await Customer.find(filter, { customerId: 1 });
      updateFields.targetCustomers = matchingCustomers.map((c) => c.customerId);
      updateFields.targetingRules = rules;
    }

    const updated = await Campaign.findByIdAndUpdate(
      req.params.id,
      { ...updateFields, updatedAt: Date.now() },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: "Campaign not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Campaign updated successfully",
      campaign: updated,
    });
  } catch (error) {
    console.error("Update campaign error:", error);
    return res.status(500).json({
      success: false,
      message: "Error updating campaign",
    });
  }
};

export const deleteCampaign = async (req, res) => {
  try {
    const deleted = await Campaign.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Campaign not found" });
    }
    return res.status(200).json({ success: true, message: "Campaign deleted" });
  } catch (error) {
    console.error("Delete campaign error:", error);
    return res.status(500).json({
      success: false,
      message: "Error deleting campaign",
    });
  }
};

export const parseNaturalLanguageByGemini = async (req, res) => {

  const { userInput } = req.body;

  if (!userInput) {
    return res.status(400).json({
      success: false,
      message: "Missing userInput in request body",
    });
  }

  const segmentRulePrompt = `
      You are a helpful assistant that converts user instructions in natural language into an array of segment rules to filter customer data.

      Each rule should follow this format:
      {
        "field": string,        
        "operator": string,     
        "value": any           
      }

      Supported fields include:   "totalSpent", "visits", "lastOrderDate", "email", "name"  speeling must be same

      Supported operators: spelling must be same,
      - "equals" (e.g., gender equals female)
      - "not_equals" (e.g., city notEquals Mumbai)
      - "greater_than" / "less_than" (e.g., age greaterThan 25)
      - "in" (e.g., city in ["Delhi", "Mumbai"])
      - "contains" / "not_contains" (for arrays or strings)
      - "between" (for ranges, e.g., age between 20 and 30)

      input : ${userInput}
      `;


  try {
    const result = await chatSession.sendMessage({
      message:segmentRulePrompt ,
    });

    if (!result) {
      return res
        .status(404)
        .json({ success: false, message: "prompt not found" });
    }
    const rawText = result?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    const segmentRules = extractJsonArrayFromText(rawText);

    if (!segmentRules) {
      return res.status(400).json({
        success: false,
        message: "Could not extract valid segment rules from AI response.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Segment Rules recognized successfully",
      rules: segmentRules,
    });
  } catch (error) {
    console.error("error while generating", error);
    return res.status(500).json({
      success: false,
      message: "Error while generating",
    });
  }
};
