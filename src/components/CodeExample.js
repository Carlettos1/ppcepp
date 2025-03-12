import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/ext-language_tools";

const CodeExample = ({code}) => {
    if (String(code).length === 0) {
        return (<div></div>);
    }
    return (
        <div class="block">
        <AceEditor
            mode="python"
            theme="monokai"
            name="example" 
            width="100%"
            value={code}
            fontSize={14}
            onPaste={(paster) => console.log(paster)}
            lineHeight={19}
            showPrintMargin={false}
            height={"" + String(code).split("\n").length * 19 + "px"}
            setOptions={{
                readOnly: true,
                highlightActiveLine: false,
                highlightGutterLine: false,
                cursorStyle: "slim"
            }}
        />
        </div>
    );
}

export default CodeExample;