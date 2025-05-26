// User data
let currentUser = null;
const onlineUsers = [];
let socket = null;

// Bot responses
const botResponses = {
    "help": "I can help with: study tips, time management, resource recommendations, and motivation. Try asking about 'study techniques' or 'upcoming events'.",
    "study tips": "Here are some study tips:\n1. Use the Pomodoro technique (25min work, 5min break)\n2. Teach what you learn to someone else\n3. Create mind maps for complex topics\n4. Test yourself regularly",
    "time management": "Time management strategies:\n1. Prioritize tasks with Eisenhower Matrix\n2. Schedule deep work sessions\n3. Batch similar tasks together\n4. Set specific time limits for tasks",
    "resources": "Check our Library tab for motivational books, and Movies/Music tabs for study aids. Need something specific? Just ask!",
    "events": "Upcoming virtual events:\n- Study group meetup: Tomorrow 4PM\n- Guest lecture on AI: Friday 2PM\n- Exam prep workshop: Next Monday 6PM",
    "default": "I'm not sure I understand. Try asking about 'study tips', 'time management', or 'resources'. Type 'help' for more options."
};

// Login function
function login() {
    const username = document.getElementById('username').value.trim();
    const phone = document.getElementById('phone').value.trim();

    if (username && phone) {
        currentUser = {
            id: Date.now().toString(),
            name: username,
            phone: phone,
            online: true
        };

        // Initialize socket connection (simulated)
        initializeSocket();

        // Show the app
        document.getElementById('login-page').style.display = 'none';
        document.getElementById('app').style.display = 'block';

        // Update online users list
        updateOnlineUsers();

        // Start bot updates
        startBotUpdates();
    } else {
        alert('Please enter both your name and phone number');
    }
}

// Simulated socket connection
function initializeSocket() {
    // In a real app, this would connect to your backend
    // socket = io('http://your-backend-url');
    
    // For simulation, we'll use browser storage
    console.log("Socket connection simulated");
    
    // Listen for new messages
    window.addEventListener('storage', (event) => {
        if (event.key === 'new_message') {
            const message = JSON.parse(event.newValue);
            if (message.recipient === 'all' || message.recipient === currentUser.id) {
                addMessageToChat(message.sender, message.text, false);
            }
        }
    });
}

// Update online users list
function updateOnlineUsers() {
    const onlineUsersContainer = document.getElementById('online-users');
    onlineUsersContainer.innerHTML = '';

    // Add StudyBot
    const botElement = document.createElement('div');
    botElement.className = 'user';
    botElement.innerHTML = `
        <div class="user-avatar">B</div>
        <span>StudyBot</span>
        <div class="status-indicator"></div>
    `;
    onlineUsersContainer.appendChild(botElement);

    // Add real users from localStorage
    const users = JSON.parse(localStorage.getItem('online_users') || '[]');
    users.forEach(user => {
        if (user.id !== currentUser.id) {
            const userElement = document.createElement('div');
            userElement.className = 'user';
            userElement.innerHTML = `
                <div class="user-avatar">${user.name.charAt(0)}</div>
                <span>${user.name}</span>
                <div class="status-indicator"></div>
            `;
            userElement.onclick = () => startPrivateChat(user);
            onlineUsersContainer.appendChild(userElement);
        }
    });
}

// Start private chat with a user
function startPrivateChat(user) {
    const chatHeader = document.createElement('div');
    chatHeader.className = 'message received';
    chatHeader.innerHTML = `
        <div class="message-sender">System</div>
        <div class="message-text">Now chatting with ${user.name}</div>
    `;
    document.getElementById('messages').appendChild(chatHeader);
    currentChatPartner = user.id;
}

// Send message to server (simulated)
function sendMessageToServer(message, recipient = 'all') {
    // In a real app: socket.emit('message', {text: message, recipient});
    
    // For simulation, use localStorage to mimic message passing
    const messageObj = {
        sender: currentUser.id,
        senderName: currentUser.name,
        text: message,
        recipient: recipient,
        timestamp: Date.now()
    };
    
    // Store the message
    const messages = JSON.parse(localStorage.getItem('chat_messages') || '[]');
    messages.push(messageObj);
    localStorage.setItem('chat_messages', JSON.stringify(messages));
    
    // Trigger storage event to simulate real-time
    localStorage.setItem('new_message', JSON.stringify({
        sender: currentUser.name,
        text: message,
        recipient: recipient
    }));
    
    // Clear the storage after a short delay
    setTimeout(() => {
        localStorage.removeItem('new_message');
    }, 100);
}

// Add message to chat UI
function addMessageToChat(sender, message, isCurrentUser = false) {
    const messagesContainer = document.getElementById('messages');
    const newMessage = document.createElement('div');
    newMessage.className = isCurrentUser ? 'message sent' : 'message received';
    newMessage.innerHTML = `
        <div class="message-sender">${sender}</div>
        <div class="message-text">${message}</div>
    `;
    messagesContainer.appendChild(newMessage);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Start bot updates
function startBotUpdates() {
    // Initial welcome message is already in HTML
    
    // Periodic updates
    setInterval(() => {
        const messages = [
            "Reminder: Take a 5-minute break every 25 minutes for better focus!",
            "Tip: Drinking water improves cognitive function. Stay hydrated!",
            "Upcoming: Virtual study group tomorrow at 4PM in the General Chat.",
            "Did you know? Exercise boosts memory and learning ability."
        ];
        
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        addMessageToChat("StudyBot", randomMessage, false);
    }, 300000); // Every 5 minutes
}

// Simple tab switching
function switchTab(tabId) {
    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Deactivate all tabs
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Activate selected tab
    document.getElementById(tabId).classList.add('active');
    
    // Find and activate the corresponding tab button
    document.querySelectorAll('.tab').forEach(tab => {
        if (tab.textContent.toLowerCase() === tabId.toLowerCase() || 
            (tabId === 'books' && tab.textContent === 'Library')) {
            tab.classList.add('active');
        }
    });
}

// Simple chat functionality
function sendMessage() {
    const input = document.getElementById('message-input');
    const message = input.value.trim();
    
    if (message) {
        // Add to UI immediately
        addMessageToChat(currentUser.name, message, true);
        input.value = '';
        
        // Check for bot commands
        if (message.toLowerCase() in botResponses) {
            setTimeout(() => {
                addMessageToChat("StudyBot", botResponses[message.toLowerCase()], false);
            }, 1000);
        } else {
            // Send to other users (simulated)
            sendMessageToServer(message);
        }
    }
}

// Send message on Enter key
function handleKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

// Initialize with chat scrolled to bottom
window.onload = function() {
    const messagesContainer = document.getElementById('messages');
    if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    
    // Load any existing messages
    const messages = JSON.parse(localStorage.getItem('chat_messages') || '[]');
    messages.forEach(msg => {
        const isCurrentUser = msg.sender === currentUser?.id;
        addMessageToChat(isCurrentUser ? 'You' : msg.senderName, msg.text, isCurrentUser);
    });
    
    // Initialize online users list
    if (!localStorage.getItem('online_users')) {
        localStorage.setItem('online_users', JSON.stringify([]));
    }
};