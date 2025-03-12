import React, { useEffect } from 'react';
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/ext-language_tools";

const CodeEditor = ({ code, setCode, test }) => {
    // Prevents right-click copy/paste/cut
    useEffect(() => {
        if (!test) {
            return;
        }
        const stop = function(e) {
            e.stopPropagation();
            e.preventDefault();
        };
        document.querySelectorAll(".ace_editor").forEach((e) => e.addEventListener("copy", stop, true));
        document.querySelectorAll(".ace_editor").forEach((e) => e.addEventListener("paste", stop, true));
        document.querySelectorAll(".ace_editor").forEach((e) => e.addEventListener("cut", stop, true));
    }, [ ]);

    return (
        <div class="block">
        <AceEditor  
            placeholder="# print('Hola Mundo')"
            mode="python"
            theme="monokai"
            name="practica" 
            width="100%"
            onChange={(newValue) => {setCode(newValue);}}
            fontSize={14}
            lineHeight={19}
            showPrintMargin={false}
            showGutter={true}
            highlightActiveLine={true}
            setOptions={{
                enableBasicAutocompletion: true,
                enableLiveAutocompletion: true,
                enableSnippets: false,
                enableMobileMenu: true,
                showLineNumbers: true,
                tabSize: 2,
            }}
            commands={
                // Prevents copy/paste/cut
                test ? [{
                    name: "copy_paste",
                    bindKey: {win: "ctrl-c|ctrl-v|ctrl-x|ctrl-shift-v|shift-del", mac: "cmd-c|cmd-v|cmd-x"},
                    exec: function() {}
                }
            ] : undefined}
        />
        </div>
    );
};

export default CodeEditor;