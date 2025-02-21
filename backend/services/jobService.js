const { fetchJobs, fetchIndeedJobs } = require("./jobService");
const { sendJobAlert } = require("./emailService");
const User = require("../models/User");

exports.sendJobAlertsToUsers = async () => {
  const users = await User.find({ jobPreferences: { $exists: true, $ne: [] } });

  for (const user of users) {
    const query = user.jobPreferences.join(" ");
    const [linkedinJobs, indeedJobs] = await Promise.all([
      fetchJobs(query),
      fetchIndeedJobs(query),
    ]);

    const allJobs = [...linkedinJobs, ...indeedJobs];
    if (allJobs.length > 0) {
      await sendJobAlert(user.email, allJobs);
    }
  }
};
