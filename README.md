# Bear Tabs Navigator

An [Obsidian](https://obsidian.md) plugin that brings [Bear app](https://bear.app)'s two-panel navigation to your vault — a hierarchical tag tree on the left and a filtered note list with previews on the right.

![Bear Tabs Navigator](https://raw.githubusercontent.com/jion/bear-tabs-navigator/main/screenshot.png)

## Features

- **Hierarchical tag tree** — Nested tags (`parent/child`) rendered as an expandable tree with note counts
- **Note list with previews** — Click any tag to see matching notes with title, 2-line preview excerpt, and relative date
- **Live reactivity** — Tag tree and note list automatically refresh when you create, edit, or tag notes
- **Active note highlight** — The currently open note is highlighted in the note list
- **Persistent state** — Selected tag and expanded/collapsed tree state are saved across sessions
- **All Notes view** — A top-level entry shows all notes regardless of tags
- **Theme-aware** — Uses Obsidian's CSS variables for seamless light and dark mode support
- **Large vault friendly** — Note list paginates at 50 items with a "Show more" option

## Installation

### From the Community Plugin Browser (coming soon)

1. Open Obsidian Settings > Community Plugins
2. Search for "Bear Tabs Navigator"
3. Click Install, then Enable

### Manual Installation

1. Download the latest release from [GitHub Releases](https://github.com/jion/bear-tabs-navigator/releases)
2. Extract `main.js`, `manifest.json`, and `styles.css` into `.obsidian/plugins/bear-tabs-navigator/` in your vault
3. Reload Obsidian and enable the plugin in Settings > Community Plugins

### Building from Source

```bash
git clone https://github.com/jion/bear-tabs-navigator.git
cd bear-tabs-navigator
npm install
npm run build
```

Then copy `main.js`, `manifest.json`, and `styles.css` into your vault's `.obsidian/plugins/bear-tabs-navigator/` folder.

## Usage

1. Click the **layout-list icon** in the left ribbon, or run the command **"Open Bear Navigator"** from the command palette (`Cmd/Ctrl+P`)
2. The two-panel view opens in the left sidebar
3. **Left panel** — Browse your tag hierarchy. Click a tag to filter notes. Click the chevron to expand/collapse nested tags
4. **Right panel** — See notes for the selected tag. Click a note to open it in the editor

## How Tags Are Handled

- Both **inline tags** (`#tag`) and **frontmatter tags** (`tags: [tag1, tag2]`) are recognized
- Selecting a **parent tag** (e.g. `projects`) includes all notes tagged with any child (`projects/work`, `projects/personal`)
- Tags are normalized to lowercase for matching

## Project Structure

```
src/
  main.ts         Plugin entry — registers view, ribbon icon, command
  BearView.ts     ItemView subclass — two-panel flex container
  TagTree.ts      Left panel — hierarchical tag tree with expand/collapse
  NoteList.ts     Right panel — note cards with title, preview, date
  tagUtils.ts     Build tag tree from metadataCache, filter notes by tag
  dateUtils.ts    Relative date formatting
  types.ts        TypeScript interfaces
styles.css        Bear-inspired layout using Obsidian CSS variables
```

## Development

```bash
# Watch mode (rebuilds on file changes)
npm run dev

# Production build
npm run build
```

Requires Node.js 16+.

## Contributing

Pull requests are welcome. For major changes please open an issue first.

## License

[MIT](LICENSE)
