"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(
  async () => {
    const { default: RQ } = await import("react-quill");
    // @ts-ignore - Suppress findDOMNode warning
    const React = await import("react");
    const originalError = console.error;
    console.error = (...args: any[]) => {
      if (
        typeof args[0] === "string" &&
        args[0].includes("findDOMNode")
      ) {
        return;
      }
      originalError.call(console, ...args);
    };
    
    return ({ forwardedRef, ...props }: any) => <RQ ref={forwardedRef} {...props} />;
  },
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-96 bg-gray-100 rounded-lg animate-pulse flex items-center justify-center">
        <p className="text-gray-500">Đang tải trình soạn thảo...</p>
      </div>
    ),
  }
);

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Viết nội dung...",
  className = "",
}: RichTextEditorProps) {
  const [isMounted, setIsMounted] = useState(false);
  const quillRef = useRef<any>(null);

  useEffect(() => {
    setIsMounted(true);
    
    // Dynamically import Quill CSS
    import("react-quill/dist/quill.snow.css");
  }, []);

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ color: [] }, { background: [] }],
      [{ align: [] }],
      ["link", "image", "video"],
      ["blockquote", "code-block"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "color",
    "background",
    "align",
    "link",
    "image",
    "video",
    "blockquote",
    "code-block",
  ];

  if (!isMounted) {
    return (
      <div className="w-full h-96 bg-gray-100 rounded-lg animate-pulse flex items-center justify-center">
        <p className="text-gray-500">Đang tải trình soạn thảo...</p>
      </div>
    );
  }

  return (
    <div className={`rich-text-editor ${className}`}>
      <ReactQuill
        forwardedRef={quillRef}
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        className="bg-white"
      />
      
      <style jsx global>{`
        .rich-text-editor .ql-container {
          min-height: 400px;
          font-size: 16px;
          font-family: inherit;
        }
        .rich-text-editor .ql-editor {
          min-height: 400px;
          line-height: 1.6;
        }
        .rich-text-editor .ql-editor.ql-blank::before {
          color: #9ca3af;
          font-style: normal;
        }
        .rich-text-editor .ql-toolbar {
          border-top-left-radius: 0.5rem;
          border-top-right-radius: 0.5rem;
          background: #f9fafb;
        }
        .rich-text-editor .ql-container {
          border-bottom-left-radius: 0.5rem;
          border-bottom-right-radius: 0.5rem;
        }
      `}</style>
    </div>
  );
}

