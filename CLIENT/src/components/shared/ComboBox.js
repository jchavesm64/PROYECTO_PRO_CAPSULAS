import React from 'react';
import { Icon, InputGroup, SelectPicker } from 'rsuite';

const ComboBox = (props) => {
    const { lista } = props;
    return (
        <>
            <InputGroup className="w-75 btn-outline-light">
                <InputGroup.Addon>
                    <Icon icon={props.icon} />
                </InputGroup.Addon>
                <SelectPicker className="w-100"
                    data={lista}
                    appearance="subtle"
                    placeholder={props.title}
                    labelKey={props.filtro}
                    cleanable={false}
                    searchable={props.search}
                    style={{ width: 224 }}
                />
            </InputGroup>

        </>
    );
}

export default ComboBox
