import React from 'react';
import { BsPrefixProps, BsPrefixRefForwardingComponent } from './helpers';
declare const InputGroupAppend: BsPrefixRefForwardingComponent<"div", unknown>;
declare const InputGroupPrepend: BsPrefixRefForwardingComponent<"div", unknown>;
declare const InputGroupText: BsPrefixRefForwardingComponent<"span", unknown>;
declare const InputGroupCheckbox: (props: any) => JSX.Element;
declare const InputGroupRadio: (props: any) => JSX.Element;
export interface InputGroupProps extends BsPrefixProps, React.HTMLAttributes<HTMLElement> {
    size?: 'sm' | 'lg';
    hasValidation?: boolean;
}
declare type InputGroup = BsPrefixRefForwardingComponent<'div', InputGroupProps> & {
    Append: typeof InputGroupAppend;
    Prepend: typeof InputGroupPrepend;
    Text: typeof InputGroupText;
    Checkbox: typeof InputGroupCheckbox;
    Radio: typeof InputGroupRadio;
};
/**
 *
 * @property {InputGroupAppend} Append
 * @property {InputGroupPrepend} Prepend
 * @property {InputGroupText} Text
 * @property {InputGroupRadio} Radio
 * @property {InputGroupCheckbox} Checkbox
 */
declare const InputGroup: InputGroup;
export default InputGroup;
