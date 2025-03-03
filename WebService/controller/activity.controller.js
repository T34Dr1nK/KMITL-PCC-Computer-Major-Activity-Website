const FetchService = require("../services/fetch.services");

async function getAllActivities(req, res) {
  try {
    const activities = await FetchService.getAllData("Activity","TYPE_HAVE");
    console.log("Fetch complete");
    res.status(200).json(activities);
  } catch (error) {
    console.error("Error fetching activities:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function getActivityById(req, res) {
  try {
    const { id } = req.params;
    const activity = await FetchService.getDataById("Activity","TYPE_HAVE", id);

    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }
    console.log("Fetch complete");
    res.status(200).json(activity);
  } catch (error) {
    console.error("Error fetching activity:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = { getAllActivities, getActivityById };
