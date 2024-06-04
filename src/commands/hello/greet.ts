import { Command, Flags } from "@oclif/core";

export default class Greet extends Command {
	static args = {
		// Puedes agregar argumentos adicionales si lo necesitas
	};

	static description = "Greet the user with a message";

	static examples = [
		`<%= config.bin %> <%= command.id %> --name=Mau
hello Mau!
`,
	];

	static flags = {
		name: Flags.string({
			char: "n",
			description: "name to greet",
			required: false,
		}),
	};

	async run(): Promise<void> {
		const { flags } = await this.parse(Greet);
		const name = flags.name ?? "user";
		this.log(`hello ${name}!`);
	}
}
