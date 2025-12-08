// --- CONFIGURATION ---
// NOTE: For a real deployment, never expose keys in client-side code. Use a backend proxy.
const API_KEY = "YOUR_GEMINI_API_KEY_HERE"; 

let isVoiceEnabled = true;

// --- DOM ELEMENT SELECTORS ---
const navbar = document.getElementById('navbar');
const mobileBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const themeToggle = document.getElementById('themeToggle');
const scrollProgress = document.getElementById('scrollProgress');

// --- 1. UI INTERACTIONS & ANIMATIONS ---

// Dark Mode Toggle
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    themeToggle.innerText = isDark ? '☀️' : '🌙';
});

// Scroll Progress Bar
window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.body.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    scrollProgress.style.width = scrollPercent + '%';

    // Navbar Shadow
    if (scrollTop > 50) {
        navbar.classList.add('shadow-neo');
        navbar.classList.remove('py-4');
    } else {
        navbar.classList.remove('shadow-neo');
        navbar.classList.add('py-4');
    }
});

// Mobile Menu
mobileBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});

// Scroll Reveal
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('active');
    });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Number Counters
const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const target = parseInt(entry.target.getAttribute('data-target'));
            const duration = 2000;
            const startTime = performance.now();
            
            function update(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
                entry.target.innerText = Math.floor(target * ease);
                if (progress < 1) requestAnimationFrame(update);
                else entry.target.innerText = target + (target > 100 ? '+' : '');
            }
            requestAnimationFrame(update);
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });
document.querySelectorAll('.counter').forEach(el => counterObserver.observe(el));


// --- 2. CHART.JS CONFIGURATION ---
document.addEventListener('DOMContentLoaded', () => {
    const ctx = document.getElementById('experienceChart').getContext('2d');
    Chart.defaults.font.family = "'Space Grotesk', sans-serif";
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Banking', 'Legal', 'Operations', 'Finance'],
            datasets: [{
                label: 'Expertise Mix',
                data: [40, 25, 20, 15],
                backgroundColor: ['#1E3A8A', '#C2410C', '#18181B', '#9CA3AF'],
                borderWidth: 2,
                borderColor: '#18181B',
                hoverOffset: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom', labels: { color: '#18181B', font: { weight: 'bold' }, usePointStyle: true, boxWidth: 10 } },
                tooltip: { backgroundColor: '#18181B', titleFont: { family: 'Space Grotesk' }, bodyFont: { family: 'Inter' }, padding: 12, cornerRadius: 0, displayColors: true }
            },
            cutout: '60%',
            animation: { animateScale: true, animateRotate: true }
        }
    });
});


// --- 3. FEATURE: CASE TRACKER ---
const trackBtn = document.getElementById('trackBtn');
const caseInput = document.getElementById('caseInput');
const trackerResult = document.getElementById('trackerResult');
const statusTitle = document.getElementById('statusTitle');
const statusBar = document.getElementById('statusBar');
const statusDesc = document.getElementById('statusDesc');

const mockCases = {
    'CASE-001': { status: 'ADMITTED', percent: 25, desc: 'Application admitted by NCLT. Interim Resolution Professional appointed.' },
    'CASE-002': { status: 'COC FORMED', percent: 50, desc: 'Committee of Creditors constituted. First meeting scheduled.' },
    'CASE-003': { status: 'PLAN APPROVED', percent: 100, desc: 'Resolution Plan approved by CoC and submitted to Adjudicating Authority.' }
};

trackBtn.addEventListener('click', () => {
    const id = caseInput.value.trim().toUpperCase();
    if (mockCases[id]) {
        trackerResult.classList.remove('hidden');
        statusTitle.innerText = mockCases[id].status;
        statusDesc.innerText = mockCases[id].desc;
        setTimeout(() => {
            statusBar.style.width = mockCases[id].percent + '%';
        }, 100);
    } else {
        alert('Case ID not found. Try CASE-001, CASE-002, or CASE-003');
        trackerResult.classList.add('hidden');
        statusBar.style.width = '0%';
    }
});


// --- 4. GEMINI API HELPERS ---
async function callGeminiText(prompt, systemInstruction) {
    if(API_KEY === "YOUR_GEMINI_API_KEY_HERE") {
        return "Error: API Key missing in script.js";
    }
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${API_KEY}`;
    const payload = {
        contents: [{ parts: [{ text: prompt }] }],
        systemInstruction: { parts: [{ text: systemInstruction }] }
    };
    
    try {
        const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        const data = await res.json();
        return data.candidates?.[0]?.content?.parts?.[0]?.text || "System Error.";
    } catch(e) { console.error(e); return "Connection failed."; }
}

async function callGeminiTTS(text) {
    if(API_KEY === "YOUR_GEMINI_API_KEY_HERE") return null;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${API_KEY}`;
    const payload = {
        contents: [{ parts: [{ text: text }] }],
        generationConfig: {
            responseModalities: ["AUDIO"],
            speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: "Puck" } } }
        }
    };
    
    try {
        const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        const data = await res.json();
        const base64Audio = data.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (!base64Audio) return null;
        
        // Convert Base64 -> Audio
        const binaryString = window.atob(base64Audio);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) { bytes[i] = binaryString.charCodeAt(i); }
        return pcmToWav(bytes.buffer, 24000); 
    } catch (e) { return null; }
}

// PCM to WAV Utility
function pcmToWav(pcmData, sampleRate) {
    const numChannels = 1; const bitsPerSample = 16;
    const byteRate = sampleRate * numChannels * bitsPerSample / 8;
    const blockAlign = numChannels * bitsPerSample / 8;
    const dataSize = pcmData.byteLength;
    const buffer = new ArrayBuffer(44 + dataSize);
    const view = new DataView(buffer);
    const writeString = (view, offset, string) => { for (let i = 0; i < string.length; i++) view.setUint8(offset + i, string.charCodeAt(i)); };

    writeString(view, 0, 'RIFF'); view.setUint32(4, 36 + dataSize, true); writeString(view, 8, 'WAVE'); writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true); view.setUint16(20, 1, true); view.setUint16(22, numChannels, true); view.setUint32(24, sampleRate, true);
    view.setUint32(28, byteRate, true); view.setUint16(32, blockAlign, true); view.setUint16(34, bitsPerSample, true);
    writeString(view, 36, 'data'); view.setUint32(40, dataSize, true);
    new Uint8Array(buffer, 44).set(new Uint8Array(pcmData));
    return buffer;
}


// --- 5. CHAT & LEGAL DECODER LOGIC ---

// Voice Toggle
const voiceToggle = document.getElementById('voiceToggle');
const toggleDot = voiceToggle.querySelector('div');
voiceToggle.addEventListener('click', () => {
    isVoiceEnabled = !isVoiceEnabled;
    if (isVoiceEnabled) {
        voiceToggle.classList.replace('bg-gray-300', 'bg-neo-rust');
        toggleDot.classList.add('translate-x-5');
    } else {
        voiceToggle.classList.replace('bg-neo-rust', 'bg-gray-300');
        toggleDot.classList.remove('translate-x-5');
    }
});

// Chat Interaction
const chatInput = document.getElementById('chatInput');
const chatMessages = document.getElementById('chatMessages');

async function handleChat() {
    const text = chatInput.value.trim();
    if (!text) return;

    // Add User Message
    chatMessages.innerHTML += `<div class="flex justify-end"><div class="bg-neo-rust text-white border-2 border-black p-3 text-sm shadow-sm max-w-[85%]">${text}</div></div>`;
    chatInput.value = '';
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Loader
    const loaderId = 'loader-' + Date.now();
    chatMessages.innerHTML += `<div id="${loaderId}" class="flex justify-start"><div class="bg-white border-2 border-black p-3 text-sm shadow-sm flex gap-1"><div class="w-2 h-2 bg-gray-400 rounded-full typing-dot"></div><div class="w-2 h-2 bg-gray-400 rounded-full typing-dot"></div><div class="w-2 h-2 bg-gray-400 rounded-full typing-dot"></div></div></div>`;
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // API Call
    let systemPrompt = "You are the AI Assistant for Aarsh Resolution Professionals. Explain Indian Insolvency Code concepts clearly.";
    if (isVoiceEnabled) systemPrompt += " Keep response suitable for spoken audio (short sentences).";
    
    const responseText = await callGeminiText(text, systemPrompt);
    document.getElementById(loaderId).remove();

    // Add Bot Message
    let msgHTML = `<div class="flex justify-start"><div class="bg-white border-2 border-black p-3 text-sm shadow-sm max-w-[85%]">${responseText}</div></div>`;
    if (isVoiceEnabled) {
        const audioBuffer = await callGeminiTTS(responseText);
        if (audioBuffer) {
            const blob = new Blob([audioBuffer], { type: 'audio/wav' });
            const audio = new Audio(URL.createObjectURL(blob));
            audio.play();
            msgHTML += `<div class="flex justify-start text-xs font-bold text-gray-500 uppercase mt-1 pl-1">Playing Audio 🔊</div>`;
        }
    }
    chatMessages.innerHTML += msgHTML;
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

document.getElementById('sendChat').addEventListener('click', handleChat);
chatInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') handleChat(); });

// Chat Widget Toggle
const chatWindow = document.getElementById('chatWindow');
document.getElementById('toggleChatBtn').addEventListener('click', () => {
    chatWindow.classList.toggle('closed');
    if(!chatWindow.classList.contains('closed')) chatInput.focus();
});
document.getElementById('closeChat').addEventListener('click', () => chatWindow.classList.add('closed'));


// Legal Decoder Logic
const decodeBtn = document.getElementById('decodeBtn');
const decoderInput = document.getElementById('decoderInput');
const decoderOutput = document.getElementById('decoderOutput');
const scanLine = document.getElementById('scanLine');

decodeBtn.addEventListener('click', async () => {
    const text = decoderInput.value.trim();
    if (!text) return;
    decodeBtn.disabled = true;
    decodeBtn.innerHTML = "<span>Processing...</span>";
    scanLine.classList.remove('hidden');
    decoderOutput.innerHTML = "<p class='text-gray-400 italic'>Analyzing legal syntax...</p>";

    const result = await callGeminiText(`Explain this legal text in simple terms: "${text}"`, "You are a legal translator. Be clear and concise.");
    
    scanLine.classList.add('hidden');
    decoderOutput.innerHTML = `<p class="font-bold mb-2">Analysis Complete:</p><p>${result.replace(/\n/g, '<br>')}</p>`;
    decodeBtn.disabled = false;
    decodeBtn.innerHTML = "<span>✨ Decrypt Text</span>";
});

// Magic Draft
document.getElementById('magicDraftBtn').addEventListener('click', async () => {
    const box = document.getElementById('messageBox');
    const topic = box.value || prompt("What is the topic?");
    if(!topic) return;
    box.value = "Drafting...";
    box.value = await callGeminiText(`Draft a formal inquiry about: "${topic}"`, "Formal business tone.");
});
