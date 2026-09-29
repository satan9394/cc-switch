import type { AppId } from "@/lib/api/types";
import type { Provider, Settings, McpServer, McpServersMap } from "@/types";
import type {
  DailyStats,
  ModelStats,
  ProviderStats,
  RequestLog,
  UsageSummary,
  UsageSummaryByApp,
  DataSourceSummary,
  ModelPricing,
  ModelsDevSyncState,
} from "@/types/usage";
import type { InstalledSkill, SkillRepo, DiscoverableSkill } from "@/lib/api/skills";
import type { Prompt } from "@/lib/api/prompts";

const STORAGE_KEY_PROVIDERS = "cc-switch-mock-providers";
const STORAGE_KEY_CURRENT = "cc-switch-mock-current";
const STORAGE_KEY_SETTINGS = "cc-switch-mock-settings";
const STORAGE_KEY_PROMPTS = "cc-switch-mock-prompts";
const STORAGE_KEY_MCP = "cc-switch-mock-mcp";
const STORAGE_KEY_SKILLS = "cc-switch-mock-skills";

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

const defaultMockPrompts: Record<AppId, Record<string, Prompt>> = {
  claude: {
    "prompt-default": {
      id: "prompt-default",
      name: "全栈软件架构师",
      content: "你是一个经验丰富的资深全栈工程师与架构师，思考深入，交付干净、高质量、具备充分测试的代码。",
      description: "通用开发系统提示词",
      enabled: true,
      createdAt: Date.now() - 86400000,
    },
  },
  "claude-desktop": {},
  codex: {},
  gemini: {
    "prompt-agy": {
      id: "prompt-agy",
      name: "Antigravity Agent 指南",
      content: "优先查阅项目中 AGENTS.md 规范，保持严格的代码安全与回滚保障。",
      description: "AGY 项目主提示词",
      enabled: true,
      createdAt: Date.now() - 3600000,
    },
  },
  grokbuild: {},
  opencode: {
    "prompt-oc": {
      id: "prompt-oc",
      name: "OpenCode V2 交互优化",
      content: "配合 OpenCode SQLite 会话与工具链，保持代码简洁。",
      description: "OpenCode 默认提示词",
      enabled: true,
      createdAt: Date.now() - 7200000,
    },
  },
  openclaw: {},
  hermes: {},
  pi: {},
  "deepseek-harness": {
    "prompt-dsh": {
      id: "prompt-dsh",
      name: "DeepSeek Harness 工程中枢",
      content: "深度思考并善用各子 Agent 与 Star 技能库协同完成复杂重构。",
      description: "DSH 专属提示词",
      enabled: true,
      createdAt: Date.now() - 10800000,
    },
  },
  mcode: {},
};

const defaultMockMcpServers: McpServersMap = {
  context7: {
    id: "context7",
    name: "Context7 知识库",
    enabled: true,
    apps: {
      claude: true,
      codex: true,
      gemini: true,
      opencode: true,
      openclaw: false,
      hermes: false,
      "claude-desktop": false,
      grokbuild: false,
      mcode: false,
    },
    server: {
      type: "stdio",
      command: "npx",
      args: ["-y", "@upstash/context7-mcp"],
    },
  },
  tavily: {
    id: "tavily",
    name: "Tavily Web 检索",
    enabled: true,
    apps: {
      claude: true,
      codex: true,
      gemini: true,
      opencode: true,
      openclaw: false,
      hermes: false,
      "claude-desktop": false,
      grokbuild: false,
      mcode: false,
    },
    server: {
      type: "stdio",
      command: "npx",
      args: ["-y", "tavily-mcp"],
    },
  },
  pencil: {
    id: "pencil",
    name: "Pencil 本地设计工具",
    enabled: true,
    apps: {
      claude: true,
      codex: true,
      gemini: true,
      opencode: true,
      openclaw: false,
      hermes: false,
      "claude-desktop": false,
      grokbuild: false,
      mcode: false,
    },
    server: {
      type: "stdio",
      command: "node",
      args: ["C:/tools/pencil-mcp/index.js"],
    },
  },
};

const defaultMockSkills: InstalledSkill[] = [
  {
    id: "browser-skill",
    name: "Browser Skill",
    description: "通过 bsk CLI 驱动 Chromium 浏览器实现页面访问、表单填写与全自动测试",
    directory: "browser-skill",
    repoOwner: "Tencent",
    repoName: "BrowserSkill",
    repoBranch: "main",
    apps: {
      claude: true,
      codex: true,
      gemini: true,
      opencode: true,
      openclaw: false,
      hermes: true,
      pi: true,
    },
    installedAt: Date.now() - 86400000 * 3,
    updatedAt: Date.now() - 3600000,
  },
  {
    id: "agy-customizations",
    name: "Antigravity Customizations",
    description: "Antigravity 自定义体系完整参考与规则自动生成",
    directory: "agy-customizations",
    repoOwner: "google",
    repoName: "antigravity",
    repoBranch: "main",
    apps: {
      claude: false,
      codex: true,
      gemini: true,
      opencode: true,
      openclaw: false,
      hermes: false,
      pi: false,
    },
    installedAt: Date.now() - 86400000 * 2,
    updatedAt: Date.now() - 7200000,
  },
  {
    id: "dsh-engineering",
    name: "DeepSeek Harness Engineering",
    description: "DeepSeek Harness 架构治理与工程能力增强库",
    directory: "dsh-engineering",
    repoOwner: "deepseek-ai",
    repoName: "dsh",
    repoBranch: "main",
    apps: {
      claude: true,
      codex: true,
      gemini: true,
      opencode: true,
      openclaw: false,
      hermes: false,
      pi: false,
    },
    installedAt: Date.now() - 86400000,
    updatedAt: Date.now() - 1800000,
  },
];

const mockDiscoverableSkills: DiscoverableSkill[] = [
  {
    key: "web-search-pro",
    name: "Web Search Pro",
    description: "强大的多引擎联网检索与 Markdown 提取技能",
    directory: "web-search-pro",
    repoOwner: "skills-manager",
    repoName: "official-skills",
    repoBranch: "main",
  },
  {
    key: "code-audit",
    name: "Code Audit Sentinel",
    description: "代码安全合规扫描与漏洞预警插件",
    directory: "code-audit",
    repoOwner: "skills-manager",
    repoName: "official-skills",
    repoBranch: "main",
  },
];

const defaultMockPricing: ModelPricing[] = [
  {
    modelId: "deepseek-chat",
    displayName: "DeepSeek Chat (V3)",
    inputCostPerMillion: "0.14",
    outputCostPerMillion: "0.28",
    cacheReadCostPerMillion: "0.014",
    cacheCreationCostPerMillion: "0.14",
  },
  {
    modelId: "deepseek-reasoner",
    displayName: "DeepSeek Reasoner (R1)",
    inputCostPerMillion: "0.55",
    outputCostPerMillion: "2.19",
    cacheReadCostPerMillion: "0.14",
    cacheCreationCostPerMillion: "0.55",
  },
  {
    modelId: "gemini-2.5-pro",
    displayName: "Gemini 2.5 Pro",
    inputCostPerMillion: "1.25",
    outputCostPerMillion: "5.00",
    cacheReadCostPerMillion: "0.31",
    cacheCreationCostPerMillion: "1.25",
  },
  {
    modelId: "gemini-2.5-flash",
    displayName: "Gemini 2.5 Flash",
    inputCostPerMillion: "0.075",
    outputCostPerMillion: "0.30",
    cacheReadCostPerMillion: "0.018",
    cacheCreationCostPerMillion: "0.075",
  },
  {
    modelId: "claude-3-5-sonnet",
    displayName: "Claude 3.5 Sonnet",
    inputCostPerMillion: "3.00",
    outputCostPerMillion: "15.00",
    cacheReadCostPerMillion: "0.30",
    cacheCreationCostPerMillion: "3.75",
  },
];

export function installBrowserDevPolyfill() {
  if (typeof window === "undefined") return;
  if ((window as any).__TAURI_INTERNALS__) return;

  console.info("[DevPolyfill] Initializing Enhanced Mock Tauri IPC Runtime for Browser Preview");

  // Providers
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

  // Prompts
  const loadPrompts = (): Record<AppId, Record<string, Prompt>> => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PROMPTS);
      if (saved) return JSON.parse(saved);
    } catch {}
    localStorage.setItem(STORAGE_KEY_PROMPTS, JSON.stringify(defaultMockPrompts));
    return defaultMockPrompts;
  };

  // MCP
  const loadMcpServers = (): McpServersMap => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_MCP);
      if (saved) return JSON.parse(saved);
    } catch {}
    localStorage.setItem(STORAGE_KEY_MCP, JSON.stringify(defaultMockMcpServers));
    return defaultMockMcpServers;
  };

  // Skills
  const loadSkills = (): InstalledSkill[] => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SKILLS);
      if (saved) return JSON.parse(saved);
    } catch {}
    localStorage.setItem(STORAGE_KEY_SKILLS, JSON.stringify(defaultMockSkills));
    return defaultMockSkills;
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

  // Generate 14-day trend stats
  const generateUsageTrends = (): DailyStats[] => {
    const trends: DailyStats[] = [];
    const now = new Date();
    for (let i = 13; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 86400000);
      const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      const reqs = 15 + Math.floor(Math.sin(i * 0.8) * 10 + Math.random() * 8);
      const tokens = reqs * 12500 + Math.floor(Math.random() * 4000);
      const cost = (tokens * 0.0000012).toFixed(4);
      trends.push({
        date: dateStr,
        requestCount: reqs,
        totalCost: cost,
        totalTokens: tokens,
        totalInputTokens: Math.floor(tokens * 0.65),
        totalOutputTokens: Math.floor(tokens * 0.15),
        totalCacheCreationTokens: Math.floor(tokens * 0.05),
        totalCacheReadTokens: Math.floor(tokens * 0.15),
      });
    }
    return trends;
  };

  const usageTrends = generateUsageTrends();

  const mockInvoke = async (cmd: string, args: Record<string, any> = {}): Promise<any> => {
    switch (cmd) {
      // ===== App Initialization & Lifecycle =====
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

      // ===== Providers =====
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

      // ===== Usage Statistics (统计详情数据) =====
      case "get_usage_summary": {
        const summary: UsageSummary = {
          totalRequests: 326,
          totalCost: "4.8912",
          totalInputTokens: 2540000,
          totalOutputTokens: 412000,
          totalCacheCreationTokens: 520000,
          totalCacheReadTokens: 1680000,
          successRate: 99.2,
          realTotalTokens: 5152000,
          cacheHitRate: 0.71,
        };
        return summary;
      }

      case "get_usage_summary_by_app": {
        const byApp: UsageSummaryByApp[] = [
          {
            appType: "deepseek-harness",
            summary: {
              totalRequests: 132,
              totalCost: "1.8420",
              totalInputTokens: 1120000,
              totalOutputTokens: 198000,
              totalCacheCreationTokens: 240000,
              totalCacheReadTokens: 820000,
              successRate: 99.5,
              realTotalTokens: 2378000,
              cacheHitRate: 0.74,
            },
          },
          {
            appType: "gemini",
            summary: {
              totalRequests: 88,
              totalCost: "1.2350",
              totalInputTokens: 680000,
              totalOutputTokens: 110000,
              totalCacheCreationTokens: 130000,
              totalCacheReadTokens: 450000,
              successRate: 98.8,
              realTotalTokens: 1370000,
              cacheHitRate: 0.69,
            },
          },
          {
            appType: "opencode",
            summary: {
              totalRequests: 64,
              totalCost: "0.9840",
              totalInputTokens: 450000,
              totalOutputTokens: 68000,
              totalCacheCreationTokens: 90000,
              totalCacheReadTokens: 280000,
              successRate: 99.8,
              realTotalTokens: 888000,
              cacheHitRate: 0.67,
            },
          },
          {
            appType: "claude",
            summary: {
              totalRequests: 42,
              totalCost: "0.8302",
              totalInputTokens: 290000,
              totalOutputTokens: 36000,
              totalCacheCreationTokens: 60000,
              totalCacheReadTokens: 130000,
              successRate: 97.6,
              realTotalTokens: 516000,
              cacheHitRate: 0.62,
            },
          },
        ];
        return byApp;
      }

      case "get_usage_trends":
        return usageTrends;

      case "get_provider_stats": {
        const stats: ProviderStats[] = [
          {
            providerId: "dsh-official",
            providerName: "DeepSeek 官方",
            requestCount: 132,
            totalTokens: 2378000,
            totalCost: "1.8420",
            successRate: 99.5,
            avgLatencyMs: 680,
          },
          {
            providerId: "agy-official",
            providerName: "Antigravity Google 官方",
            requestCount: 88,
            totalTokens: 1370000,
            totalCost: "1.2350",
            successRate: 98.8,
            avgLatencyMs: 890,
          },
          {
            providerId: "opencode-go",
            providerName: "OpenCode Go (Official)",
            requestCount: 64,
            totalTokens: 888000,
            totalCost: "0.9840",
            successRate: 99.8,
            avgLatencyMs: 540,
          },
          {
            providerId: "claude-official",
            providerName: "Claude 官方 (Official)",
            requestCount: 42,
            totalTokens: 516000,
            totalCost: "0.8302",
            successRate: 97.6,
            avgLatencyMs: 1120,
          },
        ];
        return stats;
      }

      case "get_model_stats": {
        const stats: ModelStats[] = [
          {
            model: "deepseek-chat",
            requestCount: 92,
            totalTokens: 1650000,
            totalCost: "1.1550",
            avgCostPerRequest: "0.0125",
          },
          {
            model: "deepseek-reasoner",
            requestCount: 40,
            totalTokens: 728000,
            totalCost: "0.6870",
            avgCostPerRequest: "0.0171",
          },
          {
            model: "gemini-2.5-pro",
            requestCount: 52,
            totalTokens: 820000,
            totalCost: "0.7850",
            avgCostPerRequest: "0.0150",
          },
          {
            model: "gemini-2.5-flash",
            requestCount: 36,
            totalTokens: 550000,
            totalCost: "0.4500",
            avgCostPerRequest: "0.0125",
          },
          {
            model: "claude-3-5-sonnet",
            requestCount: 64,
            totalTokens: 888000,
            totalCost: "0.9840",
            avgCostPerRequest: "0.0153",
          },
        ];
        return stats;
      }

      case "get_request_logs": {
        const now = Date.now();
        const logs: RequestLog[] = [
          {
            requestId: "req-dsh-001",
            providerId: "dsh-official",
            providerName: "DeepSeek 官方",
            appType: "deepseek-harness",
            model: "deepseek-reasoner",
            pricingModel: "deepseek-reasoner",
            costMultiplier: "1.0",
            inputTokens: 3200,
            outputTokens: 840,
            cacheReadTokens: 1600,
            cacheCreationTokens: 400,
            inputCostUsd: "0.00176",
            outputCostUsd: "0.00184",
            cacheReadCostUsd: "0.00022",
            cacheCreationCostUsd: "0.00022",
            totalCostUsd: "0.00404",
            isStreaming: true,
            latencyMs: 720,
            statusCode: 200,
            createdAt: now - 120000,
            dataSource: "Proxy Gateway",
          },
          {
            requestId: "req-agy-002",
            providerId: "agy-official",
            providerName: "Antigravity Google 官方",
            appType: "gemini",
            model: "gemini-2.5-pro",
            pricingModel: "gemini-2.5-pro",
            costMultiplier: "1.0",
            inputTokens: 4800,
            outputTokens: 1250,
            cacheReadTokens: 2400,
            cacheCreationTokens: 600,
            inputCostUsd: "0.00600",
            outputCostUsd: "0.00625",
            cacheReadCostUsd: "0.00074",
            cacheCreationCostUsd: "0.00075",
            totalCostUsd: "0.01374",
            isStreaming: true,
            latencyMs: 890,
            statusCode: 200,
            createdAt: now - 360000,
            dataSource: "Proxy Gateway",
          },
          {
            requestId: "req-oc-003",
            providerId: "opencode-go",
            providerName: "OpenCode Go (Official)",
            appType: "opencode",
            model: "claude-3-5-sonnet",
            pricingModel: "claude-3-5-sonnet",
            costMultiplier: "1.0",
            inputTokens: 2600,
            outputTokens: 620,
            cacheReadTokens: 1200,
            cacheCreationTokens: 300,
            inputCostUsd: "0.00780",
            outputCostUsd: "0.00930",
            cacheReadCostUsd: "0.00036",
            cacheCreationCostUsd: "0.00112",
            totalCostUsd: "0.01858",
            isStreaming: true,
            latencyMs: 540,
            statusCode: 200,
            createdAt: now - 720000,
            dataSource: "Session Sync",
          },
          {
            requestId: "req-dsh-004",
            providerId: "dsh-official",
            providerName: "DeepSeek 官方",
            appType: "deepseek-harness",
            model: "deepseek-chat",
            pricingModel: "deepseek-chat",
            costMultiplier: "1.0",
            inputTokens: 1800,
            outputTokens: 450,
            cacheReadTokens: 800,
            cacheCreationTokens: 200,
            inputCostUsd: "0.00025",
            outputCostUsd: "0.00012",
            cacheReadCostUsd: "0.00001",
            cacheCreationCostUsd: "0.00002",
            totalCostUsd: "0.00040",
            isStreaming: true,
            latencyMs: 410,
            statusCode: 200,
            createdAt: now - 1200000,
            dataSource: "Proxy Gateway",
          },
        ];
        return {
          data: logs,
          total: logs.length,
          page: 0,
          pageSize: 20,
        };
      }

      case "get_model_pricing":
        return defaultMockPricing;

      case "get_models_dev_sync_config": {
        const state: ModelsDevSyncState = {
          config: {
            autoSyncEnabled: false,
            includeCommonModels: true,
            selectedModelKeys: [],
            excludedCommonModelKeys: [],
            lastSyncAt: Date.now() - 86400000,
            lastSyncError: null,
          },
          configPath: "C:/Users/Satanchen/.cc-switch/model-pricing.json",
        };
        return state;
      }

      case "get_usage_data_sources": {
        const sources: DataSourceSummary[] = [
          { dataSource: "Proxy Gateway", requestCount: 220, totalCostUsd: "3.2450" },
          { dataSource: "Session History Sync", requestCount: 106, totalCostUsd: "1.6462" },
        ];
        return sources;
      }

      case "sync_session_usage":
      case "rebuild_codex_usage":
        return {
          imported: 12,
          skipped: 48,
          filesScanned: 60,
          suspectedDuplicates: 0,
          deferredFiles: 0,
          errors: [],
        };

      case "check_provider_limits":
        return {
          providerId: args.providerId,
          dailyUsage: "0.45",
          dailyLimit: "10.00",
          dailyExceeded: false,
          monthlyUsage: "4.89",
          monthlyLimit: "100.00",
          monthlyExceeded: false,
        };

      // ===== Skills =====
      case "get_installed_skills":
        return loadSkills();

      case "get_skill_backups":
      case "scan_unmanaged_skills":
        return [];

      case "discover_available_skills":
        return mockDiscoverableSkills;

      case "get_skill_repos": {
        const repos: SkillRepo[] = [
          { owner: "anthropics", name: "skills", branch: "main", enabled: true },
          { owner: "google", name: "antigravity", branch: "main", enabled: true },
        ];
        return repos;
      }

      case "check_skill_updates":
        return [];

      case "get_skills":
      case "get_skills_for_app":
        return [];

      case "toggle_skill_app": {
        const { id, app, enabled } = args as { id: string; app: AppId; enabled: boolean };
        const skills = loadSkills();
        const skill = skills.find((s) => s.id === id);
        if (skill) {
          (skill.apps as unknown as Record<string, boolean>)[app] = enabled;
          localStorage.setItem(STORAGE_KEY_SKILLS, JSON.stringify(skills));
        }
        return true;
      }

      // ===== Prompts (提示词) =====
      case "get_prompts": {
        const app = (args.app ?? "claude") as AppId;
        const allPrompts = loadPrompts();
        return allPrompts[app] ?? {};
      }

      case "get_current_prompt_file_content":
        return "你是一个资深全栈工程师，回答严谨、专业并提供可直接执行的代码。";

      case "upsert_prompt": {
        const { app, id, prompt } = args as { app: AppId; id: string; prompt: Prompt };
        const allPrompts = loadPrompts();
        allPrompts[app] = allPrompts[app] ?? {};
        allPrompts[app][id] = prompt;
        localStorage.setItem(STORAGE_KEY_PROMPTS, JSON.stringify(allPrompts));
        return true;
      }

      case "delete_prompt": {
        const { app, id } = args as { app: AppId; id: string };
        const allPrompts = loadPrompts();
        if (allPrompts[app]?.[id]) {
          delete allPrompts[app][id];
          localStorage.setItem(STORAGE_KEY_PROMPTS, JSON.stringify(allPrompts));
        }
        return true;
      }

      case "enable_prompt": {
        const { app, id } = args as { app: AppId; id: string };
        const allPrompts = loadPrompts();
        if (allPrompts[app]) {
          Object.keys(allPrompts[app]).forEach((pid) => {
            allPrompts[app][pid].enabled = pid === id;
          });
          localStorage.setItem(STORAGE_KEY_PROMPTS, JSON.stringify(allPrompts));
        }
        return true;
      }

      // ===== MCP (模型上下文协议管理) =====
      case "get_mcp_servers":
        return loadMcpServers();

      case "get_claude_mcp_status":
        return { enabled: true };

      case "read_claude_mcp_config":
        return JSON.stringify({ mcpServers: defaultMockMcpServers }, null, 2);

      case "upsert_mcp_server": {
        const { server } = args as { server: McpServer };
        const servers = loadMcpServers();
        servers[server.id] = server;
        localStorage.setItem(STORAGE_KEY_MCP, JSON.stringify(servers));
        return true;
      }

      case "delete_mcp_server": {
        const { id } = args as { id: string };
        const servers = loadMcpServers();
        if (servers[id]) {
          delete servers[id];
          localStorage.setItem(STORAGE_KEY_MCP, JSON.stringify(servers));
        }
        return true;
      }

      case "toggle_mcp_app": {
        const { serverId, app, enabled } = args as { serverId: string; app: AppId; enabled: boolean };
        const servers = loadMcpServers();
        if (servers[serverId]) {
          (servers[serverId].apps as unknown as Record<string, boolean>)[app] = enabled;
          localStorage.setItem(STORAGE_KEY_MCP, JSON.stringify(servers));
        }
        return true;
      }

      // ===== Sessions =====
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

      // ===== Proxy & Gateway =====
      case "get_proxy_status":
        return { running: false, port: 15721 };

      case "get_proxy_takeover_status":
        return {
          claude: false,
          codex: false,
          gemini: false,
          grokbuild: false,
        };

      case "get_global_proxy_config":
        return {
          enabled: false,
          port: 15721,
          proxyUrl: "http://127.0.0.1:7897",
        };

      case "get_direct_provider":
        return null;

      case "get_current_omo_provider_id":
      case "get_current_omo_slim_provider_id":
        return null;

      // ===== Auth & Copilot =====
      case "auth_get_status":
        return {
          provider: args.authProvider || "github_copilot",
          authenticated: false,
          default_account_id: null,
          accounts: [],
        };

      case "auth_list_accounts":
        return [];

      case "copilot_get_status":
        return {
          authenticated: false,
          accounts: [],
        };

      // ===== Environment & Compatibility =====
      case "check_env_conflicts":
      case "scan_openclaw_config_health":
      case "list_profiles":
      case "get_opencode_live_provider_ids":
      case "get_openclaw_live_provider_ids":
      case "get_workspaces":
        return [];

      case "get_openclaw_default_model":
        return { primary: null, fallback: [] };

      case "get_migration_result":
      case "get_skills_migration_result":
        return null;

      case "update_tray_menu":
      case "set_window_theme":
        return true;

      case "get_mcp_config":
        return {};

      case "is_portable_mode":
        return false;

      // ===== Path Plugin Resolution =====
      case "plugin:path|join": {
        const parts = (args.paths || []) as string[];
        return parts.join("/").replace(/\/+/g, "/");
      }

      case "plugin:path|resolve": {
        const parts = (args.paths || []) as string[];
        return parts.join("/").replace(/\/+/g, "/");
      }

      case "plugin:path|resolve_directory":
        return "C:/Users/Satanchen/.cc-switch";

      case "plugin:path|app_config_dir":
        return "C:/Users/Satanchen/.cc-switch";

      case "plugin:path|home_dir":
        return "C:/Users/Satanchen";

      case "plugin:app|version":
        return "3.20.4";

      // ===== Health & Failover =====
      case "get_provider_health":
        return { status: "healthy", latency_ms: 120, last_checked: Date.now() };

      case "get_auto_failover_enabled":
        return false;

      case "get_failover_queue":
        return [];

      case "get_dsh_current_state":
        return { isRunning: false, currentModel: "deepseek-chat", activeSessions: 1 };

      case "plugin:updater|check":
        return null;

      case "plugin:dialog|message":
        console.info("[Dialog Message]", args.message);
        return true;

      case "plugin:process|exit":
        console.warn("[App Exit]", args.code);
        return true;

      case "plugin:log|log":
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
