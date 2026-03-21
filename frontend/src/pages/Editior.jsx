import React, { useEffect, useState } from 'react';
import EditiorNavbar from '../components/EditiorNavbar';
import Editor from '@monaco-editor/react';
import { MdLightMode } from 'react-icons/md';
import { AiOutlineExpandAlt } from "react-icons/ai";
import { FiSave, FiCheck } from 'react-icons/fi';
import { api_base_url } from '../helper';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { toast } from 'react-toastify';

const Editior = () => {
  const { isLightMode, toggleTheme } = useTheme();
  const [tab, setTab] = useState("html");
  const [isExpanded, setIsExpanded] = useState(false);
  const [showFrame, setShowFrame] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [htmlCode, setHtmlCode] = useState("<h1>Hello world</h1>");
  const [cssCode, setCssCode] = useState("body { background-color: #f4f4f4; }");
  const [jsCode, setJsCode] = useState("// some comment");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);

  const { projectID } = useParams();
  const navigate = useNavigate();

  const run = () => {
    const html = htmlCode;
    const css = `<style>${cssCode}</style>`;
    const js = `<script>${jsCode}</script>`;
    const iframe = document.getElementById("iframe");

    if (iframe) {
      iframe.srcdoc = html + css + js;
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      run();
    }, 300);
    return () => clearTimeout(timer);
  }, [htmlCode, cssCode, jsCode]);

  useEffect(() => {
    run();
  }, [showFrame, isMobile, isExpanded]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    setIsLoading(true);
    fetch(api_base_url + "/getProject", {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userId: localStorage.getItem("userId"),
        projId: projectID
      })
    })
      .then(res => res.json())
      .then(data => {
        setIsLoading(false);
        if (data.success) {
          setHtmlCode(data.project.htmlCode || "<h1>Hello world</h1>");
          setCssCode(data.project.cssCode || "body { background-color: #f4f4f4; }");
          setJsCode(data.project.jsCode || "// some comment");
        } else {
          toast.error("Failed to load project");
          navigate("/");
        }
      })
      .catch(err => {
        setIsLoading(false);
        toast.error("Error loading project");
        console.error(err);
        navigate("/");
      });
  }, [projectID, navigate]);

  const downloadCode = () => {
    const html = htmlCode;
    const css = `<style>${cssCode}</style>`;
    const js = `<script>${jsCode}</script>`;
    const fullDoc = `<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width, initial-scale=1.0">\n<title>Easy Code Output</title>\n${css}\n</head>\n<body>\n${html}\n${js}\n</body>\n</html>`;

    const blob = new Blob([fullDoc], { type: 'text/html' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'easycode-output.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const saveProject = () => {
    setIsSaving(true);
    fetch(api_base_url + "/updateProject", {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userId: localStorage.getItem("userId"),
        projId: projectID,
        htmlCode: htmlCode,
        cssCode: cssCode,
        jsCode: jsCode
      })
    })
    .then(res => res.json())
    .then(data => {
      setIsSaving(false);
      if (data.success) {
        setLastSaved(new Date());
        toast.success("Project saved successfully!");
      } else {
        toast.error(data.message || "Failed to save project");
      }
    })
    .catch((err) => {
      setIsSaving(false);
      console.error("Error saving project:", err);
      toast.error("Failed to save project. Please try again.");
    });
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.key === 's') {
        event.preventDefault();
        saveProject();
      }
    };
  
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [projectID, htmlCode, cssCode, jsCode]);

  if (isLoading) {
    return (
      <>
        <EditiorNavbar />
        <div className="flex items-center justify-center h-[calc(100vh-72px)]">
          <div className="text-center">
            <div className="spinner mx-auto mb-4"></div>
            <p className="text-muted">Loading project...</p>
          </div>
        </div>
      </>
    );
  }

  const isEditorMode = !isMobile || !showFrame;
  const isPreviewMode = showFrame && (isMobile || !isExpanded);
  const editorClass = isExpanded ? 'w-full' : 'w-full lg:w-1/2';
  const previewClass = isMobile ? 'w-full' : 'w-full lg:w-1/2';
  const iframeClass = 'w-full h-[calc(100vh-72px)] bg-white';

  return (
    <>
      <EditiorNavbar
        onDownload={downloadCode}
        onToggleView={() => setShowFrame(prev => !prev)}
        showFrame={showFrame}
      />
      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-72px)] overflow-hidden">
        <div className={`${isEditorMode ? 'block' : 'hidden'} ${editorClass} h-full overflow-hidden`}>        
          <div className="tabs flex flex-wrap items-center justify-between gap-2 w-full bg-[rgba(30,41,59,0.8)] backdrop-blur-xl border-b border-[rgba(148,163,184,0.1)] h-auto min-h-[56px] container-padding">
            <div className="tabs flex flex-wrap items-center gap-2">
              <div onClick={() => { setTab("html"); }} className={`tab cursor-pointer py-2 px-3 sm:px-4 bg-[rgba(30,41,59,0.6)] border border-[rgba(148,163,184,0.1)] text-xs sm:text-sm font-medium rounded-lg hover:bg-[rgba(34,211,238,0.1)] hover:border-[rgba(34,211,238,0.3)] hover:text-[#22d3ee] transition-all duration-200 ${tab === 'html' ? '!bg-[rgba(34,211,238,0.15)] !border-[rgba(34,211,238,0.4)] !text-[#22d3ee]' : 'text-[#94a3b8]'}`}>HTML</div>
              <div onClick={() => { setTab("css"); }} className={`tab cursor-pointer py-2 px-3 sm:px-4 bg-[rgba(30,41,59,0.6)] border border-[rgba(148,163,184,0.1)] text-xs sm:text-sm font-medium rounded-lg hover:bg-[rgba(34,211,238,0.1)] hover:border-[rgba(34,211,238,0.3)] hover:text-[#22d3ee] transition-all duration-200 ${tab === 'css' ? '!bg-[rgba(34,211,238,0.15)] !border-[rgba(34,211,238,0.4)] !text-[#22d3ee]' : 'text-[#94a3b8]'}`}>CSS</div>
              <div onClick={() => { setTab("js"); }} className={`tab cursor-pointer py-2 px-3 sm:px-4 bg-[rgba(30,41,59,0.6)] border border-[rgba(148,163,184,0.1)] text-xs sm:text-sm font-medium rounded-lg hover:bg-[rgba(34,211,238,0.1)] hover:border-[rgba(34,211,238,0.3)] hover:text-[#22d3ee] transition-all duration-200 ${tab === 'js' ? '!bg-[rgba(34,211,238,0.15)] !border-[rgba(34,211,238,0.4)] !text-[#22d3ee]' : 'text-[#94a3b8]'}`}>JS</div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <button 
                onClick={saveProject}
                disabled={isSaving}
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-[rgba(34,211,238,0.1)] border border-[rgba(34,211,238,0.3)] text-[#22d3ee] rounded-lg text-xs font-medium hover:bg-[rgba(34,211,238,0.2)] transition-all duration-200 disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <div className="spinner !w-3 !h-3 !border-2"></div>
                    <span>Saving...</span>
                  </>
                ) : lastSaved ? (
                  <>
                    <FiCheck />
                    <span>Saved</span>
                  </>
                ) : (
                  <>
                    <FiSave />
                    <span>Save</span>
                  </>
                )}
              </button>
              <i className="text-xl sm:text-[22px] cursor-pointer text-[#94a3b8] hover:text-[#22d3ee] transition-colors duration-200" onClick={toggleTheme}><MdLightMode /></i>
              <i className="text-xl sm:text-[22px] cursor-pointer text-[#94a3b8] hover:text-[#22d3ee] transition-colors duration-200" onClick={() => { setIsExpanded(!isExpanded); }}><AiOutlineExpandAlt /></i>
            </div>
          </div>

          {tab === "html" ? (
            <Editor
              onChange={(value) => {
                setHtmlCode(value || "");
              }}
              height="calc(100vh - 128px)"
              theme={isLightMode ? "vs-light" : "vs-dark"}
              language="html"
              value={htmlCode}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                automaticLayout: true,
              }}
            />
          ) : tab === "css" ? (
            <Editor
              onChange={(value) => {
                setCssCode(value || "");
              }}
              height="calc(100vh - 128px)"
              theme={isLightMode ? "vs-light" : "vs-dark"}
              language="css"
              value={cssCode}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                wordWrap: 'on',
                wrappingIndent: 'indent',
                automaticLayout: true,
              }}
            />
          ) : (
            <Editor
              onChange={(value) => {
                setJsCode(value || "");
              }}
              height="calc(100vh - 128px)"
              theme={isLightMode ? "vs-light" : "vs-dark"}
              language="javascript"
              value={jsCode}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: 'on',
                scrollBeyondLastLine: false,                wordWrap: 'on',
                wrappingIndent: 'indent',                automaticLayout: true,
              }}
            />
          )}
        </div>

        <div className={`${isPreviewMode ? 'block' : 'hidden'} ${previewClass}`}>
          <iframe
            id="iframe"
            className={iframeClass}
            title="output"
          />
        </div>
      </div>
    </>
  );
};

export default Editior;
