// 设置默认语言
document.documentElement.lang = localStorage.getItem('language') || 'zh';

// 语言切换功能和其他交互
document.addEventListener('DOMContentLoaded', () => {
    // 语言切换
    const languageToggle = document.getElementById('languageToggle');
    
    // 初始化语言设置
    updateLanguageDisplay();
    
    // 点击切换语言
    languageToggle.addEventListener('click', () => {
        const currentLang = document.documentElement.lang;
        const newLang = currentLang === 'zh' ? 'en' : 'zh';
        document.documentElement.lang = newLang;
        localStorage.setItem('language', newLang);
        
        // 更新显示
        updateLanguageDisplay();
    });

    // 更新分类球交互
    const sphereToggle = document.querySelector('.sphere-toggle');
    const sphereMenu = document.querySelector('.sphere-menu');
    const categoryItems = document.querySelectorAll('.category-item');
    const demoCards = document.querySelectorAll('.demo-card');

    // 切换分类菜单显示
    sphereToggle.addEventListener('click', () => {
        sphereMenu.classList.toggle('active');
    });

    // 添加分类点击效果
    categoryItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const category = item.getAttribute('data-category');
            filterDemos(category);
        });
    });

    // 点击外部关闭菜单
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.category-sphere')) {
            sphereMenu.classList.remove('active');
        }
    });
});

// 辅助函数
function updateLanguageDisplay() {
    console.log('Language changed to: ' + document.documentElement.lang);
}

// 更新过滤演示卡片逻辑
function filterDemos(category) {
    const demoCards = document.querySelectorAll('.demo-card');
    demoCards.forEach(card => {
        const categories = card.getAttribute('data-categories').split(',');
        if (categories.includes(category)) {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
            card.style.transition = 'all 0.3s';
        } else {
            card.style.opacity = '0.3';
            card.style.transform = 'scale(0.95)';
            card.style.transition = 'all 0.3s';
        }
    });
} 