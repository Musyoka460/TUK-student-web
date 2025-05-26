// User data
let currentUser = null;
const onlineUsers = [];

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
            id: Date.now(),
            name: username,
            phone: phone,
            online: true
        };

        // Add user to online users
        onlineUsers.push(currentUser);

        // Show the app
        document.getElementById('login-page').style.display = 'none';
        document.getElementById('app').style.display = 'block';

        // Update online users list
        updateOnlineUsers();

        // Simulate other users coming online/offline
        simulateUserActivity();

        // Start bot updates
        startBotUpdates();
    } else {
        alert('Please enter both your name and phone number');
    }
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

    // Add real users
    onlineUsers.forEach(user => {
        if (user.online) {
            const userElement = document.createElement('div');
            userElement.className = 'user';
            userElement.innerHTML = `
                <div class="user-avatar">${user.name.charAt(0)}</div>
                <span>${user.name}</span>
                <div class="status-indicator"></div>
            `;
            onlineUsersContainer.appendChild(userElement);
        }
    });
}

// Simulate user activity
function simulateUserActivity() {
    setInterval(() => {
        updateOnlineUsers();
    }, 5000);
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
        addBotMessage(randomMessage);
    }, 300000); // Every 5 minutes
}

// Add bot message to chat
function addBotMessage(message) {
    const messagesContainer = document.getElementById('messages');
    const newMessage = document.createElement('div');
    newMessage.className = 'message received';
    newMessage.innerHTML = `
        <div class="message-sender">StudyBot</div>
        <div class="message-text">${message}</div>
    `;
    messagesContainer.appendChild(newMessage);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
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
        const messagesContainer = document.getElementById('messages');
        const newMessage = document.createElement('div');
        newMessage.className = 'message sent';
        newMessage.innerHTML = `
            <div class="message-sender">${currentUser.name}</div>
            <div class="message-text">${message}</div>
        `;
        messagesContainer.appendChild(newMessage);
        input.value = '';
        
        // Scroll to bottom
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        // Check for bot commands
        if (message.toLowerCase() in botResponses) {
            setTimeout(() => {
                addBotMessage(botResponses[message.toLowerCase()]);
            }, 1000);
        } else {
            // Add default bot response if not a command
            setTimeout(() => {
                addBotMessage(botResponses['default']);
            }, 1000);
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
};