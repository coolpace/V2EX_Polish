export const userscriptUiStyles = `
:host {
  all: initial;
  --v2p-ui-bg: #f4f6f8;
  --v2p-ui-surface: #ffffff;
  --v2p-ui-surface-muted: #f1f5f9;
  --v2p-ui-text: #1e293b;
  --v2p-ui-muted: #64748b;
  --v2p-ui-border: #dbe3ec;
  --v2p-ui-accent: #0f766e;
  --v2p-ui-accent-soft: #ccfbf1;
  --v2p-ui-danger: #b91c1c;
  --v2p-ui-radius: 10px;
  --v2p-ui-shadow: 0 24px 70px rgb(15 23 42 / 24%);
  color: var(--v2p-ui-text);
  font: 14px/1.5 system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

:host(.v2p-dark) {
  --v2p-ui-bg: #0f172a;
  --v2p-ui-surface: #172033;
  --v2p-ui-surface-muted: #202b40;
  --v2p-ui-text: #e2e8f0;
  --v2p-ui-muted: #94a3b8;
  --v2p-ui-border: #334155;
  --v2p-ui-accent: #5eead4;
  --v2p-ui-accent-soft: #134e4a;
  color-scheme: dark;
}

* {
  box-sizing: border-box;
}

[hidden] {
  display: none !important;
}

button,
input,
select,
textarea {
  color: inherit;
  font: inherit;
}

button {
  cursor: pointer;
  border: 1px solid var(--v2p-ui-border);
  border-radius: 7px;
  padding: 7px 11px;
  background: var(--v2p-ui-surface-muted);
}

button:hover {
  border-color: var(--v2p-ui-muted);
}

button:disabled {
  cursor: default;
  opacity: 0.6;
}

input[type="text"],
input[type="password"],
select,
textarea {
  width: 100%;
  border: 1px solid var(--v2p-ui-border);
  border-radius: 7px;
  padding: 8px 10px;
  background: var(--v2p-ui-surface);
}

textarea {
  resize: vertical;
}

a {
  color: inherit;
}

.v2p-launcher {
  position: fixed;
  z-index: 2147483645;
  right: 18px;
  bottom: 18px;
  width: 46px;
  height: 46px;
  border: 0;
  border-radius: 50%;
  color: #fff;
  font-weight: 800;
  letter-spacing: -0.5px;
  background: #0f766e;
  box-shadow: 0 10px 28px rgb(15 118 110 / 35%);
}

.v2p-overlay {
  position: fixed;
  z-index: 2147483646;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  color: var(--v2p-ui-text);
  background: rgb(15 23 42 / 52%);
  backdrop-filter: blur(3px);
}

.v2p-panel {
  overflow: hidden;
  display: flex;
  flex-direction: column;
  width: min(500px, calc(100vw - 32px));
  height: min(650px, calc(100vh - 48px));
  border: 1px solid var(--v2p-ui-border);
  border-radius: 14px;
  color: var(--v2p-ui-text);
  background: var(--v2p-ui-surface);
  box-shadow: var(--v2p-ui-shadow);
}

.v2p-panel-header,
.v2p-settings-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-height: 56px;
  padding: 12px 16px;
  border-bottom: 1px solid var(--v2p-ui-border);
}

.v2p-panel-title {
  font-size: 16px;
  font-weight: 750;
}

.v2p-icon-button {
  width: 34px;
  height: 34px;
  padding: 0;
  font-size: 22px;
  line-height: 1;
}

.v2p-panel-tabs {
  overflow-x: auto;
  display: flex;
  gap: 5px;
  padding: 8px 10px;
  background: var(--v2p-ui-surface-muted);
  border-bottom: 1px solid var(--v2p-ui-border);
}

.v2p-panel-tabs button {
  flex: none;
  border-color: transparent;
  background: transparent;
}

.v2p-panel-tabs button.active {
  color: var(--v2p-ui-accent);
  background: var(--v2p-ui-surface);
  border-color: var(--v2p-ui-border);
}

.v2p-panel-content {
  overflow: auto;
  flex: 1;
  min-height: 0;
  padding: 0;
}

.v2p-panel-section {
  min-height: 100%;
  padding: 16px;
}

.v2p-topic-list,
.v2p-reading-list,
.v2p-message-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.v2p-topic-item,
.v2p-reading-item,
.v2p-message-item {
  position: relative;
  display: block;
  padding: 12px;
  border: 1px solid var(--v2p-ui-border);
  border-radius: var(--v2p-ui-radius);
  color: inherit;
  text-decoration: none;
  background: var(--v2p-ui-surface);
}

.v2p-topic-item:hover,
.v2p-reading-item:hover,
.v2p-message-item:hover {
  background: var(--v2p-ui-surface-muted);
  text-decoration: none;
}

.v2p-item-title {
  display: -webkit-box;
  overflow: hidden;
  margin-bottom: 5px;
  font-weight: 650;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.v2p-item-summary {
  display: -webkit-box;
  overflow: hidden;
  color: var(--v2p-ui-muted);
  font-size: 13px;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
}

.v2p-item-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 8px;
}

.v2p-item-actions button {
  font-size: 12px;
  padding: 4px 8px;
}

.v2p-empty,
.v2p-loading,
.v2p-error {
  padding: 36px 16px;
  text-align: center;
  color: var(--v2p-ui-muted);
}

.v2p-error {
  color: var(--v2p-ui-danger);
}

.v2p-toolbar-row,
.v2p-action-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.v2p-action-row {
  margin-top: 14px;
}

.v2p-feature-card {
  padding: 18px;
  border: 1px solid var(--v2p-ui-border);
  border-radius: var(--v2p-ui-radius);
  background: var(--v2p-ui-surface);
}

.v2p-feature-card h2 {
  margin: 0 0 8px;
  font-size: 18px;
}

.v2p-feature-card p {
  margin: 0 0 14px;
  color: var(--v2p-ui-muted);
}

.v2p-primary {
  color: #fff;
  background: var(--v2p-ui-accent);
  border-color: var(--v2p-ui-accent);
}

:host(.v2p-dark) .v2p-primary {
  color: #06201c;
}

.v2p-settings-panel {
  overflow: hidden;
  display: flex;
  width: min(1120px, calc(100vw - 32px));
  height: min(820px, calc(100vh - 40px));
  border: 1px solid var(--v2p-ui-border);
  border-radius: 14px;
  color: var(--v2p-ui-text);
  background: var(--v2p-ui-bg);
  box-shadow: var(--v2p-ui-shadow);
}

.v2p-settings-layout {
  display: flex;
  width: 100%;
  min-width: 0;
  height: 100%;
}

.v2p-settings-nav {
  flex: none;
  width: 230px;
  padding: 18px 12px;
  background: var(--v2p-ui-surface-muted);
}

.v2p-settings-brand {
  margin: 2px 10px 18px;
  font-size: 20px;
  font-weight: 800;
}

.v2p-settings-nav button {
  display: block;
  width: 100%;
  margin-bottom: 5px;
  padding: 9px 12px;
  border-color: transparent;
  text-align: left;
  background: transparent;
}

.v2p-settings-nav button.active {
  color: var(--v2p-ui-accent);
  background: var(--v2p-ui-surface);
  border-color: var(--v2p-ui-border);
}

.v2p-settings-main {
  overflow: hidden;
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
}

.v2p-settings-topbar {
  flex: none;
  background: var(--v2p-ui-surface);
}

.v2p-settings-status {
  margin-left: 10px;
  color: var(--v2p-ui-muted);
  font-size: 12px;
}

.v2p-settings-section {
  overflow: auto;
  flex: 1;
  padding: 24px 30px 40px;
}

.v2p-settings-section h2,
.v2p-settings-heading h2 {
  margin: 0 0 16px;
  font-size: 21px;
}

.v2p-settings-heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 18px;
}

.v2p-settings-heading h2 {
  margin-bottom: 4px;
}

.v2p-settings-heading p,
.v2p-help {
  margin: 0 0 14px;
  color: var(--v2p-ui-muted);
  font-size: 13px;
}

.v2p-form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px 18px;
  margin-bottom: 20px;
}

.v2p-form-grid label,
.v2p-settings-section > label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 14px;
}

.v2p-check-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px 16px;
  margin-bottom: 20px;
}

.v2p-check {
  flex-direction: row !important;
  align-items: center;
  gap: 8px !important;
  margin: 0 !important;
}

.v2p-tag-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.v2p-tag-row {
  display: grid;
  grid-template-columns: minmax(180px, 1fr) minmax(180px, 1.5fr) auto;
  gap: 12px;
  align-items: center;
  padding: 10px 12px;
  border: 1px solid var(--v2p-ui-border);
  border-radius: var(--v2p-ui-radius);
  background: var(--v2p-ui-surface);
}

.v2p-tag-row a {
  display: flex;
  gap: 8px;
  align-items: center;
  text-decoration: none;
}

.v2p-tag-row img {
  width: 24px;
  height: 24px;
  border-radius: 50%;
}

.v2p-toast {
  position: fixed;
  z-index: 2147483647;
  right: 18px;
  bottom: 76px;
  max-width: min(360px, calc(100vw - 36px));
  padding: 10px 14px;
  border-radius: 8px;
  color: #fff;
  background: rgb(15 23 42 / 92%);
  box-shadow: 0 8px 28px rgb(15 23 42 / 28%);
}

@media (max-width: 720px) {
  .v2p-overlay {
    padding: 8px;
  }

  .v2p-panel {
    width: calc(100vw - 16px);
    height: calc(100vh - 16px);
  }

  .v2p-settings-panel {
    width: calc(100vw - 16px);
    height: calc(100vh - 16px);
  }

  .v2p-settings-layout {
    flex-direction: column;
  }

  .v2p-settings-nav {
    display: flex;
    gap: 5px;
    overflow-x: auto;
    width: 100%;
    padding: 8px;
  }

  .v2p-settings-brand {
    display: none;
  }

  .v2p-settings-nav button {
    flex: none;
    width: auto;
    margin: 0;
  }

  .v2p-form-grid,
  .v2p-check-grid {
    grid-template-columns: 1fr;
  }

  .v2p-settings-section {
    padding: 18px 16px 30px;
  }

  .v2p-tag-row {
    grid-template-columns: 1fr auto;
  }

  .v2p-tag-row span {
    grid-column: 1 / -1;
  }
}
`
