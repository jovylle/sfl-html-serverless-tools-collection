(() => {
  if (typeof window === "undefined") return;

  const projectmate = window.ProjectMate;
  if (!projectmate || typeof projectmate.init !== "function") {
    console.warn("[ProjectMate] embed.js not loaded or unavailable.");
    return;
  }

  const host = window.location.host || "localhost";
  const isLocal = ["localhost", "127.0.0.1"].includes(window.location.hostname);

  projectmate.init({
    projectId: "sfl-html-serverless-tools",
    appUrl: "https://projectmate.uft1.com/overlay/",
    host: {
      id: host,
      name: "SFL Community Tools",
      version: "1.0.0",
      environment: isLocal ? "development" : "production",
      region: "ap-southeast-1",
      locale: "en-PH",
      timezone: "Asia/Manila",
      modules: {
        feedback: true,
        updates: true,
        issues: false,
        chat: false
      }
    },
    about: {
      title: "SFL Community Tools",
      description: "Independent static tools for Sunflower Land players."
    },
    features: {
      chat: false,
      feedback: true,
      updates: true,
      issues: false,
      about: true
    },
    theme: "auto",
    accentColor: "#4f46e5",
    links: {
      docs: "https://github.com/jovylle/sfl-html-serverless-tools-collection"
    },
    changelog: [
      {
        version: "1.0.0",
        date: "2026-05-09",
        bullets: [
          "Enabled ProjectMate overlay across all tool pages",
          "Added About, Feedback, and Updates support sections"
        ]
      }
    ],
    quotes: [
      "Great hosting is thoughtful consistency.",
      "Ship, learn, improve.",
      "Clarity beats cleverness."
    ],
    launcher: {
      position: "bottom-right",
      offsetX: 16,
      offsetY: 16,
      label: "Help"
    },
    autoOpen: {
      hash: "help",
      query: { name: "help", value: "1" },
      path: "/support",
      pathMatch: "prefix"
    }
  });
})();
