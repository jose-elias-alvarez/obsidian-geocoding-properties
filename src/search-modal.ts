import { Modal, Setting } from "obsidian";
import GeocodingPlugin from "./main";
import { GeocodingResultsModal } from "./results-modal";

export class GeocodingSearchModal extends Modal {
	searchTerm: string;
	plugin: GeocodingPlugin;

	constructor(plugin: GeocodingPlugin, searchTerm: string) {
		super(plugin.app);
		this.plugin = plugin;
		this.searchTerm = searchTerm;
	}

	async onSubmit() {
		this.close();
		const results = await this.plugin.getResults(this.searchTerm);
		new GeocodingResultsModal(this.plugin, results).open();
	}

	onOpen() {
		const { contentEl } = this;
		this.setTitle("Confirm search term");

		const inputContainer = contentEl.createEl("div", { cls: "geocoding-search-container" });

		new Setting(inputContainer).setName("Name").addText((text) => {
			const component = text
				.setValue(this.searchTerm)
				.onChange((value) => {
					this.searchTerm = value;
				});
			// increase width for easier editing
			component.inputEl.style.width = "100%";
		});

		const buttonContainer = contentEl.createEl("div", { cls: "modal-button-container" });

		const submitButton = buttonContainer.createEl("button", { text: "Submit", cls: "mod-cta" });
		submitButton.addEventListener("click", async () => {
			await this.onSubmit();
		});

		// submit on enter (not sure why this doesn't work by default?)
		contentEl.addEventListener("keypress", async (e) => {
			if (e.key === "Enter") {
				e.preventDefault();
				await this.onSubmit();
			}
		});
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}
