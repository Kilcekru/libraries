describe("First test", () => {
	it("simple get", () => {
		cy.intercept("/", { headers: { "content-type": "text/plain" }, body: "hello world" });
		cy.req("/").as("res");
		cy.get("@res").its("status").should("eq", 200);
		cy.get("@res").its("body").should("eq", "hello world");
	});
});
