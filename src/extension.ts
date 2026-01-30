import * as vscode from "vscode";

let isEnabled = true;
let disposables: vscode.Disposable[] = [];

export function activate(context: vscode.ExtensionContext) {
  console.log("FocusIt extension is now active");

  // Load configuration
  const config = vscode.workspace.getConfiguration("focusit");
  isEnabled = config.get("enabled", true);

  // Register toggle command
  const toggleCommand = vscode.commands.registerCommand(
    "focusit.toggle",
    () => {
      isEnabled = !isEnabled;
      const status = isEnabled ? "enabled" : "disabled";
      vscode.window.showInformationMessage(`FocusIt: Auto-center ${status}`);

      // Update configuration
      config.update("enabled", isEnabled, vscode.ConfigurationTarget.Global);
    },
  );

  context.subscriptions.push(toggleCommand);

  // Listen to text editor selection changes
  const selectionChangeDisposable =
    vscode.window.onDidChangeTextEditorSelection((event) => {
      if (isEnabled) {
        centerCurrentLine(event.textEditor);
      }
    });

  context.subscriptions.push(selectionChangeDisposable);

  // Listen to configuration changes
  const configChangeDisposable = vscode.workspace.onDidChangeConfiguration(
    (event) => {
      if (event.affectsConfiguration("focusit.enabled")) {
        const config = vscode.workspace.getConfiguration("focusit");
        isEnabled = config.get("enabled", true);
      }
    },
  );

  context.subscriptions.push(configChangeDisposable);
}

function centerCurrentLine(editor: vscode.TextEditor) {
  if (!editor) {
    return;
  }

  const config = vscode.workspace.getConfiguration("focusit");
  let focusRange = config.get("focusRange", 11);

  // Auto-adjust to odd number
  if (focusRange % 2 === 0) {
    focusRange = focusRange + 1;
  }

  const currentLine = editor.selection.active.line;
  const visibleRange = editor.visibleRanges[0];

  if (!visibleRange) {
    return;
  }

  // Calculate the range to keep centered
  const halfRange = Math.floor(focusRange / 2);
  const targetStartLine = Math.max(0, currentLine - halfRange);
  const targetEndLine = Math.min(
    editor.document.lineCount - 1,
    currentLine + halfRange,
  );

  // Check if current line is already well-centered
  const viewportStartLine = visibleRange.start.line;
  const viewportEndLine = visibleRange.end.line;
  const viewportMiddle = (viewportStartLine + viewportEndLine) / 2;

  // Only scroll if the current line is not close to the center
  const distanceFromCenter = Math.abs(currentLine - viewportMiddle);
  const threshold = 2; // Allow 2 lines of deviation before re-centering

  if (distanceFromCenter > threshold) {
    // Calculate the ideal top line to make the focus range centered
    const viewportHeight = viewportEndLine - viewportStartLine;
    const idealTopLine = Math.max(
      0,
      currentLine - Math.floor(viewportHeight / 2),
    );

    const range = new vscode.Range(
      new vscode.Position(idealTopLine, 0),
      new vscode.Position(idealTopLine, 0),
    );

    editor.revealRange(range, vscode.TextEditorRevealType.AtTop);
  }
}

export function deactivate() {
  disposables.forEach((d) => d.dispose());
}
