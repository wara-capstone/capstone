import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Button from '@mui/material/Button';
import MoodIcon from '@mui/icons-material/Mood';


function Comment({ onCommentSubmit }) {
    const [commentText, setCommentText] = useState('');

    const handleCommentTextChange = (event) => {
      setCommentText(event.target.value);
    };
  
    const handleCommentSubmit = () => {
      // 여기에 실제 댓글 작성 로직을 구현합니다.
      if (commentText.trim() !== '') {
        onCommentSubmit(commentText.trim());
        setCommentText('');
      }
    };


    return (
        <TextField
          sx={{ paddingLeft: '1rem', paddingY: '0.5rem' }}
          placeholder="댓글 달기..."
          fullWidth
          variant="standard"
          value={commentText}
          onChange={handleCommentTextChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <MoodIcon fontSize="large" />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <Button
                  sx={{ fontWeight: 'bold', marginRight: '1rem'}}
                  onClick={handleCommentSubmit}
                >
                  등록
                </Button>
              </InputAdornment>
            ),
            disableUnderline: true,
          }}
        />
      );
    };

export default Comment;