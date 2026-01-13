export {};

declare global {
  interface Window {
    api: {
      openExternal: (url: string) => void;

      onUpdateStatus: (
        callback: (
          status: "checking" | "downloading" | "installing" | "error"
        ) => void
      ) => void;

      onUpdateProgress: (callback: (percent: number) => void) => void;

      quitApp: () => Promise<void>;

      reloadApp: () => Promise<void>;
    };
  }
}
