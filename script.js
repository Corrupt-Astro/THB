// Game transformation data
const transformations = {
    generic: {
        features: [
            "Collect player cards with loot boxes!",
            "Unlock content you already paid for!",
            "Wait 24 hours or pay $4.99 to continue!",
            "Victory has never been more affordable!"
        ],
        prices: ["$59.99", "$89.99", "$119.99"]
    },
    minecraft: {
        name: "Minecraft: Block Economy",
        features: [
            "Diamonds now spawn in loot crates!",
            "Build 5 blocks per day or buy Block Pass!",
            "Creeper explosions require repair tokens!",
            "Multiplayer requires EA Play subscription!"
        ],
        prices: ["$59.99", "$99.99", "$149.99"]
    },
    tetris: {
        name: "Tetris Ultimate: Block Edition",
        features: [
            "Line pieces sold separately!",
            "Energy system limits blocks per hour!",
            "Premium colors in loot boxes!",
            "Tetris Pass unlocks rotation!"
        ],
        prices: ["$49.99", "$79.99", "$109.99"]
    },
    "dark souls": {
        name: "Dark Souls: Prepare to Pay Edition",
        features: [
            "Estus Flask refills cost $0.99!",
            "Boss fights in DLC packs!",
            "Death penalties increased by 500%!",
            "Git gud... with premium armor!"
        ],
        prices: ["$69.99", "$99.99", "$139.99"]
    },
    fortnite: {
        name: "Fortnite: Battle Pass Ultimate",
        features: [
            "Building requires material packs!",
            "Victory Royale loot crate celebrations!",
            "Dance moves in premium battle pass!",
            "Storm survival timer: pay to extend!"
        ],
        prices: ["$0.00*", "$29.99", "$59.99"]
    },
    "call of duty": {
        name: "Call of Duty: Loot Warfare",
        features: [
            "Ammo crates now require keys!",
            "Perk slots in premium pass!",
            "Killstreaks in surprise mechanics!",
            "Prestige mode: $19.99 per reset!"
        ],
        prices: ["$69.99", "$99.99", "$129.99"]
    }
};

// DOM elements
const gameInput = document.getElementById('gameInput');
const transformBtn = document.getElementById('transformBtn');
const loadingScreen = document.getElementById('loadingScreen');
const resultScreen = document.getElementById('resultScreen');
const resetBtn = document.getElementById('resetBtn');

// Event listeners
transformBtn.addEventListener('click', handleTransform);
resetBtn.addEventListener('click', resetExperience);
gameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleTransform();
});

// Transform function
async function handleTransform() {
    const gameName = gameInput.value.trim();
    if (!gameName) {
        gameInput.focus();
        gameInput.style.borderColor = '#ff4600';
        setTimeout(() => {
            gameInput.style.borderColor = 'transparent';
        }, 1000);
        return;
    }

    // Show loading screen
    loadingScreen.classList.remove('hidden');
    
    // Generate AI description
    const aiDescription = await generateEADescription(gameName);
    
    // Hide loading and show results
    loadingScreen.classList.add('hidden');
    showResults(gameName, aiDescription);
}

// Generate AI description of EA acquisition
async function generateEADescription(gameName) {
    const completion = await websim.chat.completions.create({
        messages: [
            {
                role: "system",
                content: "You are a witty gaming industry satirist. When given a game name, describe in 2-3 humorous sentences what would happen if EA acquired it. Focus on monetization, microtransactions, and corporate speak. Be creative and funny but not mean-spirited."
            },
            {
                role: "user",
                content: `Describe what would happen if EA purchased ${gameName}.`
            }
        ]
    });
    
    return completion.content;
}

// Show results
function showResults(gameName, aiDescription) {
    const lowerGame = gameName.toLowerCase();
    let gameData = transformations.generic;
    
    // Check for specific game matches
    for (const [key, value] of Object.entries(transformations)) {
        if (lowerGame.includes(key)) {
            gameData = value;
            break;
        }
    }
    
    // Update UI
    document.getElementById('originalGame').textContent = gameName;
    document.getElementById('eaGame').textContent = gameData.name || `${gameName}: Ultimate Cash Grab Edition`;
    
    // Update the description instead of features
    const descriptionElement = document.getElementById('aiDescription');
    if (descriptionElement) {
        descriptionElement.textContent = aiDescription;
    }
    
    // Update features (keep some for the cards)
    const features = document.querySelectorAll('.feature-card p');
    gameData.features.forEach((feature, index) => {
        if (features[index]) {
            features[index].textContent = feature;
        }
    });
    
    // Update prices
    const prices = document.querySelectorAll('.price');
    gameData.prices.forEach((price, index) => {
        if (prices[index]) {
            prices[index].textContent = price;
        }
    });
    
    // Show result screen
    resultScreen.classList.remove('hidden');
    
    // Add confetti
    createConfetti();
}

// Create confetti effect
function createConfetti() {
    const confettiContainer = document.querySelector('.confetti');
    confettiContainer.innerHTML = '';
    
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'absolute';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.top = '-10px';
        confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
        confetti.style.animation = `fall ${Math.random() * 3 + 2}s linear`;
        confettiContainer.appendChild(confetti);
    }
    
    // Add fall animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fall {
            to {
                transform: translateY(100vh) rotate(360deg);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// Reset experience
function resetExperience() {
    resultScreen.classList.add('hidden');
    gameInput.value = '';
    gameInput.focus();
}

// Add some easter eggs
let konamiCode = [];
const konamiSequence = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.keyCode);
    if (konamiCode.length > konamiSequence.length) {
        konamiCode.shift();
    }
    
    if (konamiCode.join(',') === konamiSequence.join(',')) {
        // Easter egg activated
        document.body.style.background = 'linear-gradient(45deg, #ff0000, #00ff00, #0000ff)';
        setTimeout(() => {
            document.body.style.background = 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)';
        }, 3000);
        
        konamiCode = [];
    }
});

// Initialize
gameInput.focus();
