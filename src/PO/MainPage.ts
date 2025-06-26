import { Locator, Page } from "@playwright/test";
import BasePage from "./BasePage";

interface credentials {
    email: string,
    password: string
}

export default class MainPage extends BasePage {
    private signInButton: Locator = this.page.locator('aside  .button-secondary');
    private emailInput: Locator = this.page.locator('#email');
    private passwordInput: Locator = this.page.locator('#password');
    private submitLoginButton: Locator = this.page.locator('[data-role="modalContentWrapper"] button');
    private allProviders: Locator = this.page.locator('.provider-card');
    private gameCount: Locator = this.page.locator('.provider-card .text-p_games_count');
    private depositButton: Locator = this.page.locator('aside .button-primary');
    private providersDropdown: Locator = this.page.locator('.input_button');
    private gameCard: Locator = this.page.locator('.gameCardImage');
    private playGameButton: Locator = this.page.locator('.gameCardImage button.button-primary');
    private gameTitle: Locator = this.page.locator('div.items-center > p');
    private providerTitle: Locator = this.page.locator('p.text-center')
    private catalogueList: Locator = this.page.locator('main div.switcher-wrapper + div.items-center');
    private tournModal: Locator = this.page.locator('[data-test-id="tourn_modal"]');
    private customerIoMessage: Locator = this.page.locator('html.notranslate #gist-overlay');
    private depModal: Locator = this.page.locator('[data-test-id="dep_modal"]');
    private closeButton: Locator = this.page.locator('[data-test-id="close_btn"]')

    async openLoginModal() {
        console.log('Opening login modal...');
        await this.signInButton.click();
    }

    async handler() {
        const url: string = this.page.url()
        console.log('Handling modal close...');
        await this.closeButton.click();
        // if (await this.allProviders.first().isHidden()) {
        //     if (!url.includes('/games/')){
        //         await this.openProvidersDropdown()
        //     }
        // } 
    }

    async handrelCustomerIo() {
        const url: string = this.page.url()
        console.log('Reloading page to handle Customer.io overlay...');
        await this.page.reload();
        // if (await this.allProviders.first().isHidden()) {
        //     if (!url.includes('/games/')){
        //         await this.openProvidersDropdown()
        //     }
        // } 
    }

    async login({ email, password }: credentials) {
        console.log(`Logging in with email: ${email}`);
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.submitLoginButton.click();
        console.log('Login form submitted. Waiting for deposit button...');
        await this.depositButton.waitFor();
        console.log('Login successful.');
    }

    async openProvidersDropdown() {
        console.log('Opening providers dropdown...');
        await this.providersDropdown.click();
    }

    async getProvidersText() {
        console.log('Collecting provider names...');
        const providers = await this.allProviders.all();
        const allGameCount = await this.gameCount.all();

        console.log(`Removing ${allGameCount.length} game count elements...`);
        await Promise.all(
            allGameCount.map(async (counter) => {
                await counter.evaluate((node) => node.remove());
            })
        );

        const providerNames: string[] = [];

        for (let provider of await providers) {
            const text = await provider.textContent();
            if (text !== null && text !== undefined) {
                console.log(`Found provider: ${text.trim()}`);
                providerNames.push(text);
            } else {
                throw new Error('Provider text is undefined or null');
            }
        }

        return providerNames;
    }

    async getAllProviders() {
        console.log('Getting all provider locators...');
        console.log(await this.allProviders.all());
        return this.allProviders.all();
    }

    async clickOnProvider(provider: Locator) {
        console.log('Clicking on provider...');
        await provider.click();
    }

    async getAllGameCards(): Promise<Array<Locator>> {
        console.log('Waiting for catalogue list and loading game cards...');
        await this.catalogueList.waitFor({ state: "visible" });
        await this.page.waitForTimeout(4000);
        const cards = this.gameCard.all();
        console.log('Game cards loaded.');
        return cards;
    }

    async hoverOverGameCard(locator: Locator) {
        console.log('Hovering over game card...');
        await locator.hover();
    }

    async getAllPlayButtons(): Promise<Array<Locator>> {
        console.log('Getting all play buttons...');
        return await this.playGameButton.all();
    }

    async getGameTitle(index: number): Promise<string> {
        const gameCards = await this.getAllGameCards();
        const gameCard = gameCards[index];
        if (!gameCard) {
            throw new Error(`Game card at index ${index} not found.`);
        }

        const titleLocator = gameCard.locator(this.gameTitle);
        const titleText = await titleLocator.textContent();

        if (titleText === null) {
            throw new Error(`Title text at index ${index} is null.`);
        }

        return titleText;
    }

    async getProviderTitle(index: number): Promise<string> {
        const gameCards = await this.getAllGameCards();
        const gameCard = gameCards[index];
        if (!gameCard) {
            throw new Error(`Game card at index ${index} not found.`);
        }

        const titleLocator = gameCard.locator(this.providerTitle);
        const titleText = await titleLocator.textContent();

        if (titleText === null) {
            throw new Error(`Provider title text at index ${index} is null.`);
        }

        return titleText;
    }

    async clickOnPlayButton(index, button: Locator) {
        const gameCards = await this.getAllGameCards();

        const gameCard = gameCards[index];
        if (!gameCard) {
            throw new Error(`Game card at index ${index} not found.`);
        }

        console.log('Clicking on play button...');
        await this.hoverOverGameCard(gameCard);
        await button.click();
    }

    async closeDepModal(): Promise<void> {
        await this.closeButton.click()
    }

    get getGameCount() {
        console.log('Accessing game count locator...');
        return this.gameCount;
    }

    get getProvidersDropdown() {
        console.log('Accessing providers dropdown locator...');
        return this.providersDropdown;
    }

    get getTournModal() {
        console.log('Accessing tournament modal locator...');
        return this.tournModal;
    }

    get getCustomerIoMessage() {
        console.log('Accessing Customer.io message locator...');
        return this.customerIoMessage;
    }

    get getDepModal() {
        console.log('Accessing deposit modal locator...');
        return this.depModal;
    }

    get getProviderLocator() {
        return this.allProviders
    }


    get getCloseButton() {
        return this.closeButton
    }

}
