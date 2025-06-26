import {test} from "@playwright/test";
import MainPage from "../src/PO/MainPage";
import AuthController from "../src/apiControllers/authController";
import VpnController from "../src/VpnController/vpnController";
import dns from 'dns/promises';
import { USERS } from "../src/Users/users";



const testData = {
    IE: {
        location: 'Ireland',
        creds: USERS.IE
    },
    NL: {
        location: 'Netherlands - Amsterdam',
        creds: USERS.NL
    },
    DE: {
        location: 'Germany - Frankfurt - 1',
        creds: USERS.DE
    },
    BE: {
        location: 'Belgium',
        creds: USERS.BE
    },
    AU: {
        location: 'Australia - Melbourne',
        creds: USERS.AU
    },
    CH: {
        location: 'Switzerland',
        creds: USERS.CH
    },
    PT: {
        location: 'Portugal',
        creds: USERS.PT
    },
    AT: {
        location: 'Austria',
        creds: USERS.AT
    },
    SE: {
        location: 'Sweden',
        creds: USERS.SE
    },
    FR: {
        location: 'France - Paris - 1',
        creds: USERS.FR
    },
    SK: {
        location: 'Slovakia',
        creds: USERS.SK
    }
}


async function waitForDNS(domain: string, timeoutMs = 30000) {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
        try {
            await dns.lookup(domain);
            console.log(`[✓] Domain ${domain} is reachable`);
            return;
        } catch {
            console.log(`[⏳] Waiting for VPN to restore DNS...`);
            await new Promise(res => setTimeout(res, 1000));
        }
    }
    throw new Error(`DNS resolution failed for ${domain} after ${timeoutMs / 1000}s`);
}



for (let {location, creds} of Object.values(testData)) {

    test.describe(`Providers test ${location}`, () => {
        let mainPage: MainPage
        let vpnController: VpnController

        test.beforeEach(async ({page}) => {
            vpnController = new VpnController();
            mainPage = new MainPage(page);

            await vpnController.vpnConnnect(location);
            await waitForDNS('tombriches.com');

            await mainPage.navTo('https://tombriches.com'); 
            await mainPage.addLocatorHandler(mainPage.getTournModal, () => mainPage.handler())
            await mainPage.addLocatorHandler(mainPage.getCustomerIoMessage, () => mainPage.handrelCustomerIo())
            await mainPage.addLocatorHandler(mainPage.getDepModal, () => mainPage.handler())

            await mainPage.openLoginModal()
            await mainPage.login({email: creds.email, password: creds.password})

        })

        test('Check games of providers', async () => {
            await mainPage.openProvidersDropdown();
            await mainPage.getProviderLocator.first().waitFor({state: 'visible'})
            const providerNames = await mainPage.getAllProviders(); 
            
            for (const providerName of providerNames) {
                await mainPage.clickOnProvider(providerName);

                await mainPage.page.waitForTimeout(3000); 
                const playButtons = await mainPage.getAllPlayButtons();

                if (playButtons.length === 0) {
                    console.warn(`No games found for provider: ${providerName}`);
                    continue;
                }

                const numGamesToCheck = Math.min(2, playButtons.length); 
                for (let i = 0; i < numGamesToCheck; i++) {
                    // const gameTitle = await mainPage.getGameTitle(i);

                    await test.step(`Checking "${i}" of provider "${providerName}"`, async () => {
                        await mainPage.clickOnPlayButton(i, playButtons[i]);
                        await mainPage.page.waitForTimeout(15000);

                        // const safeTitle = gameTitle.replace(/[<>:"\/\\|?*]/g, '-'); // sanitize filename
                        await mainPage.page.screenshot({
                            path: `Screenshots/${location}/${providerName}_${i}.png`
                        });

                        await mainPage.navTo('/');
                        await mainPage.openProvidersDropdown();
                        await mainPage.clickOnProvider(providerName);
                    });
                }

                await mainPage.navTo('/'); 
            }
        });



        test.afterAll(async () => {
            await vpnController.vpnDisconnect()
            await vpnController.sleepVPN(2000)
        })
    })
}