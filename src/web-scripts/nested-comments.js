void (function NestedComments() {
  'use strict';

  {
    $('#Top .site-nav .tools > .top').addClass('effect-btn');
    $('#Main #Tabs .tab').addClass('effect-btn');
    $('#Main .topic_buttons a.tb').addClass('effect-btn');
    $('#Main .topic-link').attr('target', '_blank');
  }

  const commentBox = $('#Main .box:has(.cell[id^="r_"])');
  const commentCells = $('#Main .cell[id^="r_"]');
  const cellTableRows = commentCells.find('table > tbody > tr');

  const commentData = cellTableRows
    .map((idx, tr) => {
      const id = commentCells[idx].id;
      const td = $(tr).find('> td:nth-child(3)');
      const name = td.find('> strong > a').text();
      const content = td.find('> .reply_content').text();
      const likes = Number(td.find('span.small').text());
      const floor = td.find('span.no').text();

      return { id, name, content, likes, floor, index: idx };
    })
    .get();

  {
    const popularCommentData = commentData
      .filter(({ likes }) => likes > 0)
      .sort((a, b) => b.likes - a.likes);

    if (popularCommentData.length > 0) {
      const commentContainer = $(`
      <div class="extra-comments-mask">
        <div class="extra-comments-content box">
          <div class="extra-comments-bar">
            <span>本页共有 ${popularCommentData.length} 条热门回复</span>
            <button class="extra-comments-close-btn">关闭</button>
          </div>
        </div>
      </div>
      `).css({
        visibility: 'hidden',
        position: 'fixed',
        inset: '0',
        'z-index': '999',
        'overflow-y': 'auto',
      });

      {
        const commentBoxCount = commentBox.find('.cell:first-of-type > span.gray');
        const countText = commentBoxCount.text();
        const newCountText = countText.substring(0, countText.indexOf('回复') + 2);
        const countTextSpan = `<span class="count-text">${newCountText}</span><span class="dot">·</span>`;

        const popularBtn = $('<span class="popular-btn effect-btn">🔥 查看热门回复</span>');
        popularBtn.click(() => {
          commentContainer.css({ visibility: 'visible' });
          document.body.classList.add('modal-open');
        });

        commentBoxCount.empty().append(countTextSpan).append(popularBtn);
      }

      const templete = $('<templete></templete>');

      popularCommentData.forEach(({ index }) => {
        templete.append(commentCells.eq(index).clone());
      });

      commentContainer.find('.extra-comments-close-btn').click(() => {
        commentContainer.css({ visibility: 'hidden' });
        document.body.classList.remove('modal-open');
      });

      commentContainer.find('.extra-comments-content').append(templete.html());

      commentBox.append(commentContainer);
    }
  }

  /** 发帖人的昵称 */
  const ownerName = $('#Main > .box:nth-child(1) > .header > small > a').text();

  /** 登录人的昵称 */
  const loginName = $('#Top .tools > a[href^="/member"]').text();

  let i = 1;
  while (i < commentCells.length) {
    const cellDom = commentCells[i];
    const { name, content } = commentData[i];

    if (name === ownerName) {
      cellDom.classList.add('owner');
    }

    if (name === loginName) {
      cellDom.classList.add('self');
    }

    if (content.includes('@')) {
      for (let j = i - 1; j >= 0; j--) {
        if (content.match(`@${commentData[j].name}`)) {
          cellDom.classList.add('responder');
          commentCells[j].append(commentCells[i]);
          break;
        }
      }
    }

    i++;
  }
})();
