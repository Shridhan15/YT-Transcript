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

    Object.assign(sidebar.style, {
        position: "fixed",
        top: "0",
        right: "0",
        width: `${SIDEBAR_WIDTH}px`,
        height: "100vh",
        border: "none",
        zIndex: "999999",
        background: "#0f172a",
        transform: `translateX(${SIDEBAR_WIDTH}px)`,
        transition: "transform 0.3s ease"
    });

    document.body.appendChild(sidebar);

    // slide in
    requestAnimationFrame(() => {
        sidebar.style.transform = "translateX(0)";
    });

    sidebar.onload = sendUrlToSidebar;
    isSidebarOpen = true;
}

function closeSidebar() {
    if (!isSidebarOpen || !sidebar) return;

    sidebar.style.transform = `translateX(${SIDEBAR_WIDTH}px)`;

    setTimeout(() => {
        sidebar.remove();
        sidebar = null;
        isSidebarOpen = false;
    }, SLIDE_DURATION);
}

// ================= URL MESSAGE =================

function sendUrlToSidebar() {
    if (!sidebar) return;

    sidebar.contentWindow.postMessage(
        { type: "YOUTUBE_URL", url: location.href },
        "*"
    );
}

// ================= TOGGLE =================

chrome.runtime.onMessage.addListener((msg) => {
    if (msg.type === "TOGGLE_SIDEBAR") {
        isSidebarOpen ? closeSidebar() : openSidebar();
    }
});

// ================= SPA HANDLING =================

let lastUrl = location.href;

new MutationObserver(() => {
    if (location.href !== lastUrl) {
        lastUrl = location.href;
        if (isSidebarOpen) {
            sendUrlToSidebar();
        }
    }
}).observe(document, { subtree: true, childList: true });
