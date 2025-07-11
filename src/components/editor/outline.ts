import { EditorView } from "@codemirror/view";

export class OutlineItem {
  text: string;
  line: number;
  el: HTMLElement;
  constructor(text: string, line: number) {
    this.text = text;
    this.line = line;
  }
}

export class TabEditorOutline {
  view: EditorView;
  containerEl: HTMLElement;
  items: OutlineItem[] = [];

  constructor(view: EditorView, containerEl: HTMLElement) {
    this.view = view;
    this.containerEl = containerEl.createDiv("tabs-outline");
    this.update();
  }

  update() {
    this.items = [];
    this.containerEl.empty();
    const doc = this.view.state.doc.toString();
    const lines = doc.split("\n");
    for (let i = 0; i < lines.length; i++) {
      const match = lines[i].match(/^(#+)\s+(.*)/);
      if (match) {
        const item = new OutlineItem(match[2], i);
        const el = this.containerEl.createDiv("tabs-outline-item");
        el.setText(match[2]);
        el.onclick = () => {
          const pos = this.view.state.doc.line(i + 1).from;
          this.view.dispatch({
            selection: { anchor: pos },
            effects: EditorView.scrollIntoView(pos, { y: "center" })
          });
        };
        item.el = el;
        this.items.push(item);
      }
    }
  }
}
