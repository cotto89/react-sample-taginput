import * as React from 'react';
import * as ReactDOM from 'react-dom';
import TagInput from './../../src/TagInput';

const allTag = [
    'JavaScript',
    'HTML',
    'CSS',
    'C',
    'C++',
    'C#',
    'Java',
    'PHP',
    'Objective-C',
    'Ruby',
    'Python',
    'Swift',
    'Go',
    'R',
    'XML',
];

function suggest(text: string, list: string[]) {
    const LIST = list.map((tag) => tag.toUpperCase());

    return allTag.filter((tag) => {
        const TAG = tag.toUpperCase();
        const TEXT = text.toUpperCase();

        if (TEXT.length < 1 || LIST.includes(TAG)) {
            return;
        }

        return TAG.indexOf(TEXT) >= 0;
    });
}

interface State {
    inputText: string;
    taglist: string[];
    suggestionList: string[];
}

class App extends React.Component<{}, State> {
    constructor() {
        super();
        this.state = {
            inputText: '',
            taglist: [],
            suggestionList: [],
        };
    }

    handleChange = (newValue: string, newTagList: string[]) => {
        this.setState((state) => Object.assign({}, state, {
            taglist: newTagList,
            suggestionList: suggest(newValue, newTagList),
            inputText: newValue,
        }));
    }

    render() {
        const props = {
            placeholder: this.state.taglist.length < 1 ? 'Programming Language' : '',
            value: this.state.inputText,
            taglist: this.state.taglist,
            onChange: this.handleChange,
            suggestionList: this.state.suggestionList,
        };

        return (
            <div>
                <TagInput {...props} />
            </div>
        );
    }
}

document.addEventListener('DOMContentLoaded', () => {
    ReactDOM.render(<App />, document.querySelector('#app'));
});
