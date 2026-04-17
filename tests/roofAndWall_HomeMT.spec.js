// @ts-check
import { test, expect } from '@playwright/test';

test.skip(({ browserName }) => browserName != 'chromium', 'Only test chrome');


test.describe('Mutual of Enumclaw MT Home Test', () => {
    // Iterate through exterior wall and roof composition options, taking screenshots of the property attribute section.
    for (let i = 1; i < 31; i++) {
        test(`Exterior walls and Roof composition - ${i}`, async ({ page }) => {
            test.setTimeout(120000);
            await page.goto('');
            await page.getByRole('textbox').fill(process.env.TR_USERNAME || '');
            await page.getByRole('button', { name: 'Log in' }).click();
            await page.locator('input[type="password"]').fill(process.env.TR_PASSWORD || '');
            await page.getByRole('button', { name: 'Log in' }).click();
            await expect(page).toHaveURL(/welcome/);
            await page.getByText('Location Assignment').waitFor({ state: 'visible'});
            await expect(page.getByText('Location Assignment')).toBeVisible();
            await page.locator('input[value="Continue"]').click();
            await page.getByRole('link', { name: 'Quotes' }).waitFor({ state: 'visible'});
            await page.getByRole('link', { name: 'Quotes' }).click();
            await page.getByRole('link', { name: 'Import quote' }).waitFor({ state: 'visible'});
            await page.getByRole('link', { name: 'Import quote' }).click();

            // Input files directly
            await page.getByText('Import Policy From File OK').waitFor({ state: 'visible'});
            await page.locator('input#importFilePopup_ImportFileNameEntry').setInputFiles('C:/Users/lauron/Testing/turborater-ticket-tests/input-data/MT_Home.xml');
            await page.getByRole('button', { name: 'OK' }).click();
            await page.waitForLoadState('domcontentloaded');

            // Effective date handler
            await page.waitForLoadState('networkidle');
            try {
                const policyDateconfirm = page.getByText('Confirm Policy Effective Date');
                await policyDateconfirm.waitFor({ state: 'visible', timeout: 5000 });
                await page.getByRole('radio', { name: 'Set to Today' }).click();
                await page.getByRole('button', { name: 'Set Effective Date' }).click();
            } catch { /* modal did not appear */ }


            // Credit score handler
            try {
                const creditScore = page.locator('#CPH_AllowCreditScoreEntry');
                await creditScore.waitFor({ state: 'visible', timeout: 5000 });
                await creditScore.selectOption({ index: 2 });
            } catch { /* field did not appear */ }

            const exteriorWallOptions = await page.locator('#CPH_ConstructionEntry option').count();
            const roofCompositionOptions = await page.locator('#CPH_RoofCompositionEntry option').count();

            // Exterior walls
            if(i < exteriorWallOptions) {
                await page.locator('#CPH_ConstructionEntry').selectOption({ index: i });
            } else {
                await page.locator('#CPH_ConstructionEntry').selectOption({ index: 1 });
            }
            
            if(i < roofCompositionOptions) {
            // Roof composition entry
            await page.locator('#CPH_RoofCompositionEntry').selectOption({ index: i });
            } else {
                await page.locator('#CPH_RoofCompositionEntry').selectOption({ index: 1 });
            }

            // Screenshot for property composition and roof composition entries
            await page.locator('div[class="PropertyAttributeDivLeft"]').screenshot({ path: `screenshots/${i}_PolicyPropertyAttribute.png` });

            // Navigating to next page
            const submit = page.locator('#BottomNextButton');
            await submit.scrollIntoViewIfNeeded();
            await expect(submit).toBeEnabled();
            await submit.click();

            // From HOCoveragePage
            await page.waitForURL(/HOCoverage/);
            await page.waitForLoadState('networkidle');
            await page.waitForLoadState('domcontentloaded');
            await submit.click();
            await page.waitForTimeout(3000);

            //From HOCompanyQuestionPage
            await page.waitForURL(/HOCompanyQuestionPage/);
            await page.waitForLoadState('networkidle');
            await page.waitForLoadState('domcontentloaded');
            await submit.click();
            await page.waitForTimeout(3000);

            // From PreComparisonPage
            await page.waitForURL(/HOPreComparisonPage/);
            await page.waitForLoadState('networkidle');
            await page.waitForLoadState('domcontentloaded');
            await page.getByRole('link', { name: 'Mutual of Enumclaw' }).waitFor({ state: 'visible' });
            await page.getByRole('link', { name: 'Mutual of Enumclaw' }).click();
            await page.waitForTimeout(3000);

            // From HOComparisonPageNew
            await page.waitForURL(/HOComparisonPageNew/);
            await page.waitForLoadState('networkidle');
            await page.waitForLoadState('domcontentloaded');

            // Wait  for bridge quote links to be visible
            await page.waitForTimeout(3000);
            await page.waitForFunction(() =>
                document.querySelectorAll('a[id^="CPH_ComparisonGrid_BridgeQuoteLink"][style*="visibility:hidden"]').length === 0
            );

            const bridgeQuoteLinks = page.locator('a[id^="CPH_ComparisonGrid_BridgeQuoteLink"]:not([disabled])');
            const bridgeQuoteCount = await bridgeQuoteLinks.count();

            if (bridgeQuoteCount > 0) {
                await page.locator('#CPH_ComparisonGrid_SelectQuoteLink_0').click();
                await page.locator('div#CPH_MessagePanel:not([style*="display: none"])').waitFor({ state: 'visible' });
                await page.getByRole('button', { name: 'Ok' }).click();
                await page.waitForLoadState('networkidle');
                await page.waitForLoadState('domcontentloaded');
                await page.waitForTimeout(3000);
                try {
                    await page.locator('div#CPH_PropertyInfoContainerPanel').screenshot({ path: `screenshots/${i}_BreakdownPropertyInfo.png` });
                } catch {/* panel did not appear */ }
            } else {
                // Selecting Mutual of Enumclaw quote
                await page.locator('#CPH_ComparisonGrid_SelectQuoteLink_0').click();
                await page.locator('div#CPH_MessagePanel:not([style*="display: none"])').waitFor({ state: 'visible' });
                await page.locator('div#CPH_MessagePanel:not([style*="display: none"])').screenshot({ path: `screenshots/${i}_ErrorSelectQuote.png` });
                await page.getByRole('button', { name: 'Ok' }).click();
                await page.waitForLoadState('networkidle');
                await page.waitForLoadState('domcontentloaded');
                await page.waitForTimeout(3000);
            }
        });
    }
});
//end

