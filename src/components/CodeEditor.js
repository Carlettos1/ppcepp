import React, { useEffect, useRef, useState } from 'react';
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/ext-language_tools";
import axios from 'axios';
const API_IP = process.env.REACT_APP_API_IP;

const CodeEditor = ({ code, setCode, test, question_id }) => {
    const lastEventRef = useRef(new Date().getTime());

    useEffect(() => {
        if (!test) {
            return;
        }
        
        const stopPaste = function (e) {
            const now = new Date().getTime();
            if (now - lastEventRef.current > 1000) {
                console.log("Preventing and notifying on: " + e.type);
                lastEventRef.current = now;
                axios.post(`${API_IP}/cheat_log`, {
                    user_id: localStorage.getItem('user_id'),
                    action: 2, // 2 = copy/paste/cut, 1 = switching tab, 0 = losing focus
                    context: e.type + ": " + e.clipboardData.getData("text/plain").substring(0, 300),
                });
            }
            e.stopPropagation();
            e.preventDefault();
        };

        const stopCopy = function (e) {
            const now = new Date().getTime();
            if (now - lastEventRef.current > 1000) {
                console.log("Preventing and notifying on: " + e.type);
                lastEventRef.current = now;
                axios.post(`${API_IP}/cheat_log`, {
                    user_id: localStorage.getItem('user_id'),
                    action: 2, // 2 = copy/paste/cut, 1 = switching tab, 0 = losing focus
                    context: e.type + ": " + window.getSelection().toString().substring(0, 300),
                });
            }
            e.stopPropagation();
            e.preventDefault();
        };

        document.addEventListener("copy", stopCopy, true);
        document.addEventListener("paste", stopPaste, true);
        document.addEventListener("cut", stopCopy, true);

        return () => {
            document.removeEventListener("copy", stopCopy, true);
            document.removeEventListener("paste", stopPaste, true);
            document.removeEventListener("cut", stopCopy, true);
        };
    }, []);


    return (
        <div class="block" data-questionid={question_id}>
        <AceEditor
            placeholder="# print('Hola Mundo')"
            mode="python"
            theme="monokai"
            name="practica" 
            width="100%"
            value={code}
            onChange={(newValue) => {setCode(newValue);}}
            fontSize={20}
            lineHeight={22}
            showPrintMargin={false}
            showGutter={true}
            highlightActiveLine={true}
            setOptions={{
                enableBasicAutocompletion: true,
                enableLiveAutocompletion: true,
                enableSnippets: false,
                enableMobileMenu: true,
                showLineNumbers: true,
                dragEnabled: false,
                tabSize: 2,
            }}
            /*commands={
                // Prevents copy/paste/cut
                test ? [{
                    name: "copy_paste",
                    bindKey: {win: "ctrl-c|ctrl-v|ctrl-x|ctrl-shift-v|shift-del", mac: "cmd-c|cmd-v|cmd-x"},
                    exec: function(editor, a) {
                        console.log("Preventing copy/paste/cut on ace_editor");
                        
                        return;
                        // send report to api_ip/cheat_log
                        axios.post(`${API_IP}/cheat_log`, {
                            user_id: localStorage.getItem('user_id'),
                            action: 2, // 2 = copy/paste/cut, 1 = switching tab, 0 = losing focus
                            context: navigator.clipboard.readText(),
                        });
                        // clear clipboard
                        navigator.clipboard.writeText("");
                    }
                }
            ] : undefined}*/
        />
        </div>
    );
};

export default CodeEditor;