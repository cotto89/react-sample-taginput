// import * as React from '@types/react'
declare module "react-input-autosize" {
    interface Props {
        className?: string;
        defaultValue?: any;
        inputClassName?: string;
        inputStyle?: Object;
        minWidth?: string | number;
        onAutosize?: (newWidth: number) => void;
        onChange?: (newValue: string) => void;
        placeholder?: string;
        placeholderIsMinWidth?: boolean;
        style?: Object;
        value?: any
    }

    function Component(props?: Props): any;

    export = Component
}

/*
propTypes: {
		className: React.PropTypes.string,               // className for the outer element
		defaultValue: React.PropTypes.any,               // default field value
		inputClassName: React.PropTypes.string,          // className for the input element
		inputStyle: React.PropTypes.object,              // css styles for the input element
		minWidth: React.PropTypes.oneOfType([            // minimum width for input element
			React.PropTypes.number,
			React.PropTypes.string,
		]),
		onAutosize: React.PropTypes.func,                // onAutosize handler: function(newWidth) {}
		onChange: React.PropTypes.func,                  // onChange handler: function(newValue) {}
		placeholder: React.PropTypes.string,             // placeholder text
		placeholderIsMinWidth: React.PropTypes.bool,     // don't collapse size to less than the placeholder
		style: React.PropTypes.object,                   // css styles for the outer element
		value: React.PropTypes.any,                      // field value
	},
*/