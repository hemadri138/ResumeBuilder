"use client";

import React from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import { Skeleton } from './skeleton';
import type { ReactQuillProps } from 'react-quill';

// This is a workaround for the issue with react-quill and React 19's removal of findDOMNode.
// We dynamically import ReactQuill and wrap it in a component that forwards the ref correctly.
const ReactQuill = dynamic(
  async () => {
    const { default: RQ } = await import('react-quill');
    // The wrapper component receives a 'forwardedRef' prop and passes it to the 'ref' of the actual ReactQuill component.
    // eslint-disable-next-line react/display-name
    return ({ forwardedRef, ...props }: { forwardedRef: React.Ref<any> } & ReactQuillProps) => (
      <RQ ref={forwardedRef} {...props} />
    );
  },
  {
    ssr: false,
    loading: () => <Skeleton className="h-[120px] w-full" />,
  }
);


interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  [key: string]: any; // Allow other props from react-hook-form's field
}

const RichTextEditor = React.forwardRef<any, RichTextEditorProps>(
  ({ value, onChange, placeholder, ...rest }, ref) => {
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
      <div className="rich-text-editor bg-background">
        <ReactQuill
          forwardedRef={ref}
          theme="snow"
          value={value}
          onChange={onChange}
          modules={modules}
          formats={formats}
          placeholder={placeholder}
          {...rest}
        />
      </div>
    );
  }
);

RichTextEditor.displayName = 'RichTextEditor';

export { RichTextEditor };
