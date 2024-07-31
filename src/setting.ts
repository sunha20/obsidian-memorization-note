import {App, PluginSettingTab, Setting} from "obsidian";
import MemorizationNote from "./main";

export interface MemorizationNoteSettings {
	headingMode: "basic" | "link";
	contentsMode: "empty" | "blank" | "copy";
	blankStart: string;
	blankEnd: string;
}

export const DEFAULT_SETTINGS: MemorizationNoteSettings = {
	headingMode: "basic",
	contentsMode: "empty",
	blankStart: "{",
	blankEnd: "}",
}

export class MemorizationNoteSettingTab extends PluginSettingTab {
	plugin: MemorizationNote;

	constructor(app: App, plugin: MemorizationNote) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('Heading Mode')
			.setDesc("Basic: Mode that copies the normal headings from the original note.\nLink: Mode that adds a link to the original note's corresponding heading to the normal heading.")
			.addDropdown((component) => {
				component
					.addOptions({
						"basic": "basic",
						"link": "link",
					})
					.setValue(String(this.plugin.settings.headingMode))
					.onChange(async (value) => {
						if (value == "link" || value == "basic") {
							this.plugin.settings.headingMode = value;
							await this.plugin.saveSettings();
						}
					})
			})

		new Setting(containerEl)
			.setName('Contents Mode')
			.setDesc("Empty: Mode that does not copy anything except the heading.\nBlank: Mode that blanks the marked areas.\nCopy: Duplicate mode")
			.addDropdown((component) => {
				component
					.addOptions({
						"empty": "empty",
						"blank": "blank",
						"copy": "copy",
					})
					.setValue(String(this.plugin.settings.contentsMode))
					.onChange(async (value) => {
						if (value == "empty" || value == "blank" || value == "copy") {
							this.plugin.settings.contentsMode = value;
							await this.plugin.saveSettings();
						}
						console.log(value)
					})
			})

		new Setting(containerEl)
			.setName("Blank start mark")
			.setDesc("Default: { / Not allowing start and end marks to be the same")
			.addText((component) => {
					component
						.setValue(this.plugin.settings.blankStart)
						.onChange(async (value) => {
							this.plugin.settings.blankStart = value;
							await this.plugin.saveSettings();
						})
				}
			)

		new Setting(containerEl)
			.setName("Blank end mark")
			.setDesc("Default: } / Not allowing start and end marks to be the same")
			.addText((component) => {
					component
						.setValue(this.plugin.settings.blankEnd)
						.onChange(async (value) => {
							this.plugin.settings.blankEnd = value;
							await this.plugin.saveSettings();
						})
				}
			)

	}
}
