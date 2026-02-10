// ================= CONFIG =================
const SIDEBAR_WIDTH = 360;
const SLIDE_DURATION = 300;

// ================= STATE =================
let sidebar = null;
let isSidebarOpen = false;

// ================= SIDEBAR =================

function openSidebar() {
    if (isSidebarOpen) return;

    sidebar = document.createElement("iframe");
    sidebar.id = "yt-ai-sidebar";
    sidebar.src = chrome.runtime.getURL("sidebar.html");
    sidebar.allow = "microphone"; // Critical for voice

    Object.assign(sidebar.style, {
        position: "fixed",
        top: "0",
        right: "0",
        width: `${SIDEBAR_WIDTH}px`,
        height: "100vh",
        border: "none",
        zIndex: "2147483647", // Max z-index to ensure it's on top
        background: "transparent", // Let the iframe handle bg
        transform: `translateX(${SIDEBAR_WIDTH}px)`,
        transition: "transform 0.3s ease",
        boxShadow: "-5px 0 15px rgba(0,0,0,0.5)"
    });

    document.body.appendChild(sidebar);

    // Slide in
    requestAnimationFrame(() => {
        sidebar.style.transform = "translateX(0)";
    });

    // We don't rely ONLY on onload anymore, but keep it as a backup
    sidebar.onload = sendUrlToSidebar;
    isSidebarOpen = true;
}

function closeSidebar() {
    if (!isSidebarOpen || !sidebar) return;

    sidebar.style.transform = `translateX(${SIDEBAR_WIDTH}px)`;

    setTimeout(() => {
        if (sidebar) sidebar.remove();
        sidebar = null;
        isSidebarOpen = false;
    }, SLIDE_DURATION);
}

// ================= COMMUNICATION HUB =================

function sendUrlToSidebar() {
    if (!sidebar?.contentWindow) return;

    sidebar.contentWindow.postMessage(
        { type: "YOUTUBE_URL", url: window.location.href },
        "*"
    );
}

// Listen for messages from the Extension Popup/Sidebar
window.addEventListener("message", (event) => {
    // 1. Handshake: Sidebar says "I'm loaded", we send URL
    if (event.data?.type === "SIDEBAR_READY") {
        sendUrlToSidebar();
        return;
    }

    // 2. Agent Actions: Sidebar says "Pause video"
    if (event.data?.type === "YT_AGENT_INTENT") {
        const { tasks } = event.data.payload || {};
        if (Array.isArray(tasks)) {
            console.log("🤖 executing tasks:", tasks);
            tasks.forEach(executeTask);
        }
    }
});

// ================= CHROME EVENTS =================

chrome.runtime.onMessage.addListener((msg) => {
    if (msg.type === "TOGGLE_SIDEBAR") {
        isSidebarOpen ? closeSidebar() : openSidebar();
    }
});

// ================= SPA URL MONITORING =================
// YouTube is a Single Page App, so we need to watch for URL changes
let lastUrl = location.href;

new MutationObserver(() => {
    if (location.href !== lastUrl) {
        lastUrl = location.href;
        if (isSidebarOpen) {
            sendUrlToSidebar();
        }
    }
}).observe(document, { subtree: true, childList: true });


// ================= VIDEO CONTROL =================

function getVideo() {
    return document.querySelector("video");
}

function executeTask(task) {
    const video = getVideo();

    // Search doesn't need a video element
    if (!video && task.intent !== "SEARCH") {
        console.warn("No video element found");
        return;
    }

    switch (task.intent) {
        case "PLAY":
            video.play();
            break;
        case "PAUSE":
            video.pause();
            break;
        case "SEEK":
            // task.value should be seconds (e.g., -10 or 10)
            video.currentTime += (Number(task.value) || 0);
            break;
        case "MUTE":
            video.muted = true;
            break;
        case "UNMUTE":
            video.muted = false;
            break;
        case "SPEED":
            video.playbackRate = Number(task.value) || 1;
            break;
        case "NEXT": {
            const nextBtn = document.querySelector(".ytp-next-button");
            nextBtn?.click();
            break;
        }
        case "SEARCH":
            if (task.query) {
                const q = encodeURIComponent(task.query);
                window.location.href = `https://www.youtube.com/results?search_query=${q}`;
            }
            break;
        default:
            console.warn("Unknown intent:", task.intent);
    }
}