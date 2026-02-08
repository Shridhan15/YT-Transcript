let sidebarIframe = null;

function createSidebar() {
    if (sidebarIframe) return;

    sidebarIframe = document.createElement("iframe");
    sidebarIframe.id = "yt-ai-sidebar";
    sidebarIframe.src = chrome.runtime.getURL("sidebar.html");

    sidebarIframe.style.position = "fixed";
    sidebarIframe.style.top = "0";
    sidebarIframe.style.right = "0";
    sidebarIframe.style.width = "360px";
    sidebarIframe.style.height = "100vh";
    sidebarIframe.style.border = "none";
    sidebarIframe.style.zIndex = "999999";

    document.body.appendChild(sidebarIframe);

    sidebarIframe.onload = () => {
        sendUrlToSidebar();
    };
}

function removeSidebar() {
    if (sidebarIframe) {
        sidebarIframe.remove();
        sidebarIframe = null;
    }
}

function sendUrlToSidebar() {
    if (!sidebarIframe) return;

    sidebarIframe.contentWindow.postMessage(
        { type: "YOUTUBE_URL", url: window.location.href },
        "*"
    );
}

// Listen for toolbar toggle
chrome.runtime.onMessage.addListener((msg) => {
    if (msg.type === "TOGGLE_SIDEBAR") {
        if (sidebarIframe) {
            removeSidebar();
        } else {
            createSidebar();
        }
    }
});

// Handle YouTube SPA navigation
let lastUrl = location.href;
new MutationObserver(() => {
    if (location.href !== lastUrl) {
        lastUrl = location.href;
        sendUrlToSidebar();
    }
}).observe(document, { subtree: true, childList: true });
