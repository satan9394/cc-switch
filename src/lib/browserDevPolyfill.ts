import type { AppId } from "@/lib/api/types";
import type { Provider, Settings } from "@/types";

const STORAGE_KEY_PROVIDERS = "cc-switch-mock-providers";
const STORAGE_KEY_CURRENT = "cc-switch-mock-current";
const STORAGE_KEY_SETTINGS = "cc-switch-mock-settings";

const defaultMockProviders: Record<AppId, Record<string, Provider>> = {
  claude: {
    "claude-official": {
      id: "claude-official",
      name: "Claude 官方 (Official)",
      settingsConfig: {
        env: {
          ANTHROPIC_BASE_URL: "https://api.anthropic.com",
        },
      },
      category: "official",
      sortIndex: 0,
      createdAt: Date.now(),
    },
    "claude-custom": {
      id: "claude-custom",
      name: "中转 API (PackyCode)",
      settingsConfig: {
        env: {
          ANTHROPIC_BASE_URL: "https://www.packyapi.ai/v1",
        },
      },
      category: "custom",
      sortIndex: 1,
      createdAt: Date.now() + 1,
    },
  },
  "claude-desktop": {},
  codex: {
    "codex-official": {
      id: "codex-official",
      name: "OpenAI 官方",
      settingsConfig: {
        env: {
          OPENAI_BASE_URL: "https://api.openai.com/v1",
        },
      },
      category: "official",
      sortIndex: 0,
      createdAt: Date.now(),
    },
  },
  gemini: {
    "agy-official": {
      id: "agy-official",
      name: "Antigravity Google 官方",
      settingsConfig: {
        env: {
          GOOGLE_GEMINI_BASE_URL: "https://generativelanguage.googleapis.com",
        },
      },
      category: "official",
      sortIndex: 0,
      createdAt: Date.now(),
    },
    "agy-custom": {
      id: "agy-custom",
      name: "Antigravity 自定义代理",
      settingsConfig: {
        env: {
          GOOGLE_GEMINI_BASE_URL: "https://api.example.com/agy",
        },
      },
      category: "custom",
      sortIndex: 1,
      createdAt: Date.now() + 1,
    },
  },
  grokbuild: {},
  opencode: {
    "opencode-go": {
      id: "opencode-go",
      name: "OpenCode Go (Official)",
      settingsConfig: {
        npm: "@ai-sdk/openai-compatible",
        options: {
          baseURL: "https://api.opencode.ai/v1",
          apiKey: "sk-mock-opencode-key",
          setCacheKey: true,
        },
        models: {
          "claude-3-5-sonnet": { name: "Claude 3.5 Sonnet" },
        },
      },
      category: "official",
      sortIndex: 0,
      createdAt: Date.now(),
    },
  },
  openclaw: {},
  hermes: {},
  pi: {},
  "deepseek-harness": {
    "dsh-official": {
      id: "dsh-official",
      name: "DeepSeek 官方",
      settingsConfig: {
        displayName: "DeepSeek Official",
        api: "openai-completions",
        baseURL: "https://api.deepseek.com/v1",
        apiKeyEnv: "DEEPSEEK_API_KEY",
        apiKey: "sk-mock-deepseek-key",
        models: [
          { id: "deepseek-chat", name: "DeepSeek Chat (V3)" },
          { id: "deepseek-reasoner", name: "DeepSeek Reasoner (R1)" },
        ],
      },
      category: "official",
      sortIndex: 0,
      createdAt: Date.now(),
    },
    "dsh-kimi": {
      id: "dsh-kimi",
      name: "Moonshot Kimi",
      settingsConfig: {
        displayName: "Moonshot Kimi",
        api: "openai-completions",
        baseURL: "https://api.moonshot.cn/v1",
        apiKeyEnv: "MOONSHOT_API_KEY",
        apiKey: "sk-mock-kimi-key",
        models: [{ id: "moonshot-v1-auto", name: "Kimi Auto" }],
      },
      category: "custom",
      sortIndex: 1,
      createdAt: Date.now() + 1,
    },
  },
  mcode: {},
};

const defaultMockCurrent: Record<AppId, string> = {
  claude: "claude-official",
  "claude-desktop": "",
  codex: "codex-official",
  gemini: "agy-official",
  grokbuild: "",
  opencode: "opencode-go",
  openclaw: "",
  hermes: "",
  pi: "",
  "deepseek-harness": "dsh-official",
  mcode: "",
};

const defaultMockSettings: Settings = {
  showInTray: true,
  minimizeToTrayOnClose: true,
  enableClaudePluginIntegration: false,
  claudeConfigDir: "",
  codexConfigDir: "",
  language: "zh",
  visibleApps: {
    claude: true,
    "claude-desktop": false,
    codex: true,
    gemini: true,
    grokbuild: false,
    opencode: true,
    openclaw: false,
    hermes: false,
    pi: false,
    "deepseek-harness": true,
    mcode: false,
  },
};

export function installBrowserDevPolyfill() {
  if (typeof window === "undefined") return;
  if ((window as any).__TAURI_INTERNALS__) return;

  console.info("[DevPolyfill] Initializing Mock Tauri IPC Runtime for Browser Preview");

  // Load or seed providers
  const loadProviders = (): Record<AppId, Record<string, Provider>> => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PROVIDERS);
      if (saved) return JSON.parse(saved);
    } catch {}
    localStorage.setItem(STORAGE_KEY_PROVIDERS, JSON.stringify(defaultMockProviders));
    return defaultMockProviders;
  };

  const saveProviders = (providers: Record<AppId, Record<string, Provider>>) => {
    localStorage.setItem(STORAGE_KEY_PROVIDERS, JSON.stringify(providers));
  };

  const loadCurrent = (): Record<AppId, string> => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CURRENT);
      if (saved) return JSON.parse(saved);
    } catch {}
    localStorage.setItem(STORAGE_KEY_CURRENT, JSON.stringify(defaultMockCurrent));
    return defaultMockCurrent;
  };

  const saveCurrent = (current: Record<AppId, string>) => {
    localStorage.setItem(STORAGE_KEY_CURRENT, JSON.stringify(current));
  };

  const loadSettings = (): Settings => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SETTINGS);
      if (saved) return JSON.parse(saved);
    } catch {}
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(defaultMockSettings));
    return defaultMockSettings;
  };

  // Callbacks & event listeners
  const callbacks = new Map<number, (payload: any) => void>();
  let nextCallbackId = 1;

  const eventListeners = new Map<string, Set<(event: { event: string; payload: unknown; id: number }) => void>>();

  const emitEvent = (event: string, payload: unknown) => {
    const handlers = eventListeners.get(event);
    if (handlers) {
      handlers.forEach((h) => {
        try {
          h({ event, payload, id: nextCallbackId++ });
        } catch (e) {
          console.error("[MockEvent Error]", e);
        }
      });
    }
  };

  const mockInvoke = async (cmd: string, args: Record<string, any> = {}): Promise<any> => {
    switch (cmd) {
      case "get_init_error":
        return null;

      case "get_settings":
        return loadSettings();

      case "save_settings": {
        const currentSettings = loadSettings();
        const updated = { ...currentSettings, ...args.settings };
        localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(updated));
        return true;
      }

      case "get_providers": {
        const app = (args.app ?? "claude") as AppId;
        const allProviders = loadProviders();
        return allProviders[app] ?? {};
      }

      case "get_current_provider": {
        const app = (args.app ?? "claude") as AppId;
        const current = loadCurrent();
        return current[app] ?? "";
      }

      case "switch_provider": {
        const { app, id } = args as { app: AppId; id: string };
        const current = loadCurrent();
        current[app] = id;
        saveCurrent(current);
        emitEvent("provider_switched", { appType: app, providerId: id });
        return true;
      }

      case "add_provider": {
        const { app, provider } = args as { app: AppId; provider: Provider };
        const allProviders = loadProviders();
        allProviders[app] = allProviders[app] ?? {};
        const newId = provider.id || `custom-${Date.now()}`;
        allProviders[app][newId] = {
          ...provider,
          id: newId,
          createdAt: Date.now(),
        };
        saveProviders(allProviders);
        return true;
      }

      case "update_provider": {
        const { app, provider } = args as { app: AppId; provider: Provider };
        const allProviders = loadProviders();
        if (allProviders[app]?.[provider.id]) {
          allProviders[app][provider.id] = {
            ...allProviders[app][provider.id],
            ...provider,
          };
          saveProviders(allProviders);
        }
        return true;
      }

      case "delete_provider": {
        const { app, id } = args as { app: AppId; id: string };
        const allProviders = loadProviders();
        if (allProviders[app]?.[id]) {
          delete allProviders[app][id];
          saveProviders(allProviders);
          const current = loadCurrent();
          if (current[app] === id) {
            current[app] = Object.keys(allProviders[app])[0] ?? "";
            saveCurrent(current);
          }
        }
        return true;
      }

      case "update_providers_sort_order": {
        const { app, updates } = args as {
          app: AppId;
          updates: { id: string; sortIndex: number }[];
        };
        const allProviders = loadProviders();
        if (allProviders[app] && Array.isArray(updates)) {
          updates.forEach(({ id, sortIndex }) => {
            if (allProviders[app][id]) {
              allProviders[app][id].sortIndex = sortIndex;
            }
          });
          saveProviders(allProviders);
        }
        return true;
      }

      case "check_env_conflicts":
      case "scan_openclaw_config_health":
      case "list_profiles":
      case "get_opencode_live_provider_ids":
      case "get_openclaw_live_provider_ids":
        return [];

      case "get_openclaw_default_model":
        return { primary: null, fallback: [] };

      case "get_migration_result":
      case "get_skills_migration_result":
        return null;

      case "update_tray_menu":
        return true;

      case "get_mcp_config":
        return {};

      case "list_sessions":
        return [
          {
            providerId: "deepseek-harness",
            sessionId: "dsh-session-20260929",
            title: "DSH 适配与多模型并发调用",
            summary: "验证 DeepSeek Harness 架构适配及模型配置",
            projectDir: "E:/DeepSeek_Harness",
            createdAt: Date.now() - 3600000,
            lastActiveAt: Date.now() - 600000,
            sourcePath: "E:/DeepSeek_Harness/workspace/session-1.json",
            resumeCommand: "dsh resume dsh-session-20260929",
          },
          {
            providerId: "gemini",
            sessionId: "agy-session-20260929",
            title: "Antigravity CLI 全方位测试",
            summary: "Google Antigravity CLI 驱动与用量跟踪",
            projectDir: "E:/Code_file/Claude_code/2026/09/29",
            createdAt: Date.now() - 7200000,
            lastActiveAt: Date.now() - 1200000,
            sourcePath: "C:/Users/Satanchen/.gemini/antigravity-cli/brain/session-1.json",
            resumeCommand: "agy resume agy-session-20260929",
          },
          {
            providerId: "opencode",
            sessionId: "oc-session-20260929",
            title: "OpenCode v2 自定义 Provider 调试",
            summary: "测试 OpenCode v2 SQLite 会话存储与参数 round-trip",
            projectDir: "E:/Code_file/Claude_code/2026/09/29",
            createdAt: Date.now() - 10800000,
            lastActiveAt: Date.now() - 1800000,
            sourcePath: "C:/Users/Satanchen/.opencode/opencode.db",
            resumeCommand: "opencode session oc-session-20260929",
          },
        ];

      case "get_session_messages":
        return [
          {
            role: "user",
            content: "如何规划适配 OpenCode v2, AGY CLI 以及 DeepSeek Harness？",
            ts: Date.now() - 3600000,
          },
          {
            role: "assistant",
            content: "针对这三个方向，我们可以分别合并社区最新 PR 并统一会话与供应商管理。",
            ts: Date.now() - 3550000,
          },
        ];

      case "plugin:updater|check":
        return null;

      case "plugin:dialog|message":
        console.info("[Dialog Message]", args.message);
        return true;

      case "plugin:process|exit":
        console.warn("[App Exit]", args.code);
        return true;

      case "plugin:event|listen": {
        const { event, handler } = args as { event: string; handler: number };
        if (!eventListeners.has(event)) {
          eventListeners.set(event, new Set());
        }
        const set = eventListeners.get(event)!;
        const callbackFn = callbacks.get(handler);
        if (callbackFn) {
          set.add(callbackFn as any);
        }
        return handler;
      }

      case "plugin:event|unlisten": {
        const { event, eventId } = args as { event: string; eventId: number };
        const set = eventListeners.get(event);
        const callbackFn = callbacks.get(eventId);
        if (set && callbackFn) {
          set.delete(callbackFn as any);
        }
        return true;
      }

      case "plugin:log|log":
        return true;

      case "get_current_omo_provider_id":
      case "get_current_omo_slim_provider_id":
        return null;

      case "get_proxy_status":
        return { running: false };

      case "get_proxy_takeover_status":
        return false;

      case "set_window_theme":
        return true;

      case "plugin:app|version":
        return "3.20.4";

      default:
        if (cmd.startsWith("plugin:window|")) {
          if (cmd.includes("is_maximized")) return false;
          return true;
        }
        console.debug(`[Mock Tauri] Unhandled invoke cmd: ${cmd}`, args);
        return null;
    }
  };

  const transformCallback = (callback: Function, once = false): number => {
    const id = nextCallbackId++;
    callbacks.set(id, (payload: any) => {
      callback(payload);
      if (once) callbacks.delete(id);
    });
    return id;
  };

  const unregisterCallback = (id: number) => {
    callbacks.delete(id);
  };

  const convertFileSrc = (filePath: string) => filePath;

  (window as any).__TAURI_INTERNALS__ = {
    invoke: mockInvoke,
    transformCallback,
    unregisterCallback,
    convertFileSrc,
    metadata: {
      currentWindow: { label: "main" },
      currentWebview: { label: "main" },
    },
  };

  (window as any).__TAURI_EVENT_PLUGIN_INTERNALS__ = {
    unregisterListener: (_event: string, _eventId: number) => {},
  };

  (window as any).__TAURI__ = {
    core: { invoke: mockInvoke },
    event: {
      listen: async (event: string, handler: any) => {
        const id = transformCallback(handler);
        await mockInvoke("plugin:event|listen", { event, handler: id });
        return () => mockInvoke("plugin:event|unlisten", { event, eventId: id });
      },
      emit: emitEvent,
    },
  };
}
