'use strict';

var winW, girlDetails, selectedLi;

angular.module('avInjector')
  .directive('haveDetails', ['$window', '$document', '$http', function($window, $document, $http){
    return function(scope, element, attr) {
      // モーダルサイズの初期化
      winW = $window.innerWidth;
      var picH = 123;
      // var picH = element[0].clientHeight;
      var modalH = $window.innerHeight - picH;
      
      ng('#js-modal').css({
        width: winW,
        height: modalH,
        position: 'fixed',
        top: picH,
        left: winW,
        backgroundColor: 'rgba(255, 255, 255, 0.85)',
        overflow: 'scroll'
      });
      
      // 画像クリック時の挙動
      element.on('click', function(){
        $('.listThumb01 li').removeClass('selected');
        ng('#girlDetails').empty();
        selectedLi = $(this);
        var scrTop = selectedLi.offset().top;
        
        // 選択されてないものを薄く。
        ng('.listThumb01 li').animate({
          opacity: 0.3
        }, 400, 'easeOutExpo');
        $(this).addClass('selected');

        // オートスクロール
        ng('body').stop(true, true).animate({
          scrollTop: scrTop
        }, {
          duration: 400,
          easing: 'easeOutExpo',
          complete: appearModal
        });
      });
      
      // クリック時のモーダル表示関数
      function appearModal() {
        ng('body').css('overflow', 'hidden')
        ng('#js-modal').animate({
          left: 0
        }, {
          duration: 400,
          easing: 'easeOutExpo',
          complete: getDetails
        });
      }

      // 詳細データの取得
      function getDetails() {
        $http.get('/api/girls/details/' + selectedLi.data('id')).success(function(works){
          console.log(works);

          for(var i = 0; i < works.length; i++) {
            var img = ng('<img>').attr({
              src: works[i].imgSrc,
              alt: works[i].title
            });
            var a = ng('<a>').attr({
              href: works[i].link,
              target: '_blank'
            }).append(img);
            var li = ng('<li>').attr({
              class: 'col-xs-4 col-md-2'
            }).append(a);
            
            ng('#girlDetails').append(li);
          }
        });
      }
    };
  }])
  .directive('girlDetails', ['$window', '$document', function($window, $document){
    return function(scope, element, attr) {
      scope.closeModal = function() {
        ng('#js-modal').animate({
          left: winW
        }, {
          duration: 400,
          easing: 'easeOutExpo',
          complete: function(){
            ng('body').css('overflow', 'visible');
            selectedLi.removeClass('selected');
            ng('#girlDetails').empty();
            ng('.listThumb01 li').animate({
              opacity: 1
            }, 400, 'easeOutExpo');
          }
        });
      };
      
    };
  }]);

// Utils
function ng(selector) {
  return angular.element(selector);
}


