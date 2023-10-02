import { Modal, Setting } from "obsidian";
import GeocodingPlugin from "./main";

export class GeocodingSearchModal extends Modal {
	searchTerm: string;
	plugin: GeocodingPlugin;

	constructor(plugin: GeocodingPlugin, searchTerm: string) {
		super(plugin.app);
		this.plugin = plugin;
		this.searchTerm = searchTerm;
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.createEl("h1", {
			text: "Confirm search term",
		});
		new Setting(contentEl).setName("Name").addText((text) => {
			const component = text
				.setValue(this.searchTerm)
				.onChange((value) => {
					this.searchTerm = value;
				});
			// increase width for easier editing
			component.inputEl.style.width = "100%";
		});
		new Setting(contentEl).addButton((btn) =>
			btn
				.setButtonText("Submit")
				.setCta()
				.onClick(() => {
					this.close();
					this.plugin.getAndDisplayResults(this.searchTerm);
				})
		);
		// submit on enter (not sure why this doesn't work by default?)
		contentEl.addEventListener("keypress", (e) => {
			if (e.key === "Enter") {
				e.preventDefault();
				this.close();
				this.plugin.getAndDisplayResults(this.searchTerm);
			}
		});
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}
