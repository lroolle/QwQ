// 观星台交互逻辑
class Observatory {
    constructor() {
        // 获取DOM元素
        this.starrySky = document.getElementById('starrySky');
        this.blackHole = document.getElementById('blackHole');
        this.gravityField = document.getElementById('gravityField');
        this.daydreamBtn = document.getElementById('daydreamBtn');
        this.returnBtn = document.getElementById('returnBtn');
        this.wishQuote = document.getElementById('wishQuote');
        
        // 工具相关元素
        this.aiStarBtn = document.getElementById('aiStarBtn');
        this.constellationBtn = document.getElementById('constellationBtn');
        this.exploreBtn = document.getElementById('exploreBtn');
        this.starLanguageInput = document.getElementById('starLanguageInput');
        this.constellationTools = document.getElementById('constellationTools');
        this.universeExplorer = document.getElementById('universeExplorer');
        this.constellationCanvas = document.getElementById('constellationCanvas');
        
        // 状态变量
        this.isDaydreaming = false;
        this.isWishing = false;
        this.isDrawingConstellation = false;
        this.mouseTrailTimeout = null;
        this.wishTimeout = null;
        
        // 音效系统
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.sounds = {
            starTing: null,
            wind: null,
            wish: null
        };
        
        // 星空状态
        this.skyColors = [
            'linear-gradient(135deg, #0B0B2A 0%, #1B1B4B 50%, #2D1B4B 100%)',
            'linear-gradient(135deg, #1A1A3A 0%, #2D1B4B 50%, #3D2B5B 100%)',
            'linear-gradient(135deg, #2D1B4B 0%, #3D2B5B 50%, #4D3B6B 100%)'
        ];
        this.currentSkyColorIndex = 0;
        this.skyColorInterval = null;

        // 星座绘制相关
        this.constellationCtx = this.constellationCanvas.getContext('2d');
        this.isDrawing = false;
        this.lastPoint = null;
        this.constellationPoints = [];

        // 星星创建相关
        this.starCreationActive = false;
        this.customizingStarData = null;
        this.createStarBtn = document.getElementById('createStarBtn');
        this.starMessage = document.getElementById('starMessage');
        this.starCustomizePanel = document.getElementById('starCustomizePanel');

        this.init();
    }

    async init() {
        // 初始化音效
        await this.initSounds();
        
        // 调整画布大小
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        
        // 绑定基础事件监听器
        this.daydreamBtn.addEventListener('click', () => this.toggleDaydreamMode());
        this.returnBtn.addEventListener('click', () => this.toggleDaydreamMode());
        document.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        document.addEventListener('mousedown', () => this.startWishing());
        document.addEventListener('mouseup', () => this.stopWishing());
        document.addEventListener('click', (e) => this.handleStarClick(e));
        
        // 绑定工具按钮事件
        this.aiStarBtn.addEventListener('click', () => this.toggleAiStarInput());
        this.constellationBtn.addEventListener('click', () => this.toggleConstellationTools());
        this.exploreBtn.addEventListener('click', () => this.toggleUniverseExplorer());
        
        // 绑定星座绘制事件
        this.constellationCanvas.addEventListener('mousedown', (e) => this.startDrawing(e));
        this.constellationCanvas.addEventListener('mousemove', (e) => this.draw(e));
        this.constellationCanvas.addEventListener('mouseup', () => this.stopDrawing());
        
        // 创建初始星星
        this.createStars(100);
        
        // 初始化黑洞引力效果
        this.initGravityEffect();

        // 绑定创建星星事件
        if (this.createStarBtn) {
            this.createStarBtn.addEventListener('click', () => this.initiateStarCreation());
        }
    }

    resizeCanvas() {
        this.constellationCanvas.width = window.innerWidth;
        this.constellationCanvas.height = window.innerHeight;
    }

    toggleAiStarInput() {
        this.starLanguageInput.classList.toggle('hidden');
        if (!this.starLanguageInput.classList.contains('hidden')) {
            this.starLanguageInput.querySelector('textarea').focus();
        }
    }

    toggleConstellationTools() {
        this.constellationTools.classList.toggle('hidden');
        this.constellationCanvas.classList.toggle('hidden');
        if (!this.constellationCanvas.classList.contains('hidden')) {
            this.constellationCanvas.classList.add('active');
        } else {
            this.constellationCanvas.classList.remove('active');
        }
    }

    toggleUniverseExplorer() {
        this.universeExplorer.classList.toggle('hidden');
        if (!this.universeExplorer.classList.contains('hidden')) {
            this.universeExplorer.classList.add('visible');
            this.loadSpaceKnowledge();
        } else {
            this.universeExplorer.classList.remove('visible');
        }
    }

    startDrawing(e) {
        this.isDrawing = true;
        const rect = this.constellationCanvas.getBoundingClientRect();
        this.lastPoint = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
        this.constellationPoints.push(this.lastPoint);
    }

    draw(e) {
        if (!this.isDrawing) return;
        
        const rect = this.constellationCanvas.getBoundingClientRect();
        const currentPoint = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };

        this.constellationCtx.beginPath();
        this.constellationCtx.moveTo(this.lastPoint.x, this.lastPoint.y);
        this.constellationCtx.lineTo(currentPoint.x, currentPoint.y);
        this.constellationCtx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        this.constellationCtx.lineWidth = 2;
        this.constellationCtx.stroke();

        this.lastPoint = currentPoint;
        this.constellationPoints.push(currentPoint);
    }

    stopDrawing() {
        this.isDrawing = false;
        if (this.constellationPoints.length > 1) {
            document.querySelector('.save-constellation-btn').disabled = false;
            document.querySelector('.clear-drawing-btn').disabled = false;
        }
    }

    initGravityEffect() {
        this.blackHole.addEventListener('mouseover', () => {
            this.gravityField.classList.add('active');
            this.applyGravityEffect();
        });

        this.blackHole.addEventListener('mouseout', () => {
            this.gravityField.classList.remove('active');
            this.removeGravityEffect();
        });
    }

    applyGravityEffect() {
        const stars = this.starrySky.querySelectorAll('.star');
        stars.forEach(star => {
            const rect = star.getBoundingClientRect();
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            const distance = Math.sqrt(
                Math.pow(rect.left - centerX, 2) + 
                Math.pow(rect.top - centerY, 2)
            );
            
            if (distance < 200) {
                const scale = 1 + (200 - distance) / 200;
                const angle = Math.atan2(rect.top - centerY, rect.left - centerX);
                star.style.transform = `scale(${scale}) rotate(${angle}rad)`;
                star.style.transition = 'transform 0.5s ease';
            }
        });
    }

    removeGravityEffect() {
        const stars = this.starrySky.querySelectorAll('.star');
        stars.forEach(star => {
            star.style.transform = '';
        });
    }

    loadSpaceKnowledge() {
        const knowledge = [
            "在宇宙的某个角落，可能存在着另一个你。",
            "黑洞的引力如此之大，连光都无法逃脱。",
            "我们看到的星光，可能来自几百万年前。",
            "宇宙仍在不断膨胀，像一个永不停息的呼吸。"
        ];
        
        const spaceKnowledge = this.universeExplorer.querySelector('.space-knowledge');
        spaceKnowledge.innerHTML = `<p>${knowledge[Math.floor(Math.random() * knowledge.length)]}</p>`;
    }

    async initSounds() {
        // 加载音效
        const loadSound = async (url) => {
            const response = await fetch(url);
            const arrayBuffer = await response.arrayBuffer();
            return await this.audioContext.decodeAudioData(arrayBuffer);
        };

        try {
            this.sounds.starTing = await loadSound('../public/audio/star-ting.mp3');
            this.sounds.wind = await loadSound('../public/audio/space-wind.mp3');
            this.sounds.wish = await loadSound('../public/audio/wish-sound.mp3');
        } catch (error) {
            console.warn('Some audio files failed to load:', error);
        }
    }

    playSound(soundName, options = {}) {
        if (!this.sounds[soundName]) return;

        const source = this.audioContext.createBufferSource();
        source.buffer = this.sounds[soundName];
        
        // 创建音量控制
        const gainNode = this.audioContext.createGain();
        gainNode.gain.value = options.volume || 0.5;

        // 连接节点
        source.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        // 播放音效
        source.start(0);
    }

    createStars(count) {
        for (let i = 0; i < count; i++) {
            this.createStar();
        }
    }

    createStar(options = {}) {
        const star = document.createElement('div');
        star.className = 'star';
        this.setRandomStarStyles(star, options);
        
        // 如果有心愿文本，添加点击事件
        if (options.text) {
            star.dataset.message = options.text;
            star.addEventListener('click', (e) => {
                e.stopPropagation();
                this.showStarWish(star);
            });
        }

        this.starrySky.appendChild(star);

        // 添加掉落动画
        if (options.falling) {
            const duration = Math.random() * 3000 + 2000;
            const delay = Math.random() * 1000;
            
            star.style.animation = `starFall ${duration}ms ease-in ${delay}ms forwards`;
            
            // 播放星星音效
            setTimeout(() => {
                this.playSound('starTing', { volume: 0.1 });
            }, delay);

            // 动画结束后移除星星
            setTimeout(() => {
                star.remove();
            }, duration + delay);
        }
    }

    setRandomStarStyles(star, options = {}) {
        const size = options.size || Math.random() * 3 + 1;
        const brightness = options.brightness || Math.random() * 0.7 + 0.3;
        
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.left = options.x || `${Math.random() * 100}%`;
        star.style.top = options.y || `${Math.random() * 100}%`;
        star.style.opacity = brightness;
        
        // 添加发光效果
        star.style.boxShadow = `0 0 ${size * 2}px rgba(255, 255, 255, ${brightness})`;
        
        // 添加拖尾效果
        if (options.trail) {
            star.style.filter = 'blur(1px)';
            star.style.transform = 'scale(1.2)';
        }
    }

    handleStarClick(e) {
        if (!this.isDaydreaming) return;

        // 在点击位置创建一组小星星
        for (let i = 0; i < 5; i++) {
            this.createStar({
                x: `${e.clientX}px`,
                y: `${e.clientY}px`,
                size: Math.random() * 2 + 0.5,
                brightness: Math.random() * 0.5 + 0.5,
                falling: true
            });
        }
    }

    startSkyColorChange() {
        this.skyColorInterval = setInterval(() => {
            this.currentSkyColorIndex = (this.currentSkyColorIndex + 1) % this.skyColors.length;
            document.querySelector('.observatory-scene').style.background = this.skyColors[this.currentSkyColorIndex];
        }, 300000); // 每5分钟变换一次
    }

    stopSkyColorChange() {
        if (this.skyColorInterval) {
            clearInterval(this.skyColorInterval);
        }
    }

    handleMouseMove(e) {
        if (!this.isDaydreaming) return;

        const rect = this.starrySky.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // 创建星尘轨迹
        this.createStarTrail(x, y);

        // 偶尔触发流星
        if (Math.random() < 0.05) {
            this.createShootingStar(x, y);
        }
    }

    createStarTrail(x, y) {
        const trail = document.createElement('div');
        trail.className = 'star-trail';
        trail.style.left = `${x}px`;
        trail.style.top = `${y}px`;
        trail.style.width = '2px';
        trail.style.height = '2px';
        trail.style.background = '#fff';
        trail.style.borderRadius = '50%';
        trail.style.position = 'absolute';
        this.starrySky.appendChild(trail);

        setTimeout(() => trail.remove(), 1000);
    }

    createShootingStar(x, y) {
        const star = document.createElement('div');
        star.className = 'shooting-star';
        star.style.left = `${x}px`;
        star.style.top = `${y}px`;
        this.starrySky.appendChild(star);

        setTimeout(() => star.remove(), 1000);
    }

    toggleDaydreamMode() {
        this.isDaydreaming = !this.isDaydreaming;
        document.body.classList.toggle('daydream-mode');
        this.blackHole.classList.toggle('active');
        this.daydreamBtn.classList.toggle('hidden');
        this.returnBtn.classList.toggle('visible');

        if (this.isDaydreaming) {
            this.startSkyColorChange();
            this.playSound('wind', { volume: 0.2 });
            this.startStarAnimation();
        } else {
            this.stopSkyColorChange();
            this.stopStarAnimation();
        }
    }

    startWishing() {
        if (!this.isDaydreaming) return;

        this.wishTimeout = setTimeout(() => {
            this.showWishQuote();
        }, 3000);
    }

    stopWishing() {
        if (this.wishTimeout) {
            clearTimeout(this.wishTimeout);
        }
    }

    showWishQuote() {
        if (!this.isDaydreaming || this.isWishing) return;

        this.isWishing = true;
        const quotes = [
            "愿你心中的银河，永远有星星闪烁。",
            "宇宙虽无垠，但我们都在彼此的引力里。",
            "在这浩瀚星海中，你就是最亮的那颗星。",
            "愿你的梦想，像星光一样永不熄灭。",
            "无论身在何方，我们都在同一片星空下。"
        ];

        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        this.wishQuote.querySelector('.quote-text').textContent = randomQuote;
        this.wishQuote.classList.remove('hidden');
        this.wishSound.play();

        setTimeout(() => {
            this.wishQuote.classList.add('hidden');
            this.isWishing = false;
        }, 3000);
    }

    startStarAnimation() {
        // 添加星星动画逻辑
        this.starrySky.querySelectorAll('.star').forEach(star => {
            this.setRandomStarStyles(star);
            star.style.animation = 'starFloat 3s ease-in-out infinite';
        });
    }

    stopStarAnimation() {
        this.starrySky.querySelectorAll('.star').forEach(star => {
            star.style.animation = 'none';
        });
    }

    async initiateStarCreation() {
        if (this.starCreationActive) return;
        
        const message = this.starMessage.value.trim();
        if (!message) {
            alert('请先写下你想对星星说的话~');
            return;
        }

        this.starCreationActive = true;
        this.createStarBtn.classList.add('creating');
        
        try {
            // 播放创建音效
            this.playSound('starTing', { volume: 0.2 });

            // 关闭输入框
            this.starLanguageInput.classList.add('hidden');
            // 清空输入内容
            this.starMessage.value = '';

            // 创建能量场
            const energyField = document.createElement('div');
            energyField.className = 'star-energy-field';
            energyField.style.left = '50%';
            energyField.style.top = '50%';
            this.starrySky.appendChild(energyField);

            // 星尘聚集动画
            await new Promise(resolve => setTimeout(resolve, 1000));
            energyField.classList.add('gathering');
            this.playSound('wind', { volume: 0.3 });

            // 星星诞生
            await new Promise(resolve => setTimeout(resolve, 2000));
            energyField.classList.add('birth');
            this.playSound('wish', { volume: 0.5 });

            // 创建新星星
            const starPosition = {
                x: window.innerWidth / 2,
                y: window.innerHeight / 2
            };
            const newStar = this.createCustomizableStar(starPosition);
            newStar.dataset.message = message;

            // 显示自定义面板
            await new Promise(resolve => setTimeout(resolve, 500));
            energyField.remove();
            this.showStarCustomizePanel(newStar);

        } catch (error) {
            console.error('创建星星时出错:', error);
            this.starCreationActive = false;
            this.createStarBtn.classList.remove('creating');
            // 发生错误时也关闭输入框
            this.starLanguageInput.classList.add('hidden');
            this.starMessage.value = '';
        }
    }

    createCustomizableStar(position) {
        const star = document.createElement('div');
        star.className = 'star customizable';
        star.style.left = `${position.x}px`;
        star.style.top = `${position.y}px`;
        star.style.width = '20px';
        star.style.height = '20px';
        star.style.background = '#ffffff';
        star.style.boxShadow = '0 0 20px #ffffff';
        star.style.transform = 'scale(1.5)';
        star.style.animation = 'starPulse 2s ease-in-out infinite';
        
        // 添加点击事件显示心愿
        star.addEventListener('click', (e) => {
            e.stopPropagation();
            this.showStarWish(star);
        });
        
        this.starrySky.appendChild(star);
        return star;
    }

    showStarCustomizePanel(star) {
        this.customizingStarData = {
            star: star,
            text: star.dataset.message,
            color: '#ffffff',
            brightness: 1,
            motion: 'float'
        };

        // 显示自定义面板
        this.starCustomizePanel.classList.remove('hidden');
        
        // 更新面板位置
        const rect = star.getBoundingClientRect();
        this.starCustomizePanel.style.left = `${rect.right + 20}px`;
        this.starCustomizePanel.style.top = `${rect.top}px`;

        // 初始化面板值
        const textInput = this.starCustomizePanel.querySelector('.star-text');
        const colorPicker = this.starCustomizePanel.querySelector('.star-color');
        const brightnessSlider = this.starCustomizePanel.querySelector('.star-brightness');
        const motionSelect = this.starCustomizePanel.querySelector('.star-motion');

        textInput.value = star.dataset.message;
        colorPicker.value = '#ffffff';
        brightnessSlider.value = 1;
        motionSelect.value = 'float';

        // 绑定自定义事件
        this.bindCustomizationEvents();
    }

    bindCustomizationEvents() {
        const textInput = this.starCustomizePanel.querySelector('.star-text');
        const colorPicker = this.starCustomizePanel.querySelector('.star-color');
        const brightnessSlider = this.starCustomizePanel.querySelector('.star-brightness');
        const motionSelect = this.starCustomizePanel.querySelector('.star-motion');
        const confirmBtn = this.starCustomizePanel.querySelector('.confirm-star');

        // 文字输入事件
        textInput.addEventListener('input', (e) => {
            this.customizingStarData.text = e.target.value;
            this.updateStarAppearance();
        });

        // 颜色选择事件
        colorPicker.addEventListener('change', (e) => {
            this.customizingStarData.color = e.target.value;
            this.updateStarAppearance();
        });

        // 亮度调节事件
        brightnessSlider.addEventListener('input', (e) => {
            this.customizingStarData.brightness = e.target.value;
            this.updateStarAppearance();
        });

        // 运动方式选择事件
        motionSelect.addEventListener('change', (e) => {
            this.customizingStarData.motion = e.target.value;
            this.updateStarAppearance();
        });

        // 确认创建事件
        confirmBtn.addEventListener('click', () => this.releaseStarToUniverse());
    }

    updateStarAppearance() {
        if (!this.customizingStarData || !this.customizingStarData.star) return;

        const { star, color, brightness, motion } = this.customizingStarData;
        
        // 更新星星样式
        star.style.background = color;
        star.style.boxShadow = `0 0 20px ${color}`;
        star.style.opacity = brightness;
        
        // 更新运动动画
        star.style.animation = '';
        requestAnimationFrame(() => {
            switch (motion) {
                case 'float':
                    star.style.animation = 'starFloat 5s ease-in-out infinite';
                    break;
                case 'spiral':
                    star.style.animation = 'starSpiral 8s linear infinite';
                    break;
                case 'static':
                    star.style.animation = 'starPulse 2s ease-in-out infinite';
                    break;
                case 'pulse':
                    star.style.animation = 'starPulse 1.5s ease-in-out infinite';
                    break;
                case 'orbit':
                    star.style.animation = 'starOrbit 10s linear infinite';
                    break;
            }
        });

        // 添加悬停效果
        star.onmouseover = () => {
            star.style.transform = 'scale(1.5)';
            star.style.boxShadow = `0 0 30px ${color}`;
        };
        
        star.onmouseout = () => {
            star.style.transform = 'scale(1)';
            star.style.boxShadow = `0 0 20px ${color}`;
        };
    }

    releaseStarToUniverse() {
        const { star, text, color, brightness, motion } = this.customizingStarData;
        
        // 添加释放动画
        star.classList.add('releasing');
        this.playSound('wish', { volume: 0.3 });

        // 保存星星数据
        const starData = {
            text,
            color,
            brightness,
            motion,
            position: {
                x: star.offsetLeft,
                y: star.offsetTop
            },
            createdAt: new Date().toISOString()
        };
        this.saveStarToLocalStorage(starData);

        // 隐藏自定义面板
        this.starCustomizePanel.classList.add('hidden');
        this.starCreationActive = false;
        this.createStarBtn.classList.remove('creating');

        // 星星上升动画
        setTimeout(() => {
            star.classList.add('ascended');
            setTimeout(() => {
                star.remove();
                this.createStar({
                    x: `${Math.random() * 100}%`,
                    y: `${Math.random() * 100}%`,
                    color: color,
                    brightness: brightness,
                    size: 3,
                    motion: motion
                });
            }, 1000);
        }, 2000);
    }

    saveStarToLocalStorage(starData) {
        const stars = JSON.parse(localStorage.getItem('universe-stars') || '[]');
        stars.push({
            ...starData,
            id: Date.now(),
            createdAt: new Date().toISOString()
        });
        localStorage.setItem('universe-stars', JSON.stringify(stars));
    }

    showStarWish(star) {
        const wishText = star.dataset.message;
        if (!wishText) return;

        // 创建心愿显示框
        const wishBox = document.createElement('div');
        wishBox.className = 'star-wish-box';
        wishBox.innerHTML = `
            <div class="wish-content">
                <p>${wishText}</p>
            </div>
        `;

        // 设置位置
        const rect = star.getBoundingClientRect();
        wishBox.style.left = `${rect.left}px`;
        wishBox.style.top = `${rect.top - 100}px`;

        // 添加到页面
        document.body.appendChild(wishBox);

        // 播放音效
        this.playSound('starTing', { volume: 0.2 });

        // 3秒后移除
        setTimeout(() => {
            wishBox.classList.add('fade-out');
            setTimeout(() => wishBox.remove(), 500);
        }, 3000);
    }
}

// 添加新的动画关键帧
const style = document.createElement('style');
style.textContent = `
@keyframes starFall {
    0% {
        transform: translateY(0) scale(1);
        opacity: 1;
    }
    100% {
        transform: translateY(100vh) scale(0.1);
        opacity: 0;
    }
}

@keyframes starPulse {
    0%, 100% {
        transform: scale(1);
        opacity: 0.8;
    }
    50% {
        transform: scale(1.2);
        opacity: 1;
    }
}

@keyframes starFloat {
    0%, 100% {
        transform: translate(0, 0);
    }
    25% {
        transform: translate(20px, -20px);
    }
    50% {
        transform: translate(0, -40px);
    }
    75% {
        transform: translate(-20px, -20px);
    }
}

@keyframes starSpiral {
    0% {
        transform: rotate(0deg) translateX(50px) rotate(0deg);
    }
    100% {
        transform: rotate(360deg) translateX(50px) rotate(-360deg);
    }
}

@keyframes starOrbit {
    0% {
        transform: rotate(0deg) translateX(100px) rotate(0deg);
    }
    100% {
        transform: rotate(360deg) translateX(100px) rotate(-360deg);
    }
}
`;
document.head.appendChild(style);

// 添加新的样式
const wishBoxStyle = document.createElement('style');
wishBoxStyle.textContent = `
.star-wish-box {
    position: fixed;
    background: rgba(0, 0, 0, 0.8);
    border-radius: 12px;
    padding: 15px 20px;
    color: #fff;
    font-size: 14px;
    max-width: 200px;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 0 20px rgba(138, 43, 226, 0.2);
    z-index: 1000;
    animation: wishBoxAppear 0.3s ease-out;
    transform-origin: bottom center;
}

.star-wish-box .wish-content {
    text-align: center;
    line-height: 1.5;
}

.star-wish-box.fade-out {
    animation: wishBoxFadeOut 0.5s ease-out forwards;
}

@keyframes wishBoxAppear {
    0% {
        transform: translateY(20px) scale(0.8);
        opacity: 0;
    }
    100% {
        transform: translateY(0) scale(1);
        opacity: 1;
    }
}

@keyframes wishBoxFadeOut {
    0% {
        transform: translateY(0) scale(1);
        opacity: 1;
    }
    100% {
        transform: translateY(-20px) scale(0.8);
        opacity: 0;
    }
}
`;
document.head.appendChild(wishBoxStyle);

// 初始化观星台
document.addEventListener('DOMContentLoaded', () => {
    const observatory = new Observatory();
}); 