# Test info

- Name: Providers test Portugal >> Check games of providers
- Location: /home/rustem/Desktop/TR_ProvidersTest/tests/games.spec.ts:109:13

# Error details

```
Error: locator.click: Target page, context or browser has been closed
Call log:
  - waiting for locator('aside  .button-secondary')
    - locator resolved to <button title="Log in" class="btn button-secondary ">Log in</button>
  - attempting click action
    - waiting for element to be visible, enabled and stable
    - element is visible, enabled and stable
    - scrolling into view if needed
    - done scrolling

    at MainPage.openLoginModal (/home/rustem/Desktop/TR_ProvidersTest/src/PO/MainPage.ts:30:33)
    at /home/rustem/Desktop/TR_ProvidersTest/tests/games.spec.ts:104:28
```

# Test source

```ts
   1 | import { Locator, Page } from "@playwright/test";
   2 | import BasePage from "./BasePage";
   3 |
   4 | interface credentials {
   5 |     email: string,
   6 |     password: string
   7 | }
   8 |
   9 | export default class MainPage extends BasePage {
   10 |     private signInButton: Locator = this.page.locator('aside  .button-secondary');
   11 |     private emailInput: Locator = this.page.locator('#email');
   12 |     private passwordInput: Locator = this.page.locator('#password');
   13 |     private submitLoginButton: Locator = this.page.locator('[data-role="modalContentWrapper"] button');
   14 |     private allProviders: Locator = this.page.locator('.provider-card');
   15 |     private gameCount: Locator = this.page.locator('.provider-card .text-p_games_count');
   16 |     private depositButton: Locator = this.page.locator('aside .button-primary');
   17 |     private providersDropdown: Locator = this.page.locator('.input_button');
   18 |     private gameCard: Locator = this.page.locator('.gameCardImage');
   19 |     private playGameButton: Locator = this.page.locator('.gameCardImage button.button-primary');
   20 |     private gameTitle: Locator = this.page.locator('div.items-center > p');
   21 |     private providerTitle: Locator = this.page.locator('p.text-center')
   22 |     private catalogueList: Locator = this.page.locator('main div.switcher-wrapper + div.items-center');
   23 |     private tournModal: Locator = this.page.locator('[data-test-id="tourn_modal"]');
   24 |     private customerIoMessage: Locator = this.page.locator('html.notranslate #gist-overlay');
   25 |     private depModal: Locator = this.page.locator('[data-test-id="dep_modal"]');
   26 |     private closeButton: Locator = this.page.locator('[data-test-id="close_btn"]')
   27 |
   28 |     async openLoginModal() {
   29 |         console.log('Opening login modal...');
>  30 |         await this.signInButton.click();
      |                                 ^ Error: locator.click: Target page, context or browser has been closed
   31 |     }
   32 |
   33 |     async handler() {
   34 |         const url: string = this.page.url()
   35 |         console.log('Handling modal close...');
   36 |         await this.closeButton.click();
   37 |         // if (await this.allProviders.first().isHidden()) {
   38 |         //     if (!url.includes('/games/')){
   39 |         //         await this.openProvidersDropdown()
   40 |         //     }
   41 |         // } 
   42 |     }
   43 |
   44 |     async handrelCustomerIo() {
   45 |         const url: string = this.page.url()
   46 |         console.log('Reloading page to handle Customer.io overlay...');
   47 |         await this.page.reload();
   48 |         // if (await this.allProviders.first().isHidden()) {
   49 |         //     if (!url.includes('/games/')){
   50 |         //         await this.openProvidersDropdown()
   51 |         //     }
   52 |         // } 
   53 |     }
   54 |
   55 |     async login({ email, password }: credentials) {
   56 |         console.log(`Logging in with email: ${email}`);
   57 |         await this.emailInput.fill(email);
   58 |         await this.passwordInput.fill(password);
   59 |         await this.submitLoginButton.click();
   60 |         console.log('Login form submitted. Waiting for deposit button...');
   61 |         await this.depositButton.waitFor();
   62 |         console.log('Login successful.');
   63 |     }
   64 |
   65 |     async openProvidersDropdown() {
   66 |         console.log('Opening providers dropdown...');
   67 |         await this.providersDropdown.click();
   68 |     }
   69 |
   70 |     async getProvidersText() {
   71 |         console.log('Collecting provider names...');
   72 |         const providers = await this.allProviders.all();
   73 |         const allGameCount = await this.gameCount.all();
   74 |
   75 |         console.log(`Removing ${allGameCount.length} game count elements...`);
   76 |         await Promise.all(
   77 |             allGameCount.map(async (counter) => {
   78 |                 await counter.evaluate((node) => node.remove());
   79 |             })
   80 |         );
   81 |
   82 |         const providerNames: string[] = [];
   83 |
   84 |         for (let provider of await providers) {
   85 |             const text = await provider.textContent();
   86 |             if (text !== null && text !== undefined) {
   87 |                 console.log(`Found provider: ${text.trim()}`);
   88 |                 providerNames.push(text);
   89 |             } else {
   90 |                 throw new Error('Provider text is undefined or null');
   91 |             }
   92 |         }
   93 |
   94 |         return providerNames;
   95 |     }
   96 |
   97 |     async getAllProviders() {
   98 |         console.log('Getting all provider locators...');
   99 |         console.log(await this.allProviders.all());
  100 |         return this.allProviders.all();
  101 |     }
  102 |
  103 |     async clickOnProvider(provider: Locator) {
  104 |         console.log('Clicking on provider...');
  105 |         await provider.click();
  106 |     }
  107 |
  108 |     async getAllGameCards(): Promise<Array<Locator>> {
  109 |         console.log('Waiting for catalogue list and loading game cards...');
  110 |         await this.catalogueList.waitFor({ state: "visible" });
  111 |         await this.page.waitForTimeout(4000);
  112 |         const cards = this.gameCard.all();
  113 |         console.log('Game cards loaded.');
  114 |         return cards;
  115 |     }
  116 |
  117 |     async hoverOverGameCard(locator: Locator) {
  118 |         console.log('Hovering over game card...');
  119 |         await locator.hover();
  120 |     }
  121 |
  122 |     async getAllPlayButtons(): Promise<Array<Locator>> {
  123 |         console.log('Getting all play buttons...');
  124 |         return await this.playGameButton.all();
  125 |     }
  126 |
  127 |     async getGameTitle(index: number): Promise<string> {
  128 |         const gameCards = await this.getAllGameCards();
  129 |         const gameCard = gameCards[index];
  130 |         if (!gameCard) {
```