import {Locator, Page} from "@playwright/test";
import BasePage from "./BasePage";
import { LoadFnOutput } from "module";
import { timeLog } from "console";
import { text } from "stream/consumers";

interface credentials {
    email: string,
    password: string
}

export default class MainPage extends BasePage {

    private signInButton: Locator = this.page.locator('aside  .button-secondary')
    private emailInput: Locator = this.page.locator('#email')
    private passwordInput: Locator = this.page.locator('#password')
    private submitLoginButton : Locator = this.page.locator('[data-role="modalContentWrapper"] button')
    private allProviders: Locator = this.page.locator('')
    private gameCount: Locator = this.page.locator('.provider-card .text-p_games_count')
    private depositButton: Locator = this.page.locator('header .button-primary')
    private providersDropdown: Locator = this.page.locator('.input_button')
    private gameCard: Locator = this.page.locator('.gameCardImage')
    private playGameButton: Locator = this.page.locator('.gameCardImage button.button-primary')
    private gameTitle: Locator = this.page.locator('')
    private catalogueList: Locator = this.page.locator('')
    private tournModal: Locator = this.page.locator('[data-test-id="tourn_modal"]')
    private customerIoMessage: Locator = this.page.locator('html.notranslate #gist-overlay')

    async openLoginModal() {
        await this.signInButton.click()
    }

    async handler() {
        await this.page.getByTitle('Cancel').click()
    }

    async handrelCustomerIo() {
        await this.page.reload()
    }

    async login({email, password}: credentials) {
        await this.emailInput.fill(email)
        await this.passwordInput.fill(password)
        await this.submitLoginButton.click()
        await this.depositButton.waitFor()
    }

    async openProvidersDropdown() {
        await this.providersDropdown.click()
    }

    async getProvidersText() {
        const providers = this.allProviders.all()
        const allGameCount = await this.gameCount.all()
        const providerNames: string[] = [];
        await Promise.all(
            allGameCount.map(async (counter) => {
                await counter.evaluate((node) => {
                    node.remove()
                })
            })
        ).then(() => {
            console.log('All game counts removed');
        })

        for (let provider of await providers) {
            const text = await provider.textContent();
            if (typeof(text) !== 'undefined' && text !== null) {
                providerNames.push(text)
            } else {
                throw new Error('Provider text is undefined or null');
            }
        }

        return providerNames;
    }

    async getAllProviders() {
        return this.allProviders.all()   
    }

    async clickOnProvider(provider: Locator) {
        await provider.click()
    }

    async getAllGameCards(): Promise<Array<Locator>> {
        await this.catalogueList.waitFor({state: "visible"})
        this.page.waitForTimeout(4000)
        return this.gameCard.all()
    }
    
    async hoverOverGameCard(locator: Locator) {
        await locator.hover()
    }

    async getAllPlayButtons(): Promise<Array<Locator>> {
        return await this.playGameButton.all()
    }

    async getGameTitle(index: number): Promise<string> {
        const gameCards = await this.getAllGameCards();

        const gameCard = gameCards[index];
        if (!gameCard) {
            throw new Error(`Game card at index ${index} not found.`);
        }

        await this.hoverOverGameCard(gameCard);

        const titleLocator = gameCard.locator(this.gameTitle);
        const titleText = await titleLocator.textContent();

        if (titleText === null) {
            throw new Error(`Title text at index ${index} is null.`);
        }

        return titleText;
    }

    async clickOnPlayButton(button: Locator) {
        await button.click()
    }

    get getGameCount() {
        return this.gameCount
    }

    get getProvidersDropdown() {
        return this.providersDropdown
    }

    get getTournModal() {
        return this.tournModal
    }

    get getCustomerIoMessage() {
        return this.customerIoMessage
    }
    
}