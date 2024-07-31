import {App, HeadingCache, Notice, TFile} from "obsidian";

export class ObsidianControl {
	readonly app: App;

	constructor(app: App) {
		this.app = app;
	}

	getActiveFile(): TFile {
		const activeFile = this.app.workspace.getActiveFile();

		if (activeFile && activeFile.extension == "md") {
			return activeFile;
		} else {
			throw new Error("No active markdown file is open or file path is null.");
		}
	}

	getFileHeading(file: TFile): HeadingCache[] {
		if (file !== null) {
			const headings = this.app.metadataCache.getFileCache(file)?.headings;
			return headings ?? [];
		}
		return [];
	}

	async readFile(file: TFile) {
		return await this.app.vault.read(file);
	}

	async openFile(path: string, content: string) {
		try {
			const file = await this.app.vault.create(path, content);
			const leaf = this.app.workspace.getLeaf("tab");
			await leaf.openFile(file);
		} catch (error) {
			new Notice("Failed to create new file:", error)
		}

	}
}
