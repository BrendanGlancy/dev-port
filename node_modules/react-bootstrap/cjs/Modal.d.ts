import React from 'react';
import { BaseModalProps } from 'react-overlays/Modal';
import ModalBody from './ModalBody';
import ModalDialog from './ModalDialog';
import ModalFooter from './ModalFooter';
import ModalHeader from './ModalHeader';
import ModalTitle from './ModalTitle';
import { BsPrefixRefForwardingComponent } from './helpers';
export interface ModalProps extends Omit<BaseModalProps, 'role' | 'renderBackdrop' | 'renderDialog' | 'transition' | 'backdropTransition' | 'children'> {
    size?: 'sm' | 'lg' | 'xl';
    bsPrefix?: string;
    centered?: boolean;
    backdropClassName?: string;
    animation?: boolean;
    dialogClassName?: string;
    contentClassName?: string;
    dialogAs?: React.ElementType;
    scrollable?: boolean;
    [other: string]: any;
}
declare type Modal = BsPrefixRefForwardingComponent<'div', ModalProps> & {
    Body: typeof ModalBody;
    Header: typeof ModalHeader;
    Title: typeof ModalTitle;
    Footer: typeof ModalFooter;
    Dialog: typeof ModalDialog;
    TRANSITION_DURATION: number;
    BACKDROP_TRANSITION_DURATION: number;
};
declare const Modal: Modal;
export default Modal;
