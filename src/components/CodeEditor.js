import React from 'react';
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/ext-language_tools";

const CodeEditor = ({ code, setCode }) => {
    return (
        <AceEditor  
            placeholder="# print('Hola Mundo')"
            mode="python"
            theme="monokai"
            name="blah2" 
            width="90%"
            onChange={(newValue) => setCode(newValue)}
            fontSize={14}
            lineHeight={19}
            showPrintMargin={true}
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
        />
    );
};

export default CodeEditor;