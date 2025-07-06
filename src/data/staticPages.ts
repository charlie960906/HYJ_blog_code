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
            <p>📧 Email: contact@hyj-blog.com</p>
            <p>🐦 Twitter: @hyj_blog</p>
            <p>💼 LinkedIn: /in/hyj</p>
          </div>
        </div>
      </div>
    `
  },
  friends: {
    title: '友情連結',
    content: `
      <div class="space-y-6">
        <div class="glassmorphism-mini p-6 rounded-lg">
          <h3 class="text-xl font-semibold text-white mb-4">技術部落格</h3>
          <div class="space-y-4">
            <div class="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
              <div>
                <h4 class="text-white font-medium">阮一峰的網路日誌</h4>
                <p class="text-white/70 text-sm">分享前端技術與程式設計心得</p>
                <p class="text-blue-400 text-xs mt-1">ruanyifeng.com</p>
              </div>
              <a href="https://www.ruanyifeng.com/blog/" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:text-blue-300 text-sm">
                訪問 →
              </a>
            </div>
            
            <div class="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
              <div>
                <h4 class="text-white font-medium">TechBridge 技術共筆部落格</h4>
                <p class="text-white/70 text-sm">台灣技術社群的優質內容分享</p>
                <p class="text-blue-400 text-xs mt-1">blog.techbridge.cc</p>
              </div>
              <a href="https://blog.techbridge.cc/" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:text-blue-300 text-sm">
                訪問 →
              </a>
            </div>
            
            <div class="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
              <div>
                <h4 class="text-white font-medium">Huli's Blog</h4>
                <p class="text-white/70 text-sm">深入淺出的程式教學與心得分享</p>
                <p class="text-blue-400 text-xs mt-1">blog.huli.tw</p>
              </div>
              <a href="https://blog.huli.tw/" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:text-blue-300 text-sm">
                訪問 →
              </a>
            </div>
          </div>
        </div>
        
        <div class="glassmorphism-mini p-6 rounded-lg">
          <h3 class="text-xl font-semibold text-white mb-4">投資理財</h3>
          <div class="space-y-4">
            <div class="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
              <div>
                <h4 class="text-white font-medium">綠角財經筆記</h4>
                <p class="text-white/70 text-sm">專業的投資理財知識分享</p>
                <p class="text-blue-400 text-xs mt-1">greenhornfinancefootnote.blogspot.com</p>
              </div>
              <a href="https://greenhornfinancefootnote.blogspot.com/" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:text-blue-300 text-sm">
                訪問 →
              </a>
            </div>
            
            <div class="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
              <div>
                <h4 class="text-white font-medium">Mr. Market 市場先生</h4>
                <p class="text-white/70 text-sm">投資理財教學與市場分析</p>
                <p class="text-blue-400 text-xs mt-1">rich01.com</p>
              </div>
              <a href="https://rich01.com/" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:text-blue-300 text-sm">
                訪問 →
              </a>
            </div>
          </div>
        </div>
        
        <div class="glassmorphism-mini p-6 rounded-lg">
          <h3 class="text-xl font-semibold text-white mb-4">科技評測</h3>
          <div class="space-y-4">
            <div class="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
              <div>
                <h4 class="text-white font-medium">電腦王阿達</h4>
                <p class="text-white/70 text-sm">3C 產品評測與科技新聞</p>
                <p class="text-blue-400 text-xs mt-1">kocpc.com.tw</p>
              </div>
              <a href="https://www.kocpc.com.tw/" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:text-blue-300 text-sm">
                訪問 →
              </a>
            </div>
            
            <div class="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
              <div>
                <h4 class="text-white font-medium">T客邦</h4>
                <p class="text-white/70 text-sm">專業的科技媒體與產品評測</p>
                <p class="text-blue-400 text-xs mt-1">techbang.com</p>
              </div>
              <a href="https://www.techbang.com/" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:text-blue-300 text-sm">
                訪問 →
              </a>
            </div>
          </div>
        </div>
        
        <div class="glassmorphism-mini p-6 rounded-lg">
          <h3 class="text-xl font-semibold text-white mb-4">生活旅遊</h3>
          <div class="space-y-4">
            <div class="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
              <div>
                <h4 class="text-white font-medium">小氣少年的部落格</h4>
                <p class="text-white/70 text-sm">日本關西旅遊攻略專家</p>
                <p class="text-blue-400 text-xs mt-1">nicklee.tw</p>
              </div>
              <a href="https://nicklee.tw/" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:text-blue-300 text-sm">
                訪問 →
              </a>
            </div>
            
            <div class="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
              <div>
                <h4 class="text-white font-medium">背包客棧</h4>
                <p class="text-white/70 text-sm">自助旅行者的交流平台</p>
                <p class="text-blue-400 text-xs mt-1">backpackers.com.tw</p>
              </div>
              <a href="https://www.backpackers.com.tw/" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:text-blue-300 text-sm">
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
                <li>• <a href="https://code.visualstudio.com/" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:text-blue-300">VS Code</a></li>
                <li>• <a href="https://github.com/" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:text-blue-300">GitHub</a></li>
                <li>• <a href="https://www.figma.com/" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:text-blue-300">Figma</a></li>
                <li>• <a href="https://www.postman.com/" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:text-blue-300">Postman</a></li>
              </ul>
            </div>
            
            <div class="p-4 bg-white/5 rounded-lg">
              <h4 class="text-white font-medium mb-2">學習資源</h4>
              <ul class="text-white/70 text-sm space-y-1">
                <li>• <a href="https://developer.mozilla.org/" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:text-blue-300">MDN Web Docs</a></li>
                <li>• <a href="https://stackoverflow.com/" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:text-blue-300">Stack Overflow</a></li>
                <li>• <a href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:text-blue-300">YouTube</a></li>
                <li>• <a href="https://www.coursera.org/" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:text-blue-300">Coursera</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div class="glassmorphism-mini p-6 rounded-lg">
          <h3 class="text-xl font-semibold text-white mb-4">交換連結</h3>
          <p class="text-white/80 mb-4">
            如果您也有優質的部落格，歡迎與我交換連結！請確保您的網站內容優質且更新頻繁。
          </p>
          <div class="p-4 bg-white/5 rounded-lg">
            <h4 class="text-white font-medium mb-2">本站資訊</h4>
            <ul class="text-white/70 text-sm space-y-1">
              <li>• <strong>網站名稱:</strong> HYJ's Blog</li>
              <li>• <strong>網站描述:</strong> 分享資訊科技、產品評測、股市分析</li>
              <li>• <strong>網站連結:</strong> https://hyj-blog.com</li>
              <li>• <strong>聯絡方式:</strong> contact@hyj-blog.com</li>
            </ul>
          </div>
          <div class="mt-4 p-3 bg-blue-500/10 border border-blue-400/30 rounded-lg">
            <p class="text-blue-200 text-sm">
              💡 <strong>申請條件:</strong> 網站內容健康、更新頻繁、與本站主題相關
            </p>
          </div>
        </div>
      </div>
    `
  }
};

export const getStaticPageContent = (pageKey: string) => {
  return staticPages[pageKey as keyof typeof staticPages];
};