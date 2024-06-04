import { Command, Flags } from "@oclif/core";
import * as fs from "node:fs";
import * as path from "node:path";

const configPath = path.join(__dirname, "..", "..", "config.json");

export default class Authenticate extends Command {
	static description = "Authenticate the user by saving server URL and token";

	static flags = {
		token: Flags.string({
			char: "t",
			description: "Authentication token",
			required: true,
		}),
		url: Flags.string({ char: "u", description: "Server URL", required: true }),
	};

	async run() {
		const { flags } = await this.parse(Authenticate);
		const config = {
			token: flags.token,
			url: flags.url,
		};

		fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
		this.log("Authentication details saved successfully.");
	}
}
