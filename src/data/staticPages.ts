const staticPages = {
  about: {
    title: '關於我',
    content: `
      <div class="space-y-6">
        <div class="text-center">
          <div class="w-32 h-32 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-4xl mx-auto mb-6">
            HYJ
          </div>
          <h2 class="text-2xl font-bold text-white mb-4">Hello, I'm HYJ</h2>
        </div>
        
        <div class="glassmorphism-mini p-6 rounded-lg">
          <h3 class="text-xl font-semibold text-white mb-4">關於這個部落格</h3>
          <p class="text-white/80 leading-relaxed">
            歡迎來到我的個人部落格！這裡是我分享知識、經驗和想法的地方。
            我專注於資訊科技、產品評測、股市分析等領域，希望能夠透過文字
            與大家交流學習。
          </p>
        </div>
        
        <div class="glassmorphism-mini p-6 rounded-lg">
          <h3 class="text-xl font-semibold text-white mb-4">我的專長</h3>
          <ul class="text-white/80 space-y-2">
            <li>• 前端開發 (React, Vue, TypeScript)</li>
            <li>• 產品評測與分析</li>
            <li>• 股市投資策略</li>
            <li>• 技術寫作</li>
          </ul>
        </div>
        
        <div class="glassmorphism-mini p-6 rounded-lg">
          <h3 class="text-xl font-semibold text-white mb-4">聯絡方式</h3>
          <p class="text-white/80">
            如果您有任何問題或建議，歡迎透過以下方式聯絡我：
          </p>
          <div class="mt-4 space-y-2 text-white/80">
            <p>📧 Email: hyj@example.com</p>
            <p>🐦 Twitter: @hyj_blog</p>
            <p>💼 LinkedIn: /in/hyj</p>
          </div>
        </div>
      </div>
    `
  },
  friends: {
    title: '好友與推薦連結',
    content: `
      <div class="space-y-6">
        <div class="glassmorphism-mini p-6 rounded-lg">
          <h3 class="text-xl font-semibold text-white mb-4">好友部落格</h3>
          <div class="space-y-4">
            <div class="flex items-center justify-between p-4 bg-white/5 rounded-lg">
              <div>
                <h4 class="text-white font-medium">TechGuru's Blog</h4>
                <p class="text-white/70 text-sm">專注於最新科技趨勢分析</p>
              </div>
              <a href="#" class="text-blue-400 hover:text-blue-300 text-sm">
                訪問 →
              </a>
            </div>
            
            <div class="flex items-center justify-between p-4 bg-white/5 rounded-lg">
              <div>
                <h4 class="text-white font-medium">投資達人</h4>
                <p class="text-white/70 text-sm">分享投資心得與市場分析</p>
              </div>
              <a href="#" class="text-blue-400 hover:text-blue-300 text-sm">
                訪問 →
              </a>
            </div>
            
            <div class="flex items-center justify-between p-4 bg-white/5 rounded-lg">
              <div>
                <h4 class="text-white font-medium">產品評測室</h4>
                <p class="text-white/70 text-sm">深度產品評測與推薦</p>
              </div>
              <a href="#" class="text-blue-400 hover:text-blue-300 text-sm">
                訪問 →
              </a>
            </div>
          </div>
        </div>
        
        <div class="glassmorphism-mini p-6 rounded-lg">
          <h3 class="text-xl font-semibold text-white mb-4">推薦工具</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="p-4 bg-white/5 rounded-lg">
              <h4 class="text-white font-medium mb-2">開發工具</h4>
              <ul class="text-white/70 text-sm space-y-1">
                <li>• VS Code</li>
                <li>• Git & GitHub</li>
                <li>• Figma</li>
                <li>• Postman</li>
              </ul>
            </div>
            
            <div class="p-4 bg-white/5 rounded-lg">
              <h4 class="text-white font-medium mb-2">學習資源</h4>
              <ul class="text-white/70 text-sm space-y-1">
                <li>• MDN Web Docs</li>
                <li>• Stack Overflow</li>
                <li>• YouTube</li>
                <li>• Coursera</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div class="glassmorphism-mini p-6 rounded-lg">
          <h3 class="text-xl font-semibold text-white mb-4">交換連結</h3>
          <p class="text-white/80 mb-4">
            如果您也有優質的部落格，歡迎與我交換連結！
          </p>
          <div class="p-4 bg-white/5 rounded-lg">
            <h4 class="text-white font-medium mb-2">本站資訊</h4>
            <ul class="text-white/70 text-sm space-y-1">
              <li>• 網站名稱: HYJ's Blog</li>
              <li>• 網站描述: 分享資訊科技、產品評測、股市分析</li>
              <li>• 網站連結: https://hyj-blog.com</li>
            </ul>
          </div>
        </div>
      </div>
    `
  }
};

export const getStaticPageContent = (pageKey: string) => {
  return staticPages[pageKey as keyof typeof staticPages];
};