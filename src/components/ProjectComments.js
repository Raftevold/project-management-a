import React, { useState } from 'react';
import { auth } from '../firebase';
import './ProjectComments.css';

const ProjectComments = ({ comments = [], onAddComment, onEditComment }) => {
  const [newComment, setNewComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editText, setEditText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const comment = {
      id: Date.now().toString(),
      text: newComment.trim(),
      author: auth.currentUser.email,
      timestamp: new Date().toISOString(),
    };

    onAddComment(comment);
    setNewComment('');
  };

  const handleEditSubmit = (commentId) => {
    if (!editText.trim()) return;
    onEditComment(commentId, editText.trim());
    setEditingCommentId(null);
    setEditText('');
  };

  const startEditing = (comment) => {
    setEditingCommentId(comment.id);
    setEditText(comment.text);
  };

  const cancelEditing = () => {
    setEditingCommentId(null);
    setEditText('');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // If the comment is from today
    if (date.toDateString() === today.toDateString()) {
      return `I dag ${date.toLocaleTimeString('nb-NO', { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    // If the comment is from yesterday
    if (date.toDateString() === yesterday.toDateString()) {
      return `I går ${date.toLocaleTimeString('nb-NO', { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    // For other dates
    return date.toLocaleDateString('nb-NO', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatAuthor = (email) => {
    return email.split('@')[0];
  };

  const canEditComment = (comment) => {
    return comment.author === auth.currentUser?.email;
  };

  return (
    <div className="project-comments">
      <h4>Kommentarer</h4>
      
      <form onSubmit={handleSubmit} className="comment-form">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Skriv en kommentar..."
          className="comment-input"
        />
        <button 
          type="submit" 
          className="comment-submit"
          disabled={!newComment.trim()}
        >
          Legg til kommentar
        </button>
      </form>

      <div className="comments-list">
        {comments.length > 0 ? (
          comments
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .map(comment => (
              <div key={comment.id} className="comment">
                <div className="comment-header">
                  <span className="comment-author">
                    {formatAuthor(comment.author)}
                  </span>
                  <span className="comment-date">
                    {formatDate(comment.timestamp)}
                    {comment.edited && <span className="edited-mark"> (redigert {formatDate(comment.editedAt)})</span>}
                  </span>
                </div>
                <div className="comment-content">
                  {editingCommentId === comment.id ? (
                    <div className="edit-comment-form">
                      <textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="edit-comment-input"
                      />
                      <div className="edit-buttons">
                        <button
                          onClick={() => handleEditSubmit(comment.id)}
                          className="save-edit-btn"
                          disabled={!editText.trim()}
                        >
                          Lagre
                        </button>
                        <button
                          onClick={cancelEditing}
                          className="cancel-edit-btn"
                        >
                          Avbryt
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {comment.text.split('\n').map((line, i) => (
                        <p key={i}>{line}</p>
                      ))}
                      {canEditComment(comment) && (
                        <button
                          onClick={() => startEditing(comment)}
                          className="edit-comment-btn"
                        >
                          Rediger
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))
        ) : (
          <div className="no-comments">
            Ingen kommentarer enda. Vær den første til å kommentere!
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectComments;
