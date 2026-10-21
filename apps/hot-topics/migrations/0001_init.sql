-- 0001_init.sql
-- 存储 V2EX 热门主题数据

CREATE TABLE IF NOT EXISTS hot_topics (
  id INTEGER PRIMARY KEY,
  title TEXT NOT NULL,
  replies INTEGER NOT NULL DEFAULT 0,
  created INTEGER NOT NULL,
  last_touched INTEGER NOT NULL DEFAULT 0,
  member_username TEXT NOT NULL,
  member_avatar_mini TEXT NOT NULL
);

-- 复合索引：覆盖 WHERE last_touched 范围过滤 + ORDER BY last_touched / replies 排序
CREATE INDEX IF NOT EXISTS idx_hot_topics_last_touched_replies ON hot_topics (last_touched DESC, replies DESC);
