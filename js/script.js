(function($){
  // Search
  var $searchWrap = $('#search-form-wrap'),
    isSearchAnim = false,
    searchAnimDuration = 200,
    $searchResultMask = $('#result-mask'),
    $searchResultWrap = $('#result-wrap'),
    $searchResult = $('#search-result');
  $('#result-mask').width(screen.width).height(screen.height);

  // xhr加载content.json数据
  var searchData;
  function loadData(success) {
      if (!searchData) {
          var xhr = new XMLHttpRequest();
          xhr.open('GET', '/content.json', true);
          xhr.onload = function() {
              if (this.status >= 200 && this.status < 300) {
                  var res = JSON.parse(this.response || this.responseText);
                  searchData = res instanceof Array ? res : res.posts;
                  success(searchData);
              } else {
                  console.error(this.statusText);
              }
          };
          xhr.onerror = function() {
              console.error(this.statusText);
          };
          xhr.send();
      } else {
          success(searchData);
      }
  }
  // 匹配文章内容返回结果
  function matcher(post, regExp) {
      // 匹配优先级：title > tags > text
      return regtest(post.title, regExp) || post.tags.some(function(tag) {
          return regtest(tag.name, regExp);
      }) || regtest(post.text, regExp);
  }
  function regtest(raw, regExp) {
      regExp.lastIndex = 0;
      return regExp.test(raw);
  }
  // 渲染到页面
  function render(data) {
      var html = '';
      if (data.length) {
          var searchTplStr = $("#search-tpl").html();
          var searchTpl = _.template(searchTplStr, {
            interpolate: /\{(.+?)\}/g
          });
          html = data.map(function(post) {
              return searchTpl({
                  title: post.title,
                  path: post.path,
                  date: new Date(post.date).toLocaleDateString(),
                  tags: post.tags.map(function(tag) {
                      return '<span class="fa fa-tag">' + tag.name + '</span>';
                  }).join('')
              });
          }).join('');
      }
      $searchResult.html(html);
      if (html) {
        $searchResultWrap.show();
      } else {
        $searchResultWrap.hide();
      }
  }
  // 查询
  function search(key) {
      // 关键字 => 正则，空格隔开的看作多个关键字
      // a b c => /a|b|c/gmi
      var regExp = new RegExp(key.replace(/[ ]/g, '|'), 'gmi');
      loadData(function(data) {
          var result = data.filter(function(post) {
              return matcher(post, regExp);
          });
          render(result);
      });
  }

  $('#search-key').bind('input propertychange change', function(e){
    var key = $.trim(this.value);
    if (!key) {
      $searchResult.html('');
      $searchResultWrap.hide();
      return;
    }
    search(key);
  });

  $searchResultMask.click(function(e){
    startSearchAnim();
    $searchWrap.removeClass('on');
    $searchResultMask.hide();
    stopSearchAnim();
  });

  var startSearchAnim = function(){
    isSearchAnim = true;
  };

  var stopSearchAnim = function(callback){
    setTimeout(function(){
      isSearchAnim = false;
      callback && callback();
    }, searchAnimDuration);
  };

  $('#nav-search-btn').on('click', function(){
    if (isSearchAnim) return;

    startSearchAnim();
    $searchResultMask.show();
    $searchWrap.addClass('on');
    stopSearchAnim(function(){
      // $('.search-form-input').focus();
    });
  });

  $('.search-form-input').on('blur', function(){
    startSearchAnim();
    $searchWrap.removeClass('on');
    stopSearchAnim();
  });

  // Share
  $('body').on('click', function(){
    $('.article-share-box.on').removeClass('on');
  }).on('click', '.article-share-link', function(e){
    e.stopPropagation();

    var $this = $(this),
      url = $this.attr('data-url'),
      encodedUrl = encodeURIComponent(url),
      id = 'article-share-box-' + $this.attr('data-id'),
      offset = $this.offset();

    if ($('#' + id).length){
      var box = $('#' + id);

      if (box.hasClass('on')){
        box.removeClass('on');
        return;
      }
    } else {
      var html = [
        '<div id="' + id + '" class="article-share-box">',
          '<input class="article-share-input" value="' + url + '">',
          '<div class="article-share-links">',
            '<a href="http://service.weibo.com/share/share.php?&title=好东西就要一起分享&language=zh_cn&url=' + encodedUrl + '" class="article-share-sina" target="_blank" title="微博"></a>',
            // '<a href="http://share.renren.com/share/buttonshare.do?link=' + encodedUrl + '" class="article-share-renren" target="_blank" title="人人"></a>',
            // '<a href="http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=' + encodedUrl + '" class="article-share-qq" target="_blank" title="QQ空间"></a>',
            '<a href="http://qr.liantu.com/api.php?text=' + encodedUrl + '" class="article-share-wechat" target="_blank" title="微信"></a>',
            '<a href="https://twitter.com/intent/tweet?url=' + encodedUrl + '" class="article-share-twitter" target="_blank" title="Twitter"></a>',
            '<a href="https://www.facebook.com/sharer.php?u=' + encodedUrl + '" class="article-share-facebook" target="_blank" title="Facebook"></a>',
            // '<a href="http://pinterest.com/pin/create/button/?url=' + encodedUrl + '" class="article-share-pinterest" target="_blank" title="Pinterest"></a>',
            // '<a href="https://plus.google.com/share?url=' + encodedUrl + '" class="article-share-google" target="_blank" title="Google+"></a>',
          '</div>',
        '</div>'
      ].join('');

      var box = $(html);

      $('body').append(box);
    }

    $('.article-share-box.on').hide();

    box.css({
      top: offset.top + 25,
      left: offset.left
    }).addClass('on');
  }).on('click', '.article-share-box', function(e){
    e.stopPropagation();
  }).on('click', '.article-share-box-input', function(){
    $(this).select();
  }).on('click', '.article-share-box-link', function(e){
    e.preventDefault();
    e.stopPropagation();

    window.open(this.href, 'article-share-box-window-' + Date.now(), 'width=500,height=450');
  });

  // Caption
  $('.article-entry').each(function(i){
    $(this).find('img').each(function(){
      if ($(this).parent().hasClass('fancybox')) return;

      var alt = this.alt;

      if (alt) $(this).after('<span class="caption">' + alt + '</span>');

      $(this).wrap('<a href="' + this.src + '" title="' + alt + '" class="fancybox"></a>');
    });

    $(this).find('.fancybox').each(function(){
      $(this).attr('rel', 'article' + i);
    });
  });

  if ($.fancybox){
    $('.fancybox').fancybox();
  }

  // Mobile nav
  var $container = $('#container'),
    isMobileNavAnim = false,
    mobileNavAnimDuration = 200;

  var startMobileNavAnim = function(){
    isMobileNavAnim = true;
  };

  var stopMobileNavAnim = function(){
    setTimeout(function(){
      isMobileNavAnim = false;
    }, mobileNavAnimDuration);
  }

  $('#main-nav-toggle').on('click', function(){
    if (isMobileNavAnim) return;

    startMobileNavAnim();
    $container.toggleClass('mobile-nav-on');
    stopMobileNavAnim();
  });

  $('#wrap').on('click', function(){
    if (isMobileNavAnim || !$container.hasClass('mobile-nav-on')) return;

    $container.removeClass('mobile-nav-on');
  });
})(jQuery);