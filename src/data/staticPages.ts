const staticPages = {
  about: {
    title: '關於我',
    content: `
        <div class="space-y-6">
          <div class="text-center">
            <img src="/images/my.jpg" alt="HYJ's Image" loading="lazy" class="w-24 h-24 sm:w-32 sm:h-32 rounded-full mx-auto mb-4 sm:mb-6 object-cover about-image">
            <h2 class="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">嗨嗨嗨！ 我是老黃</h2>
          </div>
        </div>
        
        <div class="glassmorphism-mini p-4 sm:p-6 rounded-lg">
          <h3 class="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">關於這個BLOG</h3>
          <p class="text-sm sm:text-base text-white/80 leading-relaxed mb-2">嗨嗨嗨！！！歡迎你發現我的BLOG！</p>
          <p class="text-sm sm:text-base text-white/80 leading-relaxed mb-2">這個BLOG主要寫題解、演算法、財經時事和各種評測～</p>
          <p class="text-sm sm:text-base text-white/80 leading-relaxed">謝謝你看到這邊～～</p>
        </div>
        
        <div class="glassmorphism-mini p-4 sm:p-6 rounded-lg">
          <h3 class="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">我的興趣</h3>
          <ul class="text-sm sm:text-base text-white/80 space-y-1 sm:space-y-2">
            <li>• 演算法</li>
            <li>• 人工智慧 AI</li>
            <li>• 股市財經</li>
            <li>• 影集</li>
          </ul>
        </div>
        
        <div class="glassmorphism-mini p-4 sm:p-6 rounded-lg">
          <h3 class="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">聯絡我</h3>
          <p class="text-sm sm:text-base text-white/80 mb-3 sm:mb-4">
            歡迎找我聊聊天～～～
          </p>
          <div class="space-y-1 sm:space-y-2 text-sm sm:text-base text-white/80">
            <p class="break-all">Email: <a href="mailto:charlie960906@gmail.com" class="text-white hover:underline">charlie960906@gmail.com</a></p>
            <p>FB: <a href="https://www.facebook.com/profile.php?id=黃宥鈞" class="text-white hover:underline">黃宥鈞</a></p>
            <p>IG: <a href="https://www.instagram.com/hyjcharlie960906" class="text-white hover:underline">hyjcharlie960906</a></p>
            <p>Company: <a href="https://www.hyjdevelop.com" class="text-white hover:underline">HYJdevelop</a></p>
          </div>
        </div>
      </div>
    `
  },
  friends: {
    title: '友情連結',
    content: `
      <div class="space-y-6">
        <div class="glassmorphism-mini p-4 sm:p-6 rounded-lg">
          <h3 class="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">好友連結</h3>
          <div class="space-y-4">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors friend-card gap-2 sm:gap-0">
              <div>
                <h4 class="text-sm sm:text-base text-white font-medium">倫敦鐵喬的Web</h4>
                <p class="text-white/70 text-xs sm:text-sm">因為學測而放棄修網頁的超強美宣</p>
                <p class="text-blue-400 text-xs mt-1 break-all">bone108.hyjdevelop.com</p>
              </div>
              <a href="https://www.bone1018.hyjdevelop.com" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:text-blue-300 text-xs sm:text-sm whitespace-nowrap">
                點擊查看 →
              </a>
            </div>
            
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors friend-card gap-2 sm:gap-0">
              <div>
                <h4 class="text-sm sm:text-base text-white font-medium">鯊魚YY的BLOG</h4>
                <p class="text-white/70 text-xs sm:text-sm">很久沒有在寫文章的鯊魚YY</p>
                <p class="text-blue-400 text-xs mt-1 break-all">larryeng.github.io</p>
              </div>
              <a href="https://larryeng.github.io/" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:text-blue-300 text-xs sm:text-sm whitespace-nowrap">
                點擊查看 →
              </a>
            </div>
          </div>
        </div>
        
        <div class="glassmorphism-mini p-4 sm:p-6 rounded-lg">
          <h3 class="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">推薦工具</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="p-3 sm:p-4 bg-white/5 rounded-lg">
              <h4 class="text-sm sm:text-base text-white font-medium mb-2">開發工具</h4>
              <ul class="text-white/70 text-xs sm:text-sm space-y-1">
                <li>• <a href="https://code.visualstudio.com/" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:text-blue-300">VS Code</a></li>
                <li>• <a href="https://github.com/" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:text-blue-300">GitHub</a></li>
                <li>• <a href="https://www.figma.com/" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:text-blue-300">Figma</a></li>
                <li>• <a href="https://www.postman.com/" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:text-blue-300">Postman</a></li>
              </ul>
            </div>
            
            <div class="p-3 sm:p-4 bg-white/5 rounded-lg">
              <h4 class="text-sm sm:text-base text-white font-medium mb-2">學習資源</h4>
              <ul class="text-white/70 text-xs sm:text-sm space-y-1">
                <li>• <a href="https://cs.cysh.cy.edu.tw/index.html" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:text-blue-300">CCSC@CYSH</a></li>
                <li>• <a href="https://drive.google.com/drive/u/0/folders/10hZCMHH0YgsfguVZCHU7EYiG8qJE5f-m" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:text-blue-300">吳邦一教授的ap325</a></li>
                <li>• <a href="https://www.youtube.com/channel/UC2ggjtuuWvxrHHHiaDH1dlQ" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:text-blue-300">台大李弘毅教授的人工智慧開放課程</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div class="glassmorphism-mini p-4 sm:p-6 rounded-lg">
          <h3 class="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">音樂推推</h3>
          <p class="text-sm sm:text-base text-white/80 mb-3 sm:mb-4">
            都是我的愛！！！ 喜歡的話就存起來吧～
          </p>
          <div class="w-full overflow-hidden rounded-lg">
            <iframe 
              style="border-radius:12px" 
              src="https://open.spotify.com/embed/playlist/6YWNbabDk7DFa4FTegLZSz?utm_source=generator&theme=0" 
              width="100%" 
              height="300" 
              frameBorder="0" 
              allowfullscreen="" 
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
              loading="lazy"
              class="sm:h-80"
            ></iframe>
          </div>
          <div class="mt-3 sm:mt-4 p-3 bg-blue-500/10 border border-blue-400/30 rounded-lg">
            <p class="text-blue-200 text-xs sm:text-sm">最後在這邊獻上小小的感謝</p>
            <p class="text-blue-200 text-xs sm:text-sm">感謝看到最後的各位！</p>
          </div>
        </div>
      </div>
    `
  }
};

export const getStaticPageContent = (pageKey: string) => {
  return staticPages[pageKey as keyof typeof staticPages];
};