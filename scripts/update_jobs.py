
import json
from pathlib import Path

import requests

ENDPOINT = (
    "https://oregonstate.wd501.myworkdayjobs.com"
    "/wday/cxs/oregonstate/OSU_Careers_Site/jobs"
)

jobs = []
offset = 0
limit = 20

while True:
    response = requests.post(
        ENDPOINT,
        json={
            "appliedFacets": {},
            "limit": limit,
            "offset": offset,
            "searchText": "",
        },
        timeout=30,
    )
    response.raise_for_status()
    data = response.json()

    batch = data.get("jobPostings", [])
    jobs.extend(batch)
    offset += len(batch)

    if not batch or len(batch) < limit:
        break

results = []

for job in jobs:
    path = job.get("externalPath", "")

    results.append({
        "title": job.get("title", ""),
        "posted": job.get("postedOn", ""),
        "location": (job.get("bulletFields") or [""])[0],
        "requisition": next(
            (
                field for field in job.get("bulletFields", [])
                if field.startswith("JR")
            ),
            "",
        ),
        "deadline": job.get("timeLeftToApply", ""),
        "url": (
            "https://oregonstate.wd501.myworkdayjobs.com"
            "/OSU_Careers_Site" + path
        ),
    })

output = Path("data/jobs.json")
output.parent.mkdir(parents=True, exist_ok=True)
output.write_text(
    json.dumps(results, indent=2, ensure_ascii=False),
    encoding="utf-8",
)

print(f"Saved {len(results)} OSU job listings.")
