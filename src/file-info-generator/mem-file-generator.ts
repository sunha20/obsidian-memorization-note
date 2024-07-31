import {FileRepository} from "./file-repository";
import {ObsidianControl} from "../obsidian-control";
import {Notice} from "obsidian";

export class MemFileGenerator {
	obsidian: ObsidianControl
	file: FileRepository
	hMode: string;
	cMode: string;
	headingReg = /^#+\s/;
	blankReg: RegExp;
	blankMark: string[]

	constructor(obsidian: ObsidianControl, file: FileRepository, mode: string[], blankMark: string[]) {
		this.obsidian = obsidian;
		this.file = file;
		this.hMode = mode[0];
		this.cMode = mode[1];
		this.blankMark = blankMark;
		this.blankReg = this.getContentReg(blankMark);
	}

	createMemFile() {
		let memContents = "";
		const memPath = this.setMemPath()

		if (this.cMode == "empty") {
			memContents = this.file.getAllHeading(this.hMode);
		}

		if (this.cMode == "blank") {
			if (this.blankMark[0] == this.blankMark[1]) {
				new Notice("Not allowing start and end marks to be the same");
				return;
			}
			memContents = this.setBlankContents();
			if (this.hMode == "link") memContents = this.setHeadingToLink(memContents);
		}

		if (this.cMode == "copy") {
			memContents = this.file.contents;
			if (this.hMode == "link") memContents = this.setHeadingToLink(memContents);
		}

		this.obsidian.openFile(memPath, memContents);
		return;
	}

	private setMemPath() {
		const path = this.file.filePath;
		const pathList = path.split("/");
		pathList[pathList.length - 1] = this.setMemTitle() + ".md";
		return pathList.join("/");
	}

	private setMemTitle() {
		const title = this.file.title + "_mem ";
		let num = 1;

		if (this.file.folder == null) {
			return title;
		}

		for (const f of this.file.folder.children) {
			if (f.name.startsWith(title)) {
				const nameList = f.name.split(" ");
				const newNum = parseInt(nameList[nameList.length - 1]);
				if (newNum >= num) {
					num = newNum + 1;
				}
			}
		}
		return title + num;
	}

	private setHeadingToLink(memContents: string) {
		const contentsList = memContents.split('\n');
		for (let i = 0; i < contentsList.length; i++) {
			if (this.hMode == "link" && this.headingReg.test(contentsList[i])) {
				const text = contentsList[i].replaceAll(/#+\s/g,"");
				contentsList[i] = this.file.heading.getOneLinkHeading(text);
			}
		}
		memContents = contentsList.join("\n");

		return memContents;
	}

	private getContentReg(mark: string[]) {
		return new RegExp(`${mark[0]}.*?${mark[1]}`, 'gs');
	}

	private setBlankContents() {
		const contents = this.file.contents.split("");
		let flag = false;
		let footNoteContents = "\n\n---\n";
		let footNoteIdx = 1;
		for (let i = 0; i < contents.length; i++) {
			if (contents[i] == this.blankMark[1] && flag) { // blank end
				flag = false;
				contents[i] = `[^${footNoteIdx}]${this.blankMark[1]}`;
				footNoteContents += "\n";
				footNoteIdx += 1;
				continue;
			}

			if (contents[i] == this.blankMark[0]) { // blank start
				flag = true;
				footNoteContents += `[^${footNoteIdx}]: `
				continue;
			}

			if (flag) {
				if (contents[i] == "\n") {
					footNoteContents += "/";
				} else {
					footNoteContents += contents[i];
					contents[i] = " ";
				}
			}
		}
		return contents.join("") + footNoteContents;
	}
}
