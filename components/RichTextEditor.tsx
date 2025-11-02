"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { EditorState, convertToRaw, ContentState } from "draft-js";
// @ts-ignore - No types available
import draftToHtml from "draftjs-to-html";
// @ts-ignore - No types available
import htmlToDraft from "html-to-draftjs";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

const Editor = dynamic(
  () => import("react-draft-wysiwyg").then((mod) => mod.Editor),
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
  const [editorState, setEditorState] = useState<EditorState>(
    EditorState.createEmpty()
  );
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (value && isMounted) {
      const contentBlock = htmlToDraft(value);
      if (contentBlock) {
        const contentState = ContentState.createFromBlockArray(
          contentBlock.contentBlocks
        );
        const newEditorState = EditorState.createWithContent(contentState);
        setEditorState(newEditorState);
      }
    }
  }, [value, isMounted]);

  const onEditorStateChange = (newEditorState: EditorState) => {
    setEditorState(newEditorState);
    const html = draftToHtml(convertToRaw(newEditorState.getCurrentContent()));
    onChange(html);
  };

  if (!isMounted) {
    return (
      <div className="w-full h-96 bg-gray-100 rounded-lg animate-pulse flex items-center justify-center">
        <p className="text-gray-500">Đang tải trình soạn thảo...</p>
      </div>
    );
  }

  return (
    <div className={`rich-text-editor ${className}`}>
      <Editor
        editorState={editorState}
        onEditorStateChange={onEditorStateChange}
        placeholder={placeholder}
        toolbar={{
          options: [
            "inline",
            "blockType",
            "fontSize",
            "fontFamily",
            "list",
            "textAlign",
            "colorPicker",
            "link",
            "image",
            "history",
          ],
          inline: {
            options: ["bold", "italic", "underline", "strikethrough"],
          },
          blockType: {
            options: [
              "Normal",
              "H1",
              "H2",
              "H3",
              "H4",
              "H5",
              "H6",
              "Blockquote",
              "Code",
            ],
          },
          fontFamily: {
            options: [
              "Arial",
              "Georgia",
              "Times New Roman",
              "Verdana",
              "Tahoma",
              "Courier New",
              "Roboto",
              "Open Sans",
              "Lato",
              "Montserrat",
            ],
            className: undefined,
            component: undefined,
            dropdownClassName: undefined,
          },
          list: {
            options: ["unordered", "ordered"],
          },
        }}
        editorClassName="editor-content"
        wrapperClassName="editor-wrapper"
        toolbarClassName="editor-toolbar"
      />

      <style jsx global>{`
        .rich-text-editor .editor-wrapper {
          border: 1px solid #d1d5db;
          border-radius: 0.5rem;
          overflow: hidden;
        }
        .rich-text-editor .editor-toolbar {
          background: #f9fafb;
          border: none;
          border-bottom: 1px solid #d1d5db;
          padding: 8px;
        }
        .rich-text-editor .editor-content {
          min-height: 400px;
          padding: 16px;
          font-size: 16px;
          line-height: 1.6;
          font-family: inherit;
        }
        .rich-text-editor .rdw-option-wrapper {
          background: white;
          border: 1px solid #d1d5db;
          margin: 0 2px;
          border-radius: 4px;
        }
        .rich-text-editor .rdw-option-wrapper:hover {
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        .rich-text-editor .rdw-option-active {
          background: #3b82f6;
          color: white;
        }
        .rich-text-editor .rdw-dropdown-wrapper {
          background: white;
          border: 1px solid #d1d5db;
          border-radius: 4px;
        }
        .rich-text-editor .public-DraftEditorPlaceholder-root {
          color: #9ca3af;
        }
      `}</style>
    </div>
  );
}
