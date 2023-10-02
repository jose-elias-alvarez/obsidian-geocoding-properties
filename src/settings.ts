import { App, PluginSettingTab, Setting } from "obsidian";
import GeocodingPlugin from "./main";

export interface GeocodingPluginSettings {
	apiKey: string;
	insertAddress: boolean;
	insertLocation: boolean;
	mapLinkProvider?: "google" | "apple";
}

export const DEFAULT_SETTINGS: GeocodingPluginSettings = {
	apiKey: "",
	insertAddress: true,
	insertLocation: false,
	mapLinkProvider: undefined,
};

export class GeocodingPluginSettingTab extends PluginSettingTab {
	plugin: GeocodingPlugin;

	constructor(app: App, plugin: GeocodingPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();
		containerEl.createEl("h2", { text: "API Key" });
		new Setting(containerEl).setName("Maps API Key").addText((text) =>
			text
				.setPlaceholder("Enter your API key")
				.setValue(this.plugin.settings.apiKey)
				.onChange(async (value) => {
					this.plugin.settings.apiKey = value;
					await this.plugin.saveSettings();
				})
		);
		containerEl.createEl("h2", { text: "Properties" });
		new Setting(containerEl).setName("Address").addToggle((toggle) =>
			toggle
				.setValue(this.plugin.settings.insertAddress)
				.onChange(async (value) => {
					this.plugin.settings.insertAddress = value;
					await this.plugin.saveSettings();
				})
		);
		new Setting(containerEl)
			.setName("Location")
			.setDesc(
				"Latitude and longitude in an obsidian-leaflet-compatible format"
			)
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.insertLocation)
					.onChange(async (value) => {
						this.plugin.settings.insertLocation = value;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("Map link")
			.setDesc("A map link from the chosen provider")
			.addDropdown((dropdown) =>
				dropdown
					.addOptions({
						none: "None",
						google: "Google Maps",
						apple: "Apple Maps",
					})
					.onChange(async (value) => {
						switch (value) {
							case "none":
								this.plugin.settings.mapLinkProvider =
									undefined;
								break;
							case "google":
								this.plugin.settings.mapLinkProvider = "google";
								break;
							case "apple":
								this.plugin.settings.mapLinkProvider = "apple";
								break;
						}
						await this.plugin.saveSettings();
					})
			);
	}
}
