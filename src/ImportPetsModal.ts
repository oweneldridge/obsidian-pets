import { App, Modal, Notice } from "obsidian";

interface SavedPet {
	type: string;
	color: string;
	size: string;
	name: string;
}

export class ImportPetsModal extends Modal {
	private onImport: (pets: SavedPet[]) => void;

	constructor(app: App, onImport: (pets: SavedPet[]) => void) {
		super(app);
		this.onImport = onImport;
	}

	onOpen() {
		const { contentEl } = this;

		contentEl.createEl("h2", { text: "Import Pet List" });
		contentEl.createEl("p", { text: "Select a JSON file containing pet data to import." });

		// List JSON files in the vault
		const jsonFiles = this.app.vault.getFiles().filter(file => file.extension === 'json');

		if (jsonFiles.length === 0) {
			contentEl.createEl("p", { text: "No JSON files found in vault." });
			return;
		}

		const fileList = contentEl.createEl("div", { cls: "import-file-list" });

		jsonFiles.forEach(file => {
			const fileButton = fileList.createEl("button", {
				text: file.path,
				cls: "import-file-button"
			});

			fileButton.addEventListener("click", async () => {
				try {
					const content = await this.app.vault.read(file);
					const pets = JSON.parse(content) as SavedPet[];

					// Validate the imported data
					if (!Array.isArray(pets)) {
						new Notice("Invalid pet data format");
						return;
					}

					this.onImport(pets);
					this.close();
					new Notice(`Imported ${pets.length} pets`);
				} catch (error) {
					console.error("Failed to import pets:", error);
					new Notice("Failed to import pets. Check the file format.");
				}
			});
		});
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}
