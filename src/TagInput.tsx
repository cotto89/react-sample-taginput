import * as React from 'react';
import * as ReactDOM from 'react-dom';
import AutosizeInput = require('react-input-autosize');

export const util = {
    unique<T>(list: T[]): T[] {
        const uniqueList = new Set(list);
        return Array.from(uniqueList);
    },
};

export interface State {
    caretIndex: number;
    isEditing: boolean;
    position: {
        top: number;
        left: number;
    };
    isSuggestionItemSelecting: boolean;
    selectingSuggestionItemIndex: number;
}

export interface Props {
    value: string;
    placeholder?: string;
    className?: string;
    inputStyle?: Object;
    taglist: string[];
    suggestionList: string[];
    onChange: (value: string, taglist: string[]) => any;
}

export default class TagInput extends React.Component<Props, State> {
    $input: HTMLElement;
    KEY: string;

    constructor(props: Props) {
        super(props);
        this.state = {
            caretIndex: props.taglist.length,
            isEditing: false,
            position: {
                top: 0,
                left: 0,
            },
            isSuggestionItemSelecting: false,
            selectingSuggestionItemIndex: -1,
        };

        this.KEY = `${Date.now()}`;
    }

    setInputRef = (input: HTMLElement) => {
        this.$input = input;
    }

    handleInput = (e: any) => {
        this.props.onChange(
            (e.target.value || ''),
            this.props.taglist
        );
    }
    /*
    keyDownだと日本語入力時Enterを押すと、
    変換確定のEnterにまで影響するのでkeyPressを使っている。
    */
    handleKeyPress = (e: KeyboardEvent) => {
        const {
            caretIndex,
            isSuggestionItemSelecting,
            selectingSuggestionItemIndex,
        } = this.state;
        const { value, taglist, onChange, suggestionList } = this.props;

        if (e.key !== 'Enter') {
            return;
        }

        const newValue = value.trim();

        // newValueを含めた新しいtaglistを作成
        let newTaglist = [...taglist];
        let newTag = newValue;

        // isSuggestionItemSelectingを考慮
        if (isSuggestionItemSelecting) {
            newTag = suggestionList[selectingSuggestionItemIndex];
        }

        newTaglist.splice(caretIndex, 0, newTag);
        newTaglist = util.unique(newTaglist);

        // onChangeで更新
        onChange('', newTaglist);

        // caretIndexを更新
        let newCaretIndex = caretIndex;
        if (newTaglist.length !== taglist.length) {
            newCaretIndex = caretIndex + 1;
        }

        // stateを更新
        this.setState({
            isSuggestionItemSelecting: false,
            selectingSuggestionItemIndex: -1,
            caretIndex: newCaretIndex,
            isEditing: true,
        } as State);
    }

    handleKeyDown = (e: KeyboardEvent) => {
        const {
            isEditing,
            caretIndex,
            selectingSuggestionItemIndex,
        } = this.state;
        const { value, onChange, taglist, suggestionList } = this.props;
        switch (e.key) {
            case 'Backspace':
                e.preventDefault();

                // inputに文字列がある場合、1字を削除する
                if (isEditing && value.length > 0) {
                    const newValue = value.slice(0, -1);
                    onChange(newValue, taglist);
                    return;
                }

                // 一つ前のtag(target)をinput valueにする
                // targetをtaglistから除外してtaglistを更新
                const [target] = taglist.slice(caretIndex - 1);
                const rest = taglist.filter((tag) => tag !== target);
                onChange((target || ''), rest);

                // caretIndexを更新
                this.setState({
                    caretIndex: Math.max(0, caretIndex - 1),
                } as State);
                break;

            case 'ArrowLeft':
                if (value.length > 0) { return; }

                e.preventDefault();
                // caretIndexを左に移動する
                this.setState({
                    caretIndex: Math.max(0, caretIndex - 1),
                } as State);
                break;

            case 'ArrowRight':
                if (value.length > 0) { return; }

                e.preventDefault();
                // caretIndexを右に移動する
                this.setState({
                    caretIndex: Math.min(caretIndex + 1, taglist.length),
                } as State);
                break;

            case 'ArrowUp':
                e.preventDefault();
                if (!isEditing || suggestionList.length < 1) {
                    return;
                }

                // isSuggestionItemSelecting: true;
                // selectingSuggestionItemIndexを更新;
                let nextIndex = selectingSuggestionItemIndex - 1;

                if (nextIndex < 0) {
                    nextIndex = suggestionList.length - 1;
                }

                this.setState({
                    isSuggestionItemSelecting: true,
                    selectingSuggestionItemIndex: nextIndex,
                } as State);

                break;

            case 'ArrowDown':
                e.preventDefault();
                if (!isEditing || suggestionList.length < 1) {
                    return;
                }

                // isSuggestionItemSelecting: true;
                // selectingSuggestionItemIndexを更新;
                let nextIdx = selectingSuggestionItemIndex + 1;

                if (nextIdx >= suggestionList.length) {
                    nextIdx = 0;
                }

                this.setState({
                    isSuggestionItemSelecting: true,
                    selectingSuggestionItemIndex: nextIdx,
                } as State);
                break;

            case 'Escape':
                this.blur();
                break;

            default:
                break;
        }
    }

    focus = () => {
        if (this.$input) {
            this.$input.focus();
            const position = this.calcSuggestionListPosition();

            this.setState({
                isEditing: true,
                position: position,
            } as State);
        }
    }

    blur = () => {
        const { onChange, taglist } = this.props;

        this.$input.blur();

        onChange('', taglist);


        this.setState({
            caretIndex: this.props.taglist.length,
            isEditing: false,
            position: {
                top: 0,
                left: 0,
            },
            isSuggestionItemSelecting: false,
            selectingSuggestionItemIndex: -1,
        } as State);
    }

    componentDidMount() {
        this.updateSuggestionListPosition();
    }
    componentDidUpdate(prevProps: Props, prevState: State) {
        if (this.props.taglist.length !== prevProps.taglist.length) {
            return this.updateSuggestionListPosition();
        }

        if (this.state.caretIndex !== prevState.caretIndex) {
            return this.updateSuggestionListPosition();
        }
    }

    updateSuggestionListPosition() {
        if (!this.$input) { return; }

        const position = this.calcSuggestionListPosition();
        this.setState({ position } as any);
    }

    calcSuggestionListPosition() {
        if (!this.$input) { return this.state.position; }

        const rect = ReactDOM.findDOMNode(this.$input).getBoundingClientRect();

        return {
            top: Math.floor(rect.bottom),
            left: Math.floor(rect.left),
        };
    }

    renderTagWithInput() {
        const { taglist, value, placeholder, inputStyle } = this.props;
        const { caretIndex, isEditing } = this.state;

        if (taglist.includes(this.KEY)) {
            this.KEY = `${Date.now()}`;
        }

        const Taglist = taglist.map((tag) => (
            <div
                className='Tag'
                key={tag}>{tag}
            </div>
        ));


        Taglist.splice(
            caretIndex,
            0,
            <AutosizeInput
                placeholder={placeholder}
                inputStyle={inputStyle}
                className='AutosizeInput'
                value={value}
                ref={this.setInputRef}
                key={this.KEY}
                autoFocus={isEditing}
                onInput={this.handleInput} />
        );

        return Taglist;
    }

    renderSuggestList() {
        const { suggestionList } = this.props;
        const { isEditing, selectingSuggestionItemIndex, position} = this.state;

        if (!isEditing || suggestionList.length < 1) { return; }

        const cName = {
            default: 'SuggestionList__item',
            carrent: 'SuggestionList__item SuggestionList__item--current',
        };

        const style = {
            position: 'absolute',
            top: position.top,
            left: position.left,
        };

        return (
            <ul className='SuggestionList' style={style}>
                {
                    suggestionList.map((tag, i) => (
                        <li
                            className={selectingSuggestionItemIndex === i ? cName.carrent : cName.default}
                            key={tag}>{tag}</li>
                    ))
                }
            </ul>
        );
    }

    render() {
        return (
            <div className='ReactTagInput'
                onClick={this.focus}
                onBlur={this.blur}
                onKeyPress={this.handleKeyPress as any}
                onKeyDown={this.handleKeyDown as any} >
                <div className='Taglist'>
                    {this.renderTagWithInput()}
                </div>
                {this.renderSuggestList()}
            </div>
        );
    }
}
