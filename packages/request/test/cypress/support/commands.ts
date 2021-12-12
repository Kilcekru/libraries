import { request } from "../../..";

declare global {
	// eslint-disable-next-line @typescript-eslint/no-namespace
	namespace Cypress {
		interface Chainable {
			req(url: string): Chainable;
		}
	}
}

Cypress.Commands.add("req", (url) => {
	return cy.wrap({ request }).invoke({ timeout: 0 }, "request", url);
});
