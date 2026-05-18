import React, { useState, useRef } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import '../../../css/sendEmail.css';

export default function SendEmail({ auth, users }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        users: [],
        subject: '',
        content: '',
    });

    const [previewMode, setPreviewMode] = useState(false);
    const editorRef = useRef(null);

    const handleFormat = (command, value = null) => {
        document.execCommand(command, false, value);
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result;
                const html = `<img src="${base64String}" style="max-width: 100%; height: auto; margin: 10px 0; border-radius: 8px; display: block;" /><p><br></p>`;
                handleFormat('insertHTML', html);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleVideoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result;
                const html = `<video controls style="max-width: 100%; height: auto; margin: 10px 0; border-radius: 8px; display: block;">
                    <source src="${base64String}" type="${file.type}">
                    Your browser does not support the video tag.
                </video><p><br></p>`;
                handleFormat('insertHTML', html);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleYoutubeInsert = () => {
        const url = prompt("Enter YouTube Video URL (e.g., https://www.youtube.com/watch?v=xxxx):");
        if (url) {
            // Extract video ID
            let videoId = '';
            const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
            const match = url.match(regExp);
            if (match && match[2].length === 11) {
                videoId = match[2];
                // Most email clients (especially Gmail) struggle with CSS absolute positioning and transforms.
                // We use a robust table-based layout to ensure perfect centering and alignment across all devices.
                const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
                const videoLink = `https://www.youtube.com/watch?v=${videoId}`;
                
                const html = `
                    <div align="center" style="margin: 30px 0; text-align: center; width: 100%;">
                        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto;">
                            <tr>
                                <td align="center" style="padding: 0;">
                                    <a href="${videoLink}" target="_blank" style="text-decoration: none; display: block; border-radius: 12px; overflow: hidden;">
                                        <img src="${thumbnailUrl}" width="600" style="width: 100%; max-width: 600px; height: auto; border-radius: 12px; display: block; border: 1px solid #e5e7eb;">
                                        <table border="0" cellpadding="0" cellspacing="0" style="margin-top: -15px; margin-bottom: 10px;">
                                            <tr>
                                                <td align="center" bgcolor="#10b981" style="border-radius: 8px; padding: 10px 24px;">
                                                    <span style="color: #ffffff; font-family: sans-serif; font-size: 15px; font-weight: bold; text-decoration: none;">
                                                        ▶ Click to Watch Video
                                                    </span>
                                                </td>
                                            </tr>
                                        </table>
                                    </a>
                                </td>
                            </tr>
                        </table>
                    </div><p><br></p>`;
                
                handleFormat('insertHTML', html);
            } else {
                alert("Invalid YouTube URL");
            }
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Get content from editor
        const content = editorRef.current.innerHTML;
        setData('content', content);
        
        post(route('admin.send-email.submit'), {
            onSuccess: () => {
                reset();
                editorRef.current.innerHTML = '';
                alert('Email sent successfully!');
            },
        });
    };

    const handleUserSelect = (e) => {
        const value = Array.from(e.target.selectedOptions, option => option.value);
        setData('users', value);
    };

    const toggleAllUsers = () => {
        if (data.users.includes('all')) {
            setData('users', []);
        } else {
            setData('users', ['all']);
        }
    };

    return (
        <>
            <Head title="Send Admin Email" />

            <div className="send-email-page">
                <div className="send-email-container">
                    <div className="send-email-card">
                        <form onSubmit={handleSubmit} className="email-form">
                            {/* Recipients */}
                            <div className="form-group">
                                <label className="form-label">
                                    Recipients
                                </label>
                                <div className="recipients-header">
                                    <button
                                        type="button"
                                        onClick={toggleAllUsers}
                                        className={`btn-toggle-all ${data.users.includes('all') ? 'selected' : 'unselected'}`}
                                    >
                                        {data.users.includes('all') ? 'All Users Selected' : 'Select All Users'}
                                    </button>
                                </div>
                                {!data.users.includes('all') && (
                                    <select
                                        multiple
                                        value={data.users}
                                        onChange={handleUserSelect}
                                        className="user-select"
                                    >
                                        {users.map((user) => (
                                            <option key={user.id} value={user.id}>
                                                {user.name} ({user.email})
                                            </option>
                                        ))}
                                    </select>
                                )}
                                {errors.users && <div className="error-text">{errors.users}</div>}
                            </div>

                            {/* Subject */}
                            <div className="form-group">
                                <label className="form-label">
                                    Subject
                                </label>
                                <input
                                    type="text"
                                    value={data.subject}
                                    onChange={(e) => setData('subject', e.target.value)}
                                    className="subject-input"
                                    placeholder="Enter email subject"
                                    required
                                />
                                {errors.subject && <div className="error-text">{errors.subject}</div>}
                            </div>

                            {/* Rich Text Editor Toolbar */}
                            <div className="editor-wrapper">
                                <div className="toolbar">
                                    <div className="toolbar-group">
                                        <button type="button" onClick={() => handleFormat('bold')} className="toolbar-btn" title="Bold"><i className="fas fa-bold"></i></button>
                                        <button type="button" onClick={() => handleFormat('italic')} className="toolbar-btn" title="Italic"><i className="fas fa-italic"></i></button>
                                        <button type="button" onClick={() => handleFormat('underline')} className="toolbar-btn" title="Underline"><i className="fas fa-underline"></i></button>
                                    </div>

                                    <div className="toolbar-group">
                                        <button type="button" onClick={() => handleFormat('justifyLeft')} className="toolbar-btn" title="Align Left"><i className="fas fa-align-left"></i></button>
                                        <button type="button" onClick={() => handleFormat('justifyCenter')} className="toolbar-btn" title="Align Center"><i className="fas fa-align-center"></i></button>
                                        <button type="button" onClick={() => handleFormat('justifyRight')} className="toolbar-btn" title="Align Right"><i className="fas fa-align-right"></i></button>
                                    </div>

                                    <div className="toolbar-group">
                                        <div className="toolbar-btn" title="Text Color">
                                            <i className="fas fa-font"></i>
                                            <input 
                                                type="color" 
                                                onChange={(e) => handleFormat('foreColor', e.target.value)} 
                                                className="color-input" 
                                            />
                                        </div>
                                        <div className="toolbar-btn" title="Highlight Color">
                                            <i className="fas fa-fill-drip"></i>
                                            <input 
                                                type="color" 
                                                defaultValue="#ffffff"
                                                onChange={(e) => handleFormat('hiliteColor', e.target.value)} 
                                                className="color-input" 
                                            />
                                        </div>
                                    </div>

                                    <div className="toolbar-group">
                                        <label className="toolbar-btn" title="Upload Image">
                                            <i className="fas fa-image"></i>
                                            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                                        </label>
                                        <label className="toolbar-btn" title="Upload Video">
                                            <i className="fas fa-video"></i>
                                            <input type="file" accept="video/*" onChange={handleVideoUpload} className="hidden" />
                                        </label>
                                        <button type="button" onClick={handleYoutubeInsert} className="toolbar-btn" title="Insert YouTube Video">
                                            <i className="fab fa-youtube"></i>
                                        </button>
                                    </div>

                                    <div className="flex-grow"></div>
                                    
                                    <button 
                                        type="button" 
                                        onClick={() => setPreviewMode(!previewMode)} 
                                        className={`btn-preview-toggle ${previewMode ? 'preview' : 'edit'}`}
                                    >
                                        <i className={`fas ${previewMode ? 'fa-edit' : 'fa-eye'}`}></i>
                                        {previewMode ? 'Switch to Edit' : 'Preview Email'}
                                    </button>
                                </div>

                                {/* Editor Content Area */}
                                <div className="editor-container">
                                    <div 
                                        ref={editorRef}
                                        contentEditable={!previewMode}
                                        className={`editor-content ${previewMode ? 'hidden' : ''}`}
                                        onInput={(e) => setData('content', e.currentTarget.innerHTML)}
                                    ></div>

                                    {previewMode && (
                                        <div className="preview-container">
                                            <div className="email-paper">
                                                <div className="email-header">
                                                    <div className="subject-label">Subject</div>
                                                    <div className="subject-display">{data.subject || '(No Subject)'}</div>
                                                </div>
                                                <div 
                                                    className="email-body"
                                                    dangerouslySetInnerHTML={{ __html: editorRef.current?.innerHTML || '' }}
                                                ></div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            {errors.content && <div className="error-text">{errors.content}</div>}

                            <div className="form-actions">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="btn-send"
                                >
                                    {processing ? (
                                        <>
                                            <i className="fas fa-spinner fa-spin"></i> Sending Broadcast...
                                        </>
                                    ) : (
                                        <>
                                            <i className="fas fa-paper-plane"></i> Send Broadcast Email
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
