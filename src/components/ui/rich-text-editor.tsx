"use client";

import React from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import { Skeleton } from './skeleton';

const ReactQuill = dynamic(
  () => import('react-quill'), 
  { 
    ssr: false,
    loading: () => <Skeleton className="h-[120px] w-full" /> 
  }
);

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const RichTextEditor = React.forwardRef<any, RichTextEditorProps>(
  ({ value, onChange, placeholder }, ref) => {
    const modules = {
      toolbar: [
        [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
        [{size: []}],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{'list': 'ordered'}, {'list': 'bullet'}, 
         {'indent': '-1'}, {'indent': '+1'}],
        ['link'],
        [{ 'color': [] }, { 'background': [] }],
        ['clean'],
      ],
    };

    const formats = [
      'header', 'font', 'size',
      'bold', 'italic', 'underline', 'strike', 'blockquote',
      'list', 'bullet', 'indent',
      'link', 'color', 'background'
    ];

    return (
      <div className="bg-background">
        <ReactQuill
          ref={ref}
          theme="snow"
          value={value}
          onChange={onChange}
          modules={modules}
          formats={formats}
          placeholder={placeholder}
          className="rich-text-editor"
        />
      </div>
    );
  }
);

RichTextEditor.displayName = 'RichTextEditor';

export { RichTextEditor };
