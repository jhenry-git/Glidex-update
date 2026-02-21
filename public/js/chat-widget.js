// --- Chat Widget Scripts ---
const chatToggle = document.getElementById('chat-toggle');
const chatWidget = document.getElementById('chat-widget');
const chatClose = document.getElementById('chat-close');
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
const chatMessages = document.getElementById('chat-messages');
const handoffButton = document.getElementById('handoff-button');

const HANDOFF_TRIGGER_PHRASE = "I'm sorry, I don't have that information";
const WHATSAPP_NUMBER = '254768266255';

const GENKIT_AGENT_URL = 'https://glidex-ai.vercel.app/api/agent';

let chatHistory = [];

chatToggle.addEventListener('click', () => { chatWidget.classList.toggle('hidden'); });
chatClose.addEventListener('click', () => { chatWidget.classList.add('hidden'); });

function getChatHistoryContext(numMessages = 3) {
    let context = "--- Last few messages with AI ---\n";
    const userMessages = chatHistory.filter(m => m.sender === 'user');
    const relevantMessages = userMessages.slice(-numMessages);

    relevantMessages.forEach(m => {
        context += `User: ${m.text}\n`;
    });

    return encodeURIComponent(context.trim());
}

function handleHandoff() {
    const context = getChatHistoryContext(3);
    const defaultMessage = encodeURIComponent("Hello, I need human support with a complex question about GlideX. My conversation with the AI is below:\n\n");

    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${defaultMessage}${context}`;

    window.open(whatsappUrl, '_blank');

    addMessage("I've prepared a message for you. Please click the button to open WhatsApp and connect with our human support team.", 'ai');
    handoffButton.classList.remove('visible');
    chatInput.disabled = true;
}
window.handleHandoff = handleHandoff;

chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const userQuery = chatInput.value.trim();
    if (!userQuery) return;

    addMessage(userQuery, 'user');
    chatHistory.push({ sender: 'user', text: userQuery });

    chatInput.value = '';
    showLoadingIndicator();
    handoffButton.classList.remove('visible');

    try {
        const requestBody = { query: userQuery };

        const response = await fetch(GENKIT_AGENT_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }

        const result = await response.json();
        removeLoadingIndicator();

        const aiResponseText = result.output?.result || 'An unexpected response format was received.';

        addMessage(aiResponseText, 'ai');
        chatHistory.push({ sender: 'ai', text: aiResponseText });

        if (aiResponseText.includes(HANDOFF_TRIGGER_PHRASE)) {
            handoffButton.classList.add('visible');
        }

    } catch (error) {
        console.error('Error fetching AI response:', error);
        removeLoadingIndicator();
        addMessage('Sorry, I seem to be having trouble connecting. Please try again later.', 'ai');
        handoffButton.classList.add('visible');
    }
});

function addMessage(text, sender) {
    const wrapper = document.createElement('div');
    wrapper.className = `flex mb-4 ${sender === 'user' ? 'justify-end' : ''}`;
    const bubble = document.createElement('div');
    bubble.className = `rounded-lg p-3 max-w-xs ${sender === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`;

    bubble.innerHTML = `<p>${text.replace(/\n/g, '<br>')}</p>`;

    wrapper.appendChild(bubble);
    chatMessages.appendChild(wrapper);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function showLoadingIndicator() {
    const wrapper = document.createElement('div');
    wrapper.id = 'loading-indicator';
    wrapper.className = 'flex mb-4';
    const bubble = document.createElement('div');
    bubble.className = 'bg-gray-200 text-gray-500 rounded-lg p-3 max-w-xs flex items-center';
    bubble.innerHTML = `<span class="animate-ping h-2 w-2 bg-gray-500 rounded-full mr-2"></span><span class="animate-ping h-2 w-2 bg-gray-500 rounded-full mr-2" style="animation-delay: 0.1s;"></span><span class="animate-ping h-2 w-2 bg-gray-500 rounded-full" style="animation-delay: 0.2s;"></span>`;
    wrapper.appendChild(bubble);
    chatMessages.appendChild(wrapper);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function removeLoadingIndicator() {
    const indicator = document.getElementById('loading-indicator');
    if (indicator) indicator.remove();
}
