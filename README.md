TurboRater Playwright Test Suite
End-to-end test documentation for all spec files


Setup & Configuration
These settings apply to all spec files in this suite.

Prerequisites
•	Node.js v18 or later
•	Playwright installed in the project
•	TurboRater account with access to the relevant product lines
•	Input XML policy files present at their configured paths

Install Dependencies
npm install
npx playwright install chromium

Environment Variables
Set the following before running any spec. Use a .env file with dotenv or export directly:

Variable	Description
TR_USERNAME	TurboRater login username
TR_PASSWORD	TurboRater login password

export TR_USERNAME="your_username"
export TR_PASSWORD="your_password"

Base URL
Set the baseURL in playwright.config.ts to point at your TurboRater environment:

use: {
  baseURL: 'https://your-turborater-instance.com',
},



Spec Index
All specs in this suite. Add a row here when adding a new spec file.

#	File	Description
1	roofAndWall_HomeMT.spec.js	Iterates exterior wall & roof composition options for MT Home



SPEC 1    Mutual of Enumclaw MT Home
roofAndWall_HomeMT.spec.js


Spec Details
Describe Block: Mutual of Enumclaw MT Home Test
Test Name Pattern: Exterior walls and Roof composition - {1..30}
Browser: Chromium only (skipped on Firefox and WebKit)
Test Count: 30 parameterized tests (loop index 1–30)
Timeout: 120 seconds per test

Purpose
Validates that the Mutual of Enumclaw Montana Home product in TurboRater can successfully generate quotes across all combinations of exterior wall and roof composition dropdown options. The suite iterates through indices 1–30, selecting each option permutation, capturing screenshots at key steps, and verifying quote selection succeeds or gracefully surfaces an error.

Test Flow
1.	Log into TurboRater with environment-variable credentials
2.	Navigate to Quotes and import the MT_Home.xml policy file
3.	Handle optional modals: Effective Date confirmation and Credit Score entry
4.	Select exterior wall option by loop index (CPH_ConstructionEntry)
5.	Select roof composition option by loop index (CPH_RoofCompositionEntry)
6.	Screenshot the PropertyAttributeDivLeft section
7.	Advance through: Home Policy → HO Coverage → HO Company Questions → Pre-Comparison
8.	Select Mutual of Enumclaw on the Pre-Comparison page
9.	On HOComparisonPageNew, poll until BridgeQuoteLink elements are visible
10.	Success path: click SelectQuoteLink_0, confirm modal, screenshot PropertyInfoContainerPanel
11.	Error path: screenshot CPH_MessagePanel error, dismiss modal

Key Locators
Locator	Description
#CPH_ConstructionEntry	Exterior wall type dropdown
#CPH_RoofCompositionEntry	Roof composition dropdown
div.PropertyAttributeDivLeft	Property Attribute screenshot target
#BottomNextButton	Page-advance submit button
a[id^="CPH_ComparisonGrid_BridgeQuoteLink"]	Bridge quote availability links
#CPH_ComparisonGrid_SelectQuoteLink_0	First carrier quote select link
div#CPH_MessagePanel	Success/error message panel
div#CPH_PropertyInfoContainerPanel	Quote breakdown panel (success)

Fallback Logic
If the loop index i exceeds the number of available options in a dropdown, the test falls back to index 1 rather than failing. This prevents out-of-bounds errors when dropdowns have fewer than 30 options.

URL Sequence
URL Pattern	Page
/welcome	Post-login landing page
/HOCoverage	HO Coverage page
/HOCompanyQuestionPage	HO Company Questions page
/HOPreComparisonPage	Pre-Comparison carrier selection
/HOComparisonPageNew	Comparison results page

Screenshots
File	Path	Description
{i}_PolicyPropertyAttribute.png	Success + Error	Property Attribute section with selected wall/roof options
{i}_BreakdownPropertyInfo.png	Success only	Quote breakdown panel
{i}_ErrorSelectQuote.png	Error only	Error message panel before dismissal

Run Commands
# Run all tests
npx playwright test roofAndWall_HomeMT.spec.js

# Run a specific iteration
npx playwright test roofAndWall_HomeMT.spec.js --grep "Exterior walls and Roof composition - 5"

# Playwright UI
npx playwright test roofAndWall_HomeMT.spec.js --ui

# Headed (visible browser)
npx playwright test roofAndWall_HomeMT.spec.js --headed

Notes
•	The test loops from index 1 to 30. If the index exceeds available dropdown options, it falls back to index 1.
•	Effective date and credit score modals are handled with graceful try/catch blocks — missing modals will not fail the test.
•	Bridge quote link visibility is verified with a waitForFunction polling check before attempting to select a quote.