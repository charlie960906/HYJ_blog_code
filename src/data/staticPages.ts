interface StaticPage {
  title: string;
  content: string;
}

interface StaticPages {
  about: StaticPage;
  friends: StaticPage;
}

const staticPages: StaticPages = {
  about: {
    title: '關於我',
    content: `
      <div class="space-y-6">
        <div class="text-center">
          <img src="/images/my.jpg" alt="HYJ's Image" loading="lazy" class="w-24 h-24 sm:w-32 sm:h-32 rounded-full mx-auto mb-4 sm:mb-6 object-cover about-image">
          <div class="text-2xl sm:text-3xl font-bold text-white">嗨嗨嗨！我是老黃</div>
        </div>
      
        <div class="glassmorphism-mini">
          <div>
            <h3 class="text-lg sm:text-xl font-semibold text-white">關於這個BLOG</h3>
            <div class="content-block">
              <p class="text-sm sm:text-base text-white/80 leading-relaxed">嗨嗨嗨！！！歡迎你發現我的BLOG！</p>
              <p class="text-sm sm:text-base text-white/80 leading-relaxed">這個BLOG主要寫題解、演算法、財經時事和各種評測～</p>
              <p class="text-sm sm:text-base text-white/80 leading-relaxed">謝謝你看到這邊～～</p>
            </div>
          </div>
        </div>
        
        <div class="glassmorphism-mini">
          <div>
            <h3 class="text-lg sm:text-xl font-semibold text-white">我的興趣</h3>
            <ul class="text-sm sm:text-base text-white/80">
              <li>• 演算法</li>
              <li>• 人工智慧 AI</li>
              <li>• 股市財經</li>
              <li>• 影集</li>
            </ul>
          </div>
        </div>
        
        <div class="glassmorphism-mini">
          <div>
            <h3 class="text-lg sm:text-xl font-semibold text-white">聯絡我</h3>
            <p class="content-block text-sm sm:text-base text-white/80">
              歡迎找我聊聊天～～～
            </p>
            <div class="content-block text-sm sm:text-base text-white/80 space-y-2">
              <p class="break-all">Email: <a href="mailto:charlie960906@gmail.com" class="text-white hover:underline">charlie960906@gmail.com</a></p>
              <p>FB: <a href="https://www.facebook.com/profile.php?id=黃宥鈞" class="text-white hover:underline">黃宥鈞</a></p>
              <p>IG: <a href="https://www.instagram.com/hyjcharlie960906" class="text-white hover:underline">hyjcharlie960906</a></p>
              <p>Company: <a href="https://www.hyjdevelop.com" class="text-white hover:underline">HYJdevelop</a></p>
            </div>
          </div>
        </div>
      </div>
    `
  },
  friends: {
    title: '友情連結',
    content: `
      <div class="space-y-6">
        <div class="glassmorphism-mini">
          <div>
            <h3 class="text-lg sm:text-xl font-semibold text-white">好友連結</h3>
            <div class="content-block space-y-4">
              <div class="bg-white/5 rounded-lg p-4">
                <div class="flex flex-col sm:flex-row sm:items-start justify-between">
                  <div>
                    <h4 class="text-base sm:text-lg text-white font-medium">倫敦鐵喬的Web</h4>
                    <p class="text-white/80 text-sm sm:text-base leading-relaxed mt-2">因為學測而放棄修網頁的超強美宣</p>
                    <p class="text-blue-400 text-sm mt-1">bone108.hyjdevelop.com</p>
                  </div>
                  <a href="https://www.bone1018.hyjdevelop.com" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:text-blue-300 text-sm sm:text-base whitespace-nowrap mt-2 sm:mt-0 sm:ml-4">
                    點擊查看 →
                  </a>
                </div>
              </div>
              
              <div class="bg-white/5 rounded-lg p-4">
                <div class="flex flex-col sm:flex-row sm:items-start justify-between">
                  <div>
                    <h4 class="text-base sm:text-lg text-white font-medium">鯊魚YY的BLOG</h4>
                    <p class="text-white/80 text-sm sm:text-base leading-relaxed mt-2">很久沒有在寫文章的鯊魚YY</p>
                    <p class="text-blue-400 text-sm mt-1">larryeng.github.io</p>
                  </div>
                  <a href="https://larryeng.github.io/" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:text-blue-300 text-sm sm:text-base whitespace-nowrap mt-2 sm:mt-0 sm:ml-4">
                    點擊查看 →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="glassmorphism-mini">
          <div>
            <h3 class="text-lg sm:text-xl font-semibold text-white">推薦工具</h3>
            <div class="content-block grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="bg-white/5 rounded-lg p-4">
                <h4 class="text-base sm:text-lg text-white font-medium">開發工具</h4>
                <ul class="text-sm sm:text-base text-white/80">
                  <li class="flex items-center">
                    <span class="mr-2">•</span>
                    <a href="https://code.visualstudio.com/" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:text-blue-300">VS Code</a>
                  </li>
                  <li class="flex items-center">
                    <span class="mr-2">•</span>
                    <a href="https://github.com/" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:text-blue-300">GitHub</a>
                  </li>
                  <li class="flex items-center">
                    <span class="mr-2">•</span>
                    <a href="https://www.figma.com/" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:text-blue-300">Figma</a>
                  </li>
                  <li class="flex items-center">
                    <span class="mr-2">•</span>
                    <a href="https://www.postman.com/" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:text-blue-300">Postman</a>
                  </li>
                </ul>
              </div>
              
              <div class="bg-white/5 rounded-lg p-4">
                <h4 class="text-base sm:text-lg text-white font-medium">學習資源</h4>
                <ul class="text-sm sm:text-base text-white/80">
                  <li class="flex items-center">
                    <span class="mr-2">•</span>
                    <a href="https://cs.cysh.cy.edu.tw/index.html" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:text-blue-300">CCSC@CYSH</a>
                  </li>
                  <li class="flex items-center">
                    <span class="mr-2">•</span>
                    <a href="https://drive.google.com/drive/u/0/folders/10hZCMHH0YgsfguVZCHU7EYiG8qJE5f-m" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:text-blue-300">吳邦一教授的ap325</a>
                  </li>
                  <li class="flex items-center">
                    <span class="mr-2">•</span>
                    <a href="https://www.youtube.com/channel/UC2ggjtuuWvxrHHHiaDH1dlQ" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:text-blue-300">台大李弘毅教授的人工智慧開放課程</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        <div class="glassmorphism-mini">
          <div class="p-4 sm:p-6">
            <h3 class="text-lg sm:text-xl font-semibold text-white">音樂推推</h3>
            <div class="mt-3 sm:mt-4 space-y-2">
              <p class="text-sm sm:text-base text-white/80 leading-relaxed">
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
                <div class="space-y-1">
                  <p class="text-blue-200 text-xs sm:text-sm">最後在這邊獻上小小的感謝</p>
                  <p class="text-blue-200 text-xs sm:text-sm">感謝看到最後的各位！</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `
  }
};

export const getStaticPageContent = (pageKey: keyof StaticPages) => {
  return staticPages[pageKey];
};

export default staticPages;