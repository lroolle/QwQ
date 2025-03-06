document.addEventListener('DOMContentLoaded', () => {
    // 创建星星背景
    createStars();
    
    // 添加菜单项悬停音效
    addMenuHoverEffects();
    
    // 添加标题点击效果
    addTitleClickEffect();
});

// 创建随机星星背景
function createStars() {
    const universe = document.querySelector('.universe-container');
    const starsCount = 100;
    
    for (let i = 0; i < starsCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.cssText = `
            position: absolute;
            width: ${Math.random() * 3}px;
            height: ${Math.random() * 3}px;
            background: #fff;
            border-radius: 50%;
            top: ${Math.random() * 100}%;
            left: ${Math.random() * 100}%;
            animation: twinkle ${2 + Math.random() * 3}s ease-in-out infinite;
            opacity: ${0.3 + Math.random() * 0.7};
        `;
        universe.appendChild(star);
    }
}

// 添加菜单悬停音效
function addMenuHoverEffects() {
    const menuItems = document.querySelectorAll('.menu-item');
    
    menuItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            playHoverSound();
            addSparkle(item);
        });
    });
}

// 播放悬停音效
function playHoverSound() {
    const audio = new Audio('data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA/+M4wAAAAAAAAAAAAEluZm8AAAAPAAAAAwAAABQAFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQU//////////////////////////////////////////////////////////////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAAAAAAAAAAAABQIkOdpAAAAAAAAAAAAAAAAAAAA//MUZAAAAAGkAAAAAAAAA0gAAAAATEFN//MUZAMAAAGkAAAAAAAAA0gAAAAARTMu//MUZAYAAAGkAAAAAAAAA0gAAAAAOTku//MUZAkAAAGkAAAAAAAAA0gAAAAANVVV');
    audio.volume = 0.2;
    audio.play();
}

// 添加闪烁效果
function addSparkle(element) {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';
    sparkle.style.cssText = `
        position: absolute;
        width: 20px;
        height: 20px;
        background: radial-gradient(circle, #fff 0%, transparent 70%);
        pointer-events: none;
        animation: sparkle-fade 0.5s ease-out forwards;
    `;
    
    element.appendChild(sparkle);
    setTimeout(() => sparkle.remove(), 500);
}

// 添加标题点击效果
function addTitleClickEffect() {
    const title = document.querySelector('.title');
    
    title.addEventListener('click', () => {
        title.style.animation = 'none';
        title.offsetHeight; // 触发重排
        title.style.animation = 'title-glow 2s ease-in-out infinite alternate';
        
        const ripple = document.createElement('div');
        ripple.className = 'ripple';
        ripple.style.cssText = `
            position: absolute;
            border: 2px solid #fff;
            border-radius: 50%;
            pointer-events: none;
            animation: ripple 1s ease-out forwards;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        `;
        
        title.appendChild(ripple);
        setTimeout(() => ripple.remove(), 1000);
    });
}

// 添加必要的动画关键帧
const style = document.createElement('style');
style.textContent = `
    @keyframes twinkle {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.3; }
    }
    
    @keyframes sparkle-fade {
        0% { transform: scale(0); opacity: 1; }
        100% { transform: scale(2); opacity: 0; }
    }
    
    @keyframes ripple {
        0% { width: 0; height: 0; opacity: 1; }
        100% { width: 200px; height: 200px; opacity: 0; }
    }
`;
document.head.appendChild(style); 