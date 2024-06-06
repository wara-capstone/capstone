// utils/dateUtils.js
export function formatCreatedAt(createdAt) {
    const now = new Date();
    const postDate = new Date(createdAt);
    const diffInMinutes = Math.floor((now - postDate) / (1000 * 60));
  
    if (diffInMinutes < 60) {
      return `${diffInMinutes}분 전`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}시간 전`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}일 전`;
    }
  }
  