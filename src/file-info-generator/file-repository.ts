import {TFile, TFolder} from "obsidian";
import {HeadingRepository} from "./heading-repository";
import {ObsidianControl} from '../obsidian-control';

export class FileRepository {
	obsidian: ObsidianControl
	folder: TFolder | null;
	filePath: string;
	title: string;
	heading: HeadingRepository;
	headingLen: number;
	contents: string;

	constructor(obsidian: ObsidianControl) {
		this.obsidian = obsidian;
	}

	async init(file: TFile){
		this.folder = file.parent;
		this.filePath = file.path;
		this.title = file.basename;

		const headingsTemp = this.obsidian.getFileHeading(file)
		this.heading = new HeadingRepository(headingsTemp, file.path);
		this.headingLen = headingsTemp.length;

		this.contents = await this.obsidian.readFile(file);
	}


	getAllHeading(option: string) {
		let headingString = "";
		if (option == "basic") {
			for (let i = 0; i < this.headingLen; i++) {
				headingString += this.heading.getOneHeading() + "\n";
			}
			return headingString;
		}
		if (option == "link") {
			for (let i = 0; i < this.headingLen; i++) {
				headingString += this.heading.getOneLinkHeading() + "\n";
			}
			return headingString;
		}

		return "";
	}
}
