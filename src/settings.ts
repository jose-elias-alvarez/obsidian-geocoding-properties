import { App, PluginSettingTab, Setting } from "obsidian";
import GeocodingPlugin from "./main";

export interface GeocodingPluginSettings {
	apiKey: string;
	insertAddress: boolean;
	insertLocation: boolean;
}

export const DEFAULT_SETTINGS: GeocodingPluginSettings = {
	apiKey: "",
	insertAddress: true,
	insertLocation: false,
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
	}
}
