import React, { useState } from 'react';
import axios from 'axios';

function PdfUploader() {
  const [file, setFile] = useState(null);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFile(e.target.files[0]);

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);

    try {
      setLoading(true);
      const res = await axios.post('http://localhost:8000/extract-text/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setText(res.data.text);
    } catch (err) {
      console.error(err);
      setText('Error extracting text');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 rounded-lg bg-white shadow max-w-md mx-auto mt-10">
      <input type="file" accept="application/pdf" onChange={handleChange} />
      <button onClick={handleUpload} className="ml-2 bg-blue-600 text-white px-4 py-2 rounded">
        {loading ? 'Uploading...' : 'Upload PDF'}
      </button>
      {text && (
        <pre className="mt-4 bg-gray-100 p-2 rounded max-h-64 overflow-y-auto">{text}</pre>
      )}
    </div>
  );
}

export default PdfUploader;
