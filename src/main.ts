import {Notice, Plugin} from 'obsidian';
import {DEFAULT_SETTINGS, MemorizationNoteSettings, MemorizationNoteSettingTab} from "./setting";
import {ObsidianControl} from "./obsidian-control";
import {FileRepository} from "./file-info-generator/file-repository";
import {MemFileGenerator} from "./file-info-generator/mem-file-generator";

// Remember to rename these classes and interfaces!

export default class MemorizationNote extends Plugin {
	settings: MemorizationNoteSettings;

	async onload() {
		await this.loadSettings();

		this.addCommand({
			id: 'create-memorization-note-headind',
			name: 'Create Memorization Note',
			callback: async () => {
				try {
					const obsidian = new ObsidianControl(this.app);
					const originalFile = new FileRepository(obsidian);
					await originalFile.init(obsidian.getActiveFile());
					const memNote = new MemFileGenerator(obsidian, originalFile, [this.settings.headingOption, this.settings.contentsOption], [this.settings.blankStart, this.settings.blankEnd]);
					memNote.createMemFile();
				} catch (error) {
					new Notice(error.message);
					console.log(error.message)
				}
			}
		});


		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new MemorizationNoteSettingTab(this.app, this));

		// // If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// // Using this function will automatically remove the event listener when this plugin is disabled.
		// this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
		// 	console.log('click', evt);
		// });
		//
		// // When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		// this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
