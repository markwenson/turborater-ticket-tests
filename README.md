# Mutual of Enumclaw MT Home — Playwright Test Suite

Automated end-to-end tests for the Mutual of Enumclaw Montana Home product in TurboRater. The suite iterates through exterior wall and roof composition option combinations, captures screenshots at key steps, and verifies that quotes can be selected successfully.

---

## What It Tests

For each iteration (1–30), the test:

1. Logs into TurboRater
2. Imports a pre-built MT Home policy from an XML file
3. Handles optional modals (effective date confirmation, credit score entry)
4. Selects exterior wall and roof composition options by index
5. Screenshots the **Property Attribute** section
6. Navigates through the quote workflow:
   - Home Policy Page → HO Coverage → HO Company Questions → Pre-Comparison
7. Selects the **Mutual of Enumclaw** carrier
8. On the Comparison page, either:
   - **Success path**: Clicks the quote link and screenshots the `PropertyInfoContainerPanel` breakdown
   - **Error path**: Screenshots the error message panel before dismissing

---

## Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [Playwright](https://playwright.dev/) installed in your project
- A TurboRater account with access to the MT Home product
- The input XML file at the path specified below

### Install dependencies

```bash
npm install
npx playwright install chromium
```

---

## Configuration

### Environment Variables

Set the following before running tests:

| Variable | Description |
|---|---|
| `TR_USERNAME` | TurboRater login username |
| `TR_PASSWORD` | TurboRater login password |

You can use a `.env` file with a tool like `dotenv` or export them directly:

```bash
export TR_USERNAME="your_username"
export TR_PASSWORD="your_password"
```

### Input Data

The test imports a policy from a local XML file. Ensure it exists at:

```
C:/Users/lauron/Testing/turborater-ticket-tests/input-data/MT_Home.xml
```

Update the path in the test file if your local setup differs.

### Base URL

Set the `baseURL` in your `playwright.config.ts` to point at your TurboRater environment:

```ts
use: {
  baseURL: 'https://your-turborater-instance.com',
},
```

---

## Running the Tests

```bash
# Run all tests
npx playwright test tr-mutualenumsuiteMT.spec.js

# Run a specific iteration (e.g., iteration 5)
npx playwright test tr-mutualenumsuiteMT.spec.js --grep "Exterior walls and Roof composition - 5"

# Run with the Playwright UI
npx playwright test tr-mutualenumsuiteMT.spec.js --ui

# Run headed (visible browser)
npx playwright test tr-mutualenumsuiteMT.spec.js --headed
```

> **Note:** Tests are scoped to Chromium only and will be skipped on other browsers.

---

## Screenshots

Screenshots are saved to the `screenshots/` directory in the project root. Each iteration produces up to two files:

| File | Description |
|---|---|
| `{i}_PolicyPropertyAttribute.png` | Property Attribute section with selected wall/roof options |
| `{i}_BreakdownPropertyInfo.png` | Quote breakdown panel (success path) |
| `{i}_ErrorSelectQuote.png` | Error message panel (error path) |

---

## Test Timeout

Each test has a timeout of **120 seconds** to accommodate page load times and network-heavy workflows.

---

## Notes

- The test loops from index `1` to `30`. If the index exceeds the available options in a dropdown, it falls back to index `1`.
- The effective date and credit score modals are handled with graceful `try/catch` blocks — missing modals will not fail the test.
- Bridge quote link visibility is verified with a `waitForFunction` polling check before attempting to select a quote.
