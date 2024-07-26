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
			id: 'create-memorization-note-headind',
			name: 'Create Memorization Note (Heading)',
			callback: async () => {
				try {
					const original = new Original(this.app);
					const memorization = new Memorization(this.app);
					if (original.file && original.file.path) {
						const originalContent = await this.app.vault.read(original.file);
						// @ts-ignore
						await memorization.createNewFile(original.file.basename, original.file.path, original.file.parent, original.getFileHeading(), originalContent, "heading");
					} else {
						throw new Error("No active markdown file is open or file path is null.");
					}
				} catch (error) {
					new Notice(error.message);
				}
			}
		});

		this.addCommand({
			id: 'create-memorization-note-link-headind',
			name: 'Create Memorization Note (Link Heading)',
			callback: async () => {
				try {
					const original = new Original(this.app);
					const memorization = new Memorization(this.app);
					if (original.file && original.file.path) {
						const originalContent = await this.app.vault.read(original.file);
						// @ts-ignore
						await memorization.createNewFile(original.file.basename, original.file.path, original.file.parent, original.getFileHeading(), originalContent, "link");
					} else {
						throw new Error("No active markdown file is open or file path is null.");
					}
				} catch (error) {
					new Notice(error.message);
				}
			}
		});

		this.addCommand({
			id: 'create-memorization-note-blank',
			name: 'Create Memorization Note (blank)',
			callback: async () => {
				try {
					const original = new Original(this.app);
					const memorization = new Memorization(this.app);
					if (original.file && original.file.path) {
						const originalContent = await this.app.vault.read(original.file);
						// @ts-ignore
						await memorization.createNewFile(original.file.basename, original.file.path, original.file.parent, original.getFileHeading(), originalContent, "blank");
					} else {
						throw new Error("No active markdown file is open or file path is null.");
					}
				} catch (error) {
					new Notice(error.message);
				}
			}
		});

		this.addCommand({
			id: 'create-memorization-note-copy',
			name: 'Create Memorization Note (copy)',
			callback: async () => {
				try {
					const original = new Original(this.app);
					const memorization = new Memorization(this.app);
					if (original.file && original.file.path) {
						const originalContent = await this.app.vault.read(original.file);
						// @ts-ignore
						await memorization.createNewFile(original.file.basename, original.file.path, original.file.parent, original.getFileHeading(), originalContent, "copy");
					} else {
						throw new Error("No active markdown file is open or file path is null.");
					}
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

	async createNewFile(originalTitle: string, originalPath: string, folder: TFolder, headings: HeadingCache[], content: string, mode: string) {
		const pathList: string[] = originalPath.split("/");
		const titleIdx = pathList.length - 1;
		const newTitle = this.setTitle(pathList, originalTitle, folder);
		pathList[titleIdx] = newTitle + ".md";

		const newPath = pathList.join("/");

		let newContent = "";
		if (mode == "heading" || mode == "link") {
			newContent = this.setHeadingContent(mode, headings, originalPath);
		}
		if (mode == "blank" || mode == "copy") {
			newContent = this.setContent(mode, content);
		}

		try {
			const newFile = await this.app.vault.create(newPath, newContent);
			this.openFile(newFile);
			return newFile;
		} catch (error) {
			new Notice("Failed to create new file:", error)
		}
	}

	async openFile(file: TFile) {
		const leaf = this.app.workspace.getLeaf("tab");
		await leaf.openFile(file);
	}

	private setHeadingContent(mode: string, headings: HeadingCache[], path: string) {
		let newContent = "";

		if (mode === "heading") {
			for (const h of headings) {
				newContent += this.setHeading(h);
			}
			return newContent;
		}

		if (mode === "link") {
			for (const h of headings) {
				newContent += this.setLinkHeading(h, path);
			}
			return newContent;
		}

		return newContent;
	}

	private setContent(mode: string, content: string) {
		if (mode === "blank") {
			return content.replaceAll(/\*\*([^\n]+)(\*\*)/g, "(   )");
		}
		return content;
	}

	private setTitle(pathList: string[], originalTitle: string, folder: TFolder) {
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
		return newTitle + " " + num;
	}

	private setHeading(heading: HeadingCache): string {
		const prefix = "#".repeat(heading.level);
		const text = heading.heading;
		return `${prefix} ${text}\n\n`;
	}

	private setLinkHeading(heading: HeadingCache, path: string): string {
		const prefix = "#".repeat(heading.level);
		const text = `[[${path}#${heading.heading}|${heading.heading}]]`;
		return `${prefix} ${text}\n\n`;
	}
}

