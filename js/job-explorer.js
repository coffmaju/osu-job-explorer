
"use strict";

// OSU Job Explorer
// Load, sort, search, and display job listings.

let allJobs = [];

// Convert Workday's relative posting dates into numbers.
function daysAgo(posted) {
  if (posted === "Posted Today") return 0;
  if (posted === "Posted Yesterday") return 1;

  const match = posted?.match(/Posted (\d+) Days? Ago/);

  if (match) return Number(match[1]);

  if (posted?.includes("30+ Days Ago")) return 30;

  return 999;
}

// Load job data from our local JSON file.
async function loadJobs() {
  try {
    const response = await fetch("data/jobs.json", {
      cache: "no-store"
    });

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const data = await response.json();
    
    allJobs = data.jobs;
    
    document.querySelector("#last-updated").textContent =
      "Last updated: " +
      new Date(data.lastUpdated).toLocaleString();
    // Newest postings first.
    allJobs.sort(
      (a, b) => daysAgo(a.posted) - daysAgo(b.posted)
    );

    renderJobs();

    console.log(`Loaded ${allJobs.length} jobs`);
  } catch (error) {
    console.error("Unable to load jobs:", error);
  }
}

// Display jobs matching the search text.
function renderJobs() {
  const search = document.querySelector("#search");
  const tbody = document.querySelector("#jobs");

  const query = search.value.trim().toLowerCase();

  const filteredJobs = allJobs.filter(job =>
    job.title.toLowerCase().includes(query)
  );

  tbody.replaceChildren();

  filteredJobs.forEach(job => {
    const row = document.createElement("tr");

    // Job title, linked to the original Workday posting.
    const titleCell = document.createElement("td");
    if (job.url) {
      const link = document.createElement("a");
      link.href = job.url.replace(
          ".com/job/",
          ".com/OSU_Careers_Site/job/"
        );
      link.textContent = job.title;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      titleCell.appendChild(link);
    } else {
      titleCell.textContent = job.title;
    }

    const postedCell = document.createElement("td");
    postedCell.textContent = job.posted;

    const locationCell = document.createElement("td");
    locationCell.textContent = job.location;

    row.append(titleCell, postedCell, locationCell);
    tbody.appendChild(row);
  });
}

// Search as the user types.
document.querySelector("#search")
  .addEventListener("input", renderJobs);

// Load the data when the page is ready.
loadJobs();
