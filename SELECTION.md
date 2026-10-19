# Project selection and evidence

Updated 19 October 2026. Three projects are selected at the owner's request. Azure Enrollment, Lexical Analyzer, and EduCore have been removed. Names follow repository names, with the requested display name IoT Air Quality Monitor for AirQualityMonitor. Only public content is included; source links are pinned to inspected revisions.

## IoT Air Quality Monitor

**Repository:** https://github.com/jarichooo/AirQualityMonitor

**Usefulness:** A poultry sensor monitoring system connecting ESP32 readings to a searchable web dashboard.

**Implementation:** The strongest systems example: validated sensor input, isolated database transactions, authenticated routes, and tests for failure states.

**Contribution evidence:** Contributed database/filter error checks and merged backend and responsive UI changes. The verified error-check commit is co-authored with Copilot Autofix.

**Limitations:** Real collection has not started. No predictive AI or calibrated MQ gas concentrations; trusted-LAN configuration.

- [README](https://github.com/jarichooo/AirQualityMonitor/blob/19d03cc74891648cd45915c57e85ffaadee8e062/README.md)
- [ingestion/ingest.py](https://github.com/jarichooo/AirQualityMonitor/blob/19d03cc74891648cd45915c57e85ffaadee8e062/ingestion/ingest.py)
- [web_app/test_app.py](https://github.com/jarichooo/AirQualityMonitor/blob/19d03cc74891648cd45915c57e85ffaadee8e062/web_app/test_app.py)
- [Verified contribution](https://github.com/jarichooo/AirQualityMonitor/commit/b53b4216f5c933a81cb5d82fc4da2481c48d95c9)

## Morphism

**Repository:** https://github.com/jarichooo/NLP-FINAL-PROJECT

**Usefulness:** A coursework project for correcting Filipino–English code-switched text.

**Implementation:** Combines a web client, API, model artifacts, and assertion-based backend tests with documented setup.

**Contribution evidence:** Added backend API/model test modules, dependency changes, CI configuration, and Docker setup in the public history.

**Limitations:** README documents /api/process, while checked-in routes implement /predict. Model quality and live demo availability were not independently tested.

- [README](https://github.com/jarichooo/NLP-FINAL-PROJECT/blob/27600cdb1d640dd1dc912cd8b3b1659611214014/README.md)
- [backend/app/routes.py](https://github.com/jarichooo/NLP-FINAL-PROJECT/blob/27600cdb1d640dd1dc912cd8b3b1659611214014/backend/app/routes.py)
- [backend/tests/test_api.py](https://github.com/jarichooo/NLP-FINAL-PROJECT/blob/27600cdb1d640dd1dc912cd8b3b1659611214014/backend/tests/test_api.py)
- [Verified contribution](https://github.com/jarichooo/NLP-FINAL-PROJECT/commit/f29caf0082d74cc486c72c9b3238f48085154b37)

## CrackTify

**Repository:** https://github.com/jarichooo/CrackTify

**Usefulness:** A Python desktop coursework application for analyzing wall-crack images and managing detection records.

**Implementation:** Connects a Flet interface, TensorFlow Lite inference, OpenCV image annotation, and backend record-management routes. The repository documents architecture, setup, team roles, and manual testing.

**Contribution evidence:** The public team matrix credits Joshua with digital image processing, AI training, and integration. Account-attributed history confirms merging the model-update pull request; this does not establish sole authorship.

**Limitations:** Model accuracy and structural-safety suitability were not independently validated. Testing documentation describes manual UI-focused checks. The inspected image module contains a duplicate method definition; this is a coursework prototype.

- [Project overview](https://github.com/jarichooo/CrackTify/blob/71aedc902ae0b98726e9fbdc0ef8e319041f52b9/docs/1-%20Project_Overview_%26_Problem_Statement.md)
- [Team contribution matrix](https://github.com/jarichooo/CrackTify/blob/71aedc902ae0b98726e9fbdc0ef8e319041f52b9/docs/8%20-%20Team_Roles_%26_Contribution_Matrix.md)
- [Image analysis implementation](https://github.com/jarichooo/CrackTify/blob/71aedc902ae0b98726e9fbdc0ef8e319041f52b9/askcrack-project/src/utils/detect_image.py)
- [Backend routes](https://github.com/jarichooo/CrackTify/blob/71aedc902ae0b98726e9fbdc0ef8e319041f52b9/server/app/routes/crack_routes.py)
- [Testing summary](https://github.com/jarichooo/CrackTify/blob/71aedc902ae0b98726e9fbdc0ef8e319041f52b9/docs/7%20-%20Testing_Summary.md)
- [Verified model-update merge](https://github.com/jarichooo/CrackTify/commit/16c8d3c5c17ad9d85c8d5b1991f8497874d32aa3)

CrackTify's top-level README is minimal, but its docs directory provides scope, architecture, team roles, setup, and manual testing notes. Team credit is documented attribution; the inspected merge demonstrates integration activity, not independent verification of who trained every model.

Upstream apps, hardware, model accuracy, and live demos were not run. No production-readiness or performance claims are made. Private repository content remains excluded.
