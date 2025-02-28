document.addEventListener('DOMContentLoaded', function() {
    // 视频元素
    const video = document.getElementById('main-video');
    
    // 按钮和提示元素
    const likeBtn = document.getElementById('like-button');
    const shareBtn = document.getElementById('share-button');
    const downloadBtn = document.getElementById('download-button');
    const likeMessage = document.getElementById('like-message');
    const closeMessageBtn = document.getElementById('close-message');
    
    // 当前视频信息 - 更新为Stored Memory视频
    const videoInfo = {
        title: document.querySelector('.video-info h2').textContent,
        description: document.querySelector('.video-description').textContent,
        url: window.location.href,
        src: video.querySelector('source').getAttribute('src'),
        // 添加视频统计数据
        stats: {
            views: '1.4M',
            likes: '25K',
            date: '2023-09-15'
        }
    };
    
    // 处理点赞按钮点击事件
    likeBtn.addEventListener('click', function() {
        if (!this.classList.contains('disabled')) {
            likeMessage.classList.add('show');
            this.classList.add('disabled');
            localStorage.setItem('likeDisabled', 'true');
            
            // 注意：这里只是静态展示，实际项目中会与后端交互更新点赞数
        }
    });
    
    // 关闭提示信息
    closeMessageBtn.addEventListener('click', function() {
        likeMessage.classList.remove('show');
    });
    
    // 点击提示信息背景也可关闭
    likeMessage.addEventListener('click', function(e) {
        if (e.target === this) {
            this.classList.remove('show');
        }
    });
    
    // 检查是否已经点过赞
    if (localStorage.getItem('likeDisabled') === 'true') {
        likeBtn.classList.add('disabled');
    }
    
    // 分享功能
    shareBtn.addEventListener('click', function() {
        console.log('分享按钮被点击');
        
        // 检查是否支持原生Web Share API
        if (navigator.share) {
            navigator.share({
                title: videoInfo.title,
                text: videoInfo.description,
                url: videoInfo.url
            }).then(() => {
                console.log('分享成功');
            }).catch((error) => {
                console.error('分享失败:', error);
                fallbackShare();
            });
        } else {
            // 如果不支持原生分享，使用替代方案
            fallbackShare();
        }
    });
    
    // 替代分享功能（如果原生分享不可用）
    function fallbackShare() {
        // 创建临时文本区域
        const textArea = document.createElement('textarea');
        const shareText = `${videoInfo.title}\n\n${videoInfo.description}\n\n查看链接: ${videoInfo.url}`;
        
        // 设置文本并添加到页面
        textArea.value = shareText;
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        document.body.appendChild(textArea);
        
        // 选择并复制文本
        textArea.select();
        let success = false;
        try {
            success = document.execCommand('copy');
        } catch (err) {
            console.error('无法复制文本:', err);
        }
        
        // 移除临时文本区域
        document.body.removeChild(textArea);
        
        // 显示反馈
        if (success) {
            alert('链接已复制到剪贴板，您可以粘贴分享');
        } else {
            alert('无法自动复制链接，请手动复制：' + videoInfo.url);
        }
    }
    
    // 下载功能
    downloadBtn.addEventListener('click', function() {
        console.log('下载按钮被点击');
        
        // 获取视频源
        const videoSrc = videoInfo.src;
        console.log('视频源:', videoSrc);
        
        if (!videoSrc) {
            alert('无法获取视频源，请检查视频链接。');
            return;
        }
        
        // 显示下载中状态
        downloadBtn.classList.add('downloading');
        downloadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 下载中...';
        
        try {
            // 创建下载链接
            const downloadLink = document.createElement('a');
            downloadLink.href = videoSrc;
            
            // 设置文件名 - 从源URL中提取
            const fileName = videoSrc.split('/').pop();
            downloadLink.download = fileName;
            downloadLink.style.display = 'none';
            
            // 添加到页面，触发点击，然后移除
            document.body.appendChild(downloadLink);
            downloadLink.click();
            
            setTimeout(function() {
                document.body.removeChild(downloadLink);
                
                // 重置按钮状态
                setTimeout(function() {
                    downloadBtn.classList.remove('downloading');
                    downloadBtn.innerHTML = '<i class="fas fa-download"></i> 下载';
                }, 2000);
            }, 100);
        } catch (error) {
            console.error('下载失败:', error);
            alert('下载失败，请尝试右键视频并选择"保存视频为..."');
            
            // 重置按钮状态
            downloadBtn.classList.remove('downloading');
            downloadBtn.innerHTML = '<i class="fas fa-download"></i> 下载';
        }
    });

    // 视频加载错误处理
    video.addEventListener('error', function() {
        console.error('视频加载错误');
        this.insertAdjacentHTML('afterend', '<div class="video-error">视频加载失败，请检查视频路径是否正确。</div>');
    });

    // 视频加载成功事件
    video.addEventListener('loadeddata', function() {
        console.log('视频加载成功');
    });

    // 视频结束事件
    video.addEventListener('ended', function() {
        console.log('视频播放结束');
    });
});
