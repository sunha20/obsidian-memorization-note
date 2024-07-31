import {HeadingCache} from "obsidian";

export class HeadingRepository {
	headings: HeadingCache[];
	path: string;
	ptr: number;

	constructor(headings: HeadingCache[], path: string) {
		this.headings = headings;
		this.path = path;
		this.ptr = 0;
	}

	getOneHeading(newText?: string) {
		const heading = this.headings[this.ptr];
		const prefix = "#".repeat(heading.level);
		const text = (newText != undefined ? newText : heading.heading);
		this.ptr += 1;
		return `${prefix} ${text}`;
	}

	getOneLinkHeading(newText?: string) {
		const heading = this.headings[this.ptr];
		const prefix = "#".repeat(heading.level);
		const text = (newText != undefined ? newText : heading.heading);
		const link = `[[${this.path}#${heading.heading}|🔗]]`;
		this.ptr += 1;
		return `${prefix} ${text} ${link}`;
	}
}
