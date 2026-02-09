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
    sidebar.allow = "microphone";

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



function getVideo() {
    return document.querySelector("video");
}
window.addEventListener("message", (event) => {
    if (event.data?.type !== "YT_AGENT_INTENT") return;

    const { tasks } = event.data.payload || {};
    if (!Array.isArray(tasks)) return;

    console.log("YT Agent tasks received:", tasks);
    tasks.forEach(executeTask);
});


function executeTask(task) {
    const video = getVideo();

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
            video.currentTime += task.value || 0;
            break;

        case "MUTE":
            video.muted = true;
            break;

        case "UNMUTE":
            video.muted = false;
            break;

        case "SPEED":
            video.playbackRate = task.value || 1;
            break;

        case "NEXT": {
            const nextBtn = document.querySelector(".ytp-next-button");
            nextBtn?.click();
            break;
        }

        case "SEARCH":
            if (task.query) {
                const q = encodeURIComponent(task.query);
                window.location.href =
                    `https://www.youtube.com/results?search_query=${q}`;
            }
            break;

        default:
            console.warn("Unknown intent:", task.intent);
    }
}

