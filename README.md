# Obsidian Pets

This is an Obsidian plugin that brings the joy of `vscode-pets` to your vault. It adds a cute pet to your Obsidian workspace that follows you around.

This project is a direct translation of the popular Visual Studio Code extension [vscode-pets](https://github.com/tonybaloney/vscode-pets) by [Anthony Shaw](https://github.com/tonybaloney).

## Installation

**Note**: This plugin is not yet available in the Obsidian Community Plugins directory. To install it locally:

### Local Installation

1. **Clone or download this repository**:
   ```bash
   git clone https://github.com/your-username/obsidian-pets.git
   ```

2. **Navigate to the plugin directory**:
   ```bash
   cd obsidian-pets
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Build the plugin**:
   ```bash
   npm run build
   ```

5. **Copy the plugin to your vault**:
   - Create a folder named `vault-pets` in your vault's `.obsidian/plugins/` directory
   - Copy these files from the plugin directory to `.obsidian/plugins/vault-pets/`:
     - `main.js`
     - `manifest.json`
     - `styles.css`
     - The entire `media/` folder (with all pet animations and backgrounds)

6. **Enable the plugin**:
   - Open Obsidian
   - Go to Settings → Community Plugins
   - Disable Safe Mode if it's enabled
   - Find "Obsidian Pets" in the installed plugins list and toggle it on

7. **Open the Pet View**:
   - Open the command palette (`Ctrl/Cmd + P`)
   - Search for "Open Pet View"
   - A new view will open in the right sidebar with your new pet!

You can customize the pet type, color, size, and background theme from the plugin's settings tab.

## Features

This plugin maintains core vscode-pets behaviors while adapting them for Obsidian! 🎉

### Pet Types (20 varieties)

*   **Classic Pets**: Dog
*   **Tech Mascots**: Clippy, Rubber Duck, Rocky, Mod (dotnet bot), Deno
*   **Birds**: Chicken, Cockatiel
*   **Aquatic**: Crab
*   **Reptiles**: Snake, Turtle
*   **Mammals**: Fox, Horse, Panda, Rat
*   **Unique**: Snail, Totoro, Zappy, Skeleton, Morph

### Customization

*   **Pet Colors**: Select from a variety of colors specific to each pet type
*   **Pet Size**: Adjust the size of your pet (nano, small, medium, large)
*   **Multiple Pets**: Spawn as many pets as you want
*   **Background Themes**:
    *   None
    *   Castle
    *   Forest
    *   Beach
    *   Winter
    *   Autumn
*   **Visual Effects**:
    *   Snow
    *   Stars
    *   Leaves
    *   Option to disable effects for better performance

### Interactive Features

*   **Throw Ball**: Interact with your pets by throwing a ball for them to chase
*   **Throw Ball with Mouse** (setting): Enable click-and-drag ball throwing
*   **Roll Call**: Make all pets show their names in speech bubbles
*   **Pause Pets**: Temporarily stop pet animations
*   **Reset Pets**: Remove all pets from the view

### Pet Management

*   **Export Pet List**: Save your current pet collection as a JSON file
*   **Import Pet List**: Load a saved pet collection from a JSON file
*   **Add/Remove Pets**: Use buttons or commands to manage your pets
*   **Persistent Pets**: Your pets are saved and restored when you reopen Obsidian

### Commands

All features are accessible via the command palette:

*   Open Pet View
*   Spawn an additional pet
*   Remove all pets
*   Delete a pet (select a specific pet to remove)
*   Throw ball
*   Toggle throw ball with mouse (enable/disable click-and-drag ball throwing)
*   Export pet list
*   Import pet list
*   Roll call
*   Toggle pause
*   Reset pets

## Development

### Code Quality

This plugin follows [Obsidian Plugin Review Guidelines](https://docs.obsidian.md/Plugins/Releasing/Plugin+guidelines) and uses ESLint to enforce code quality standards that match ObsidianReviewBot requirements.

**Running lints and tests**:
```bash
npm run lint        # Check for linting errors
npm run build       # Build the plugin (includes type checking)
```

For detailed information about the ESLint configuration and Obsidian standards, see [ESLINT_OBSIDIAN_STANDARDS.md](ESLINT_OBSIDIAN_STANDARDS.md).

### Building from Source

```bash
# Install dependencies
npm install

# Build the plugin
npm run build

# The build outputs main.js and copies it to your vault
# (if you've configured the copy path in package.json)
```

## Credits

*   This project is a port of the [vscode-pets](https://github.com/tonybaloney/vscode-pets) extension for Visual Studio Code, created by [Anthony Shaw](https://github.com/tonybaloney).
*   All the original assets and animations are from the `vscode-pets` project and its contributors. Please see the [credits section of the original project](https://github.com/tonybaloney/vscode-pets#credits) for a full list of artists and designers.
