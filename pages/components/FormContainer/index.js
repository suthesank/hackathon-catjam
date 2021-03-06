import React, { useState } from 'react'
import styled from '@emotion/styled'
import BarcodeComponent from '../BarcodeComponent'
import Loader from '../Loader'

import {
  flexBetween,
  formContainer,
  formLabel,
  inputField,
  InputGroup,
  classError,
  getQrButton,
  textField,
} from './style'

const FormContainer = () => {
  const data = {
    first_name: '',
    last_name: '',
    address_line_1: '',
    address_line_2: '',
    city: 'Cyberjaya',
    state: 'Selangor',
    zip: '63000',
    country: 'Malaysia',
    phone: {
      mobile: '',
      work: '',
    },
    email: '',
    company: '',
    designation: '',
  }
  const [isLoading, setLoading] = useState(true)
  const [state, setState] = React.useState(data)
  const [qr_url, setQrUrl] = useState('')
  const [gif_url, setGif] = React.useState()
  const [firstName, setFirstNameErrorState] = React.useState(false)
  const [lastName, setLastNameErrorState] = React.useState(false)
  const [email, setEmailErrorState] = React.useState(false)

  React.useEffect(() => {
    getImage('CatJam')
  }, [])

  const getImage = (name) => {
    fetch('https://cataas.com/cat/gif/says/' + `${name}`)
      .then((res) => res)
      .then(({ url = '', error }) => {
        if (error) throw new Error(error)
        setGif(url)
        setLoading(false)
      })
  }

  const handleGetQr = (state) => {
    setLoading(true)
    getImage(state.first_name)
    let getQr = {
      method: 'POST',
      body: JSON.stringify(state),
    }
    fetch('api/get_qr', getQr)
      .then((response) => response.json())
      .then((data) => {
        setQrUrl(data.qr_url)

        setLoading(false)
      })
  }

  const onChange = (name) => (value) => {
    if (name === 'work' || name === 'mobile') {
      setState({
        ...state,
        phone: {
          ...state.phone,
          [name]: value,
        },
      })
      return
    }
    setState({
      ...state,
      [name]: value,
    })
  }

  return (
    <div className={flexBetween}>
      <div className={formContainer}>
        <InputField
          label="First Name"
          placeholder="Enter first name"
          onChange={onChange('first_name')}
          value={state.first_name}
          block
          error="First name required"
          errorState={firstName}
          setState={setFirstNameErrorState}
          regex={!(state.first_name.length > 0)}
        />

        <InputField
          label="Last Name"
          placeholder="Enter last name"
          onChange={onChange('last_name')}
          value={state.last_name}
          block
          error="Last name required"
          errorState={lastName}
          setState={setLastNameErrorState}
          regex={!(state.last_name.length > 0)}
        />
        <div className={flexBetween}>
          <InputField
            label="Address Line 1"
            placeholder="Enter address line 1"
            type="textarea"
            onChange={onChange('address_line_1')}
            value={state.address_line_1}
            error="Address reuired"
          />
          <InputField
            label="Address Line 2"
            placeholder="Enter address line 2"
            type="textarea"
            onChange={onChange('address_line_2')}
            value={state.address_line_2}
            error="Address reuired"
          />
        </div>
        <div className={flexBetween}>
          <InputField
            label="Work Number"
            placeholder="Enter Work Number"
            onChange={onChange('work')}
            value={state.phone.work}
            error="Work Number Required"
          />
          <InputField
            label="Mobile Number"
            placeholder="Enter Mobile Number"
            onChange={onChange('mobile')}
            value={state.phone.mobile}
            error="Mobile Number Required"
          />
        </div>
        <InputField
          label="Email"
          placeholder="example@example.com"
          onChange={onChange('email')}
          regex={!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(state.email)}
          value={state.email}
          block
          error="Email Required"
          errorState={email}
          setState={setEmailErrorState}
        />
        <InputField
          label="Company"
          placeholder="e.g. Microsoft"
          onChange={onChange('company')}
          value={state.company}
          block
          error="Company Name Required"
        />
        <InputField
          label="Designation"
          placeholder="e.g. Software Engineer"
          onChange={onChange('designation')}
          value={state.designation}
          block
          error="Designation Required"
        />
        <button className={getQrButton} onClick={() => handleGetQr(state)}>
          Generate QR
        </button>
      </div>
      <BarcodeComponent qr_url={qr_url} gif={gif_url} />
      {isLoading ? <Loader /> : ''}
    </div>
  )
}

export default FormContainer

const StyledWrapper = styled.div`
  ${InputGroup};
`

const InputField = (props) => {
  const {
    label,
    placeholder,
    type = 'text',
    onChange = () => [],
    value = '',
    error = error.target.value,
    block = false,
    regex,
    errorState,
    setState,
  } = props
  return (
    <StyledWrapper width={block ? 100 : 45}>
      <span className={formLabel}>{label}</span>
      {type === 'text' && (
        <input
          type="text"
          placeholder={placeholder}
          className={inputField}
          onChange={({ target: { value } }) => {
            console.log(regex)
            if (label == 'Email') {
              if (regex) {
                console.log('set true')
                setState(true)
              } else {
                setState(false)
              }
            }

            if (label == 'First Name') {
              if (regex) {
                console.log('set true')
                setState(true)
              } else {
                setState(false)
              }
            }

            if (label == 'Last Name') {
              if (regex) {
                console.log('set true')
                setState(true)
              } else {
                setState(false)
              }
            }

            onChange(value)
          }}
          value={value}
        />
      )}
      {type === 'textarea' && (
        <textarea
          type="text"
          placeholder={placeholder}
          className={textField}
          onChange={({ target: { value } }) => {
            onChange(value)
          }}
          value={value}
        />
      )}
      {/* {console.log(error)} */}
      {console.log(errorState)}

      {!!errorState ? <span className={classError}>{error}</span> : ''}
    </StyledWrapper>
  )
}
