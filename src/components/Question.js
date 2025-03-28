import CodePlatform from "../CodePlatform";
import CodeExample from "./CodeExample";

const Question = ({title, question, example, test, question_id}) => {
    return (
    <div class="block">
        <div class="columns">
            <div class="column is-2"></div>
            <div class="column is-8">
                <div class="content box">
                    <h1>{title}</h1>
                    <p>{question}</p>
                    <CodeExample code={example}/>
                </div>
                <CodePlatform test={test} question_id={question_id}/>
            </div>
            <div class="column is-2"></div>
        </div>
        <hr class="block" style={{"height": "2px"}}/>
    </div>);
};

export default Question;