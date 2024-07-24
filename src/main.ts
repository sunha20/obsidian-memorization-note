import {App, HeadingCache, Notice, Plugin, TFile, TFolder} from 'obsidian';

// Remember to rename these classes and interfaces!

// interface MyPluginSettings {
// 	mySetting: string;
// }
//
// const DEFAULT_SETTINGS: MyPluginSettings = {
// 	mySetting: 'default'
// }

export default class MyPlugin extends Plugin {
	// settings: MyPluginSettings;

	async onload() {
		// await this.loadSettings();

		this.addCommand({
			id: 'create-memorization-note',
			name: 'Create Memorization Note',
			callback: async () => {
				try {
					const original = new Original(this.app);
					const memorization = new Memorization(this.app);
					// @ts-ignore
					memorization.createNewFile(original.file.basename, original.file.path, original.file.parent, original.getFileHeading())
				} catch (error) {
					new Notice(error.message);
				}
			}
		});


		// This adds a settings tab so the user can configure various aspects of the plugin
		// this.addSettingTab(new SampleSettingTab(this.app, this));

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
			console.log('click', evt);
		});

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
	}

	onunload() {

	}

	// async loadSettings() {
	// 	this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	// }
	//
	// async saveSettings() {
	// 	await this.saveData(this.settings);
	// }
}

// class ErrorPopup extends Notice {
// 	error: string;
// 	constructor(app: App, error: string) {
// 		super(app);
// 		this.error = error;
// 	}
//
// 	onOpen() {
// 		const {contentEl} = this;
// 		contentEl.setText(this.error);
// 	}
//
// 	onClose() {
// 		const {contentEl} = this;
// 		contentEl.empty();
// 	}
// }

// class SampleSettingTab extends PluginSettingTab {
// 	plugin: MyPlugin;
//
// 	constructor(app: App, plugin: MyPlugin) {
// 		super(app, plugin);
// 		this.plugin = plugin;
// 	}
//
// 	display(): void {
// 		const {containerEl} = this;
//
// 		containerEl.empty();
//
// 		new Setting(containerEl)
// 			.setName('Setting #1')
// 			.setDesc('It\'s a secret')
// 			.addText(text => text
// 				.setPlaceholder('Enter your secret')
// 				.setValue(this.plugin.settings.mySetting)
// 				.onChange(async (value) => {
// 					this.plugin.settings.mySetting = value;
// 					await this.plugin.saveSettings();
// 				}));
// 	}
// }

class Original {
	readonly app: App;
	file: TFile | null = null;

	constructor(app: App) {
		this.app = app;
		const file = this.getActiveFile();
		if (file == null) {
			throw new Error("No active file is available");
		}
		this.file = file;
	}

	// original file
	getActiveFile(): TFile | null {
		// workspace의 activeLeaf를 통해 현재 활성화된 leaf를 가져옴
		const activeFile = this.app.workspace.getActiveFile();

		if (activeFile && activeFile.extension == "md") {
			return activeFile;
		}
		return null;
	}

	getFileHeading(): HeadingCache[] {
		if (this.file !== null) {
			const headings = this.app.metadataCache.getFileCache(this.file)?.headings;
			return headings ?? [];
		}
		return [];
	}
}

class Memorization {
	readonly app: App;

	constructor(app: App) {
		this.app = app;
	}

	async createNewFile(originalTitle: string, originalPath: string, folder: TFolder, headings: HeadingCache[]) {
		const pathList: string[] = originalPath.split("/");
		const titleIdx = pathList.length - 1;

		const newTitle = originalTitle + "_mem ";
		let num = 1;
		for (const f of folder.children) {
			if (f.name.startsWith(newTitle)) {
				const nameList = f.name.split(" ");
				const newNum = parseInt(nameList[nameList.length - 1]);
				if (newNum >= num) {
					num = newNum + 1;
				}
			}
		}

		pathList[titleIdx] = newTitle + num + ".md";
		const newPath= pathList.join("/");

		let content = "";
		let prefix;
		let head;
		for (const h of headings) {
			prefix = "#".repeat(h.level);
			head = `[[${originalPath}#${h.heading}|${h.heading}]]`;
			content += `${prefix} ${head}\n\n`;
		}
		try {
			const newFile = await this.app.vault.create(newPath, content);

			this.openFile(newFile);

			return newFile;
		}
		catch (error) {
			new Notice("Failed to create new file:", error)
		}
	}

	async openFile(file: TFile) {
		const leaf = this.app.workspace.getLeaf("tab");
		await leaf.openFile(file);
	}

}

