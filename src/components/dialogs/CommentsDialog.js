import React, { useState } from 'react';
import { auth } from '../../firebase';
import { ProjectService } from '../../services/ProjectService';
import BaseDialog from './BaseDialog';
import './DialogStyles.css';

const CommentsDialog = ({ project, comments = [], onClose, onAddComment, onEditComment }) => {
  const [newComment, setNewComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editText, setEditText] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const comment = {
      id: Date.now().toString(),
      text: newComment.trim(),
      author: auth.currentUser.email,
      timestamp: new Date().toISOString(),
    };

    const success = await ProjectService.handleAddComment(project.id, comment, comments);
    if (success) {
      onAddComment(comment);
      setNewComment('');
    }
  };

  const handleEditSubmit = async (commentId) => {
    if (!editText.trim()) return;
    
    const success = await ProjectService.handleEditComment(project.id, commentId, editText.trim(), comments);
    if (success) {
      onEditComment(commentId, editText.trim());
      setEditingCommentId(null);
      setEditText('');
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (window.confirm('Er du sikker på at du vil slette denne kommentaren?')) {
      const updatedComments = comments.filter(comment => comment.id !== commentId);
      const success = await ProjectService.handleDeleteComment(project.id, commentId, updatedComments);
      if (success) {
        onEditComment(commentId, null, updatedComments);
      }
    }
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

    if (date.toDateString() === today.toDateString()) {
      return `I dag ${date.toLocaleTimeString('nb-NO', { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    if (date.toDateString() === yesterday.toDateString()) {
      return `I går ${date.toLocaleTimeString('nb-NO', { hour: '2-digit', minute: '2-digit' })}`;
    }
    
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
    <BaseDialog title="Kommentarer" onClose={onClose}>
      <div className="comments-dialog">
        <form onSubmit={handleSubmit} className="comment-form">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Skriv en kommentar..."
            className="comment-input"
          />
          <button 
            type="submit" 
            className="submit-btn"
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
                            title="Lagre endringer"
                          >
                            <svg viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                            </svg>
                          </button>
                          <button
                            onClick={cancelEditing}
                            className="cancel-edit-btn"
                            title="Avbryt"
                          >
                            <svg viewBox="0 0 20 20" fill="currentColor">
                              <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        {comment.text.split('\n').map((line, i) => (
                          <p key={i}>{line}</p>
                        ))}
                        {canEditComment(comment) && (
                          <div className="comment-actions">
                            <button
                              onClick={() => startEditing(comment)}
                              className="edit-btn"
                              title="Rediger kommentar"
                            >
                              <svg viewBox="0 0 20 20" fill="currentColor">
                                <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
                                <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDeleteComment(comment.id)}
                              className="delete-btn"
                              title="Slett kommentar"
                            >
                              <svg viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" />
                              </svg>
                            </button>
                          </div>
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
    </BaseDialog>
  );
};

export default CommentsDialog;
