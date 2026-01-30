# FocusIt

Keep your editing line always centered in the editor with configurable focus range.

## Features

- **Auto-Center**: Automatically keeps your current line centered while editing
- **Configurable Focus Range**: Set how many lines you want to keep in the center of your screen
- **Smart Adjustment**: Automatically adjusts even numbers to odd for perfect symmetry

## Configuration

- `focusit.enabled`: Enable/disable auto-centering (default: `true`)
- `focusit.focusRange`: Number of lines to keep in focus (default: `11`)
  - If you set `11`, it will show 5 lines above + current line + 5 lines below
  - Even numbers are automatically rounded up to the next odd number for symmetry

## Commands

- `FocusIt: Toggle Auto Center`: Toggle the auto-centering feature on/off

## Usage

Once installed, the extension works automatically. Your cursor line will always stay centered as you edit.

You can toggle the feature using the command palette (`Cmd+Shift+P` / `Ctrl+Shift+P`) and search for "FocusIt: Toggle Auto Center".
