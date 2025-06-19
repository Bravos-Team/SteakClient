interface ElectronAPI {
  versions: () => {
    chrome?: string;
    node?: string;
    electron?: string;
  };
  ping?: () => Promise<string>;
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}