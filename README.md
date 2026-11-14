# OSU Job Explorer

A simple, searchable job listing website for Oregon State University positions.

**Website:** https://coffmaju.github.io/osu-job-explorer/

## Why This Project Exists

Oregon State University transitioned to Workday for job postings in July 2026. The Workday job search interface has several limitations:

- Job listings appear as large cards, displayed 20 at a time.
- There is no apparent option to sort positions by posting date or application deadline.
- Applicants cannot easily identify positions posted within the last few days.
- Some filters use confusing internal HR terminology.
- Browsing hundreds of listings is time-consuming, especially for applicants who check for new positions regularly.

OSU Job Explorer provides a simpler alternative: a compact, searchable table of job listings, with the newest postings displayed first.

## Features

- Retrieves job listings from OSU's public Workday careers system.
- Displays jobs in a compact HTML table.
- Sorts listings by posting recency, newest first.
- Provides a search box to filter by job title.
- Displays each position's title, posting age, and location.
- Links directly to the official Workday job description and application.
- Shows when the job data was last updated.
- Automatically refreshes job data twice daily.

## How It Works

The project uses Python, JSON, HTML, CSS, JavaScript, GitHub Actions, and GitHub Pages.

### 1. Retrieve Job Listings — Python

The script `scripts/update_jobs.py` requests public job listing data from OSU's Workday system.

Workday returns listings in batches of 20. The script requests successive batches until it has retrieved the available listings.

For each position, the script extracts information such as:

- Job title
- Posting age
- Location
- Requisition number
- Time remaining to apply
- Link to the official job posting

The script saves the results in `data/jobs.json`, together with the date and time of retrieval.

### 2. Display Job Listings — JavaScript

When someone opens the website, `js/job-explorer.js` loads the JSON file.

JavaScript then:

1. Reads the job listings.
2. Sorts them by posting recency.
3. Creates the HTML table rows.
4. Filters the displayed positions when a user types into the search box.
5. Displays the last-updated timestamp.

Filtering and sorting take place in the user's browser. The website does not need to contact Workday every time someone searches.

### 3. Format the Website — HTML and CSS

`index.html` provides the page structure, including the search field and results table.

`css/job-explorer.css` controls the appearance.

The interface is intentionally simple, emphasizing readable job listings rather than large cards.

### 4. Automatically Update Listings — GitHub Actions

The GitHub Actions workflow `.github/workflows/update-jobs.yml` runs the Python script automatically.

The workflow is scheduled for approximately **7:00 AM and 7:00 PM Pacific time** each day.

Each run:

1. Checks out the GitHub repository.
2. Sets up Python and installs the `requests` library.
3. Executes `scripts/update_jobs.py`.
4. Updates `data/jobs.json`.
5. Commits and pushes the updated data to the repository.

The workflow can also be started manually from the GitHub Actions tab.

### 5. Publish the Website — GitHub Pages

GitHub Pages hosts the website directly from the repository.

No separate web server, database server, or paid hosting service is required.

Visitors access the latest published JSON data through the website.

## Project Structure

osu-job-explorer/
├── .github/
│   └── workflows/
│       └── update-jobs.yml
├── css/
│   └── job-explorer.css
├── data/
│   └── jobs.json
├── js/
│   └── job-explorer.js
├── scripts/
│   └── update_jobs.py
├── index.html
└── README.md
```

## Data Limitations

The project uses information available through OSU's public Workday job listings.

Workday supplies relative posting dates such as "Posted Today," "Posted Yesterday," and "Posted 8 Days Ago," rather than exact posting dates in the listing response.

Similarly, application deadlines may be expressed as "4 days left to apply" or "30+ days left to apply."

Consequently, sorting by posting age is approximate, and exact application closing dates are not currently available from the retrieved data.

Applicants should consult the official Workday posting to verify deadlines and other details.

## Possible Future Improvements

- Clickable column headings for sorting.
- Filters for academic, professional, classified, and student positions.
- Sorting by time remaining to apply.
- Tracking newly appearing requisition numbers to identify jobs added since a previous visit.
- Additional location and employment-type filters.

## Disclaimer

This is an independent project and is not affiliated with or endorsed by Oregon State University.

Job information comes from OSU's publicly accessible Workday careers system. The official job posting should always be consulted for current requirements, deadlines, and application instructions.
