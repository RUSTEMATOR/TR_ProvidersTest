import {Page} from "@playwright/test";

export default class BasePage {
    public page: Page

    constructor(page: Page) {
        this.page = page
    }

    async navTo(url: string) {
        await this.page.goto(url)
    }

    async goBack() {
        await this.page.goBack()
    }
    
    async addLocatorHandler(locator, handler) {
        await this.page.addLocatorHandler(locator, handler)
    }
}