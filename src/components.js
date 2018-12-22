import React from 'react'
import styled from 'react-emotion'

export const Button = styled('i')`
  cursor: pointer;
  color: ${props =>
    props.reversed
      ? props.active ? 'white' : '#aaa'
      : props.active ? 'black' : '#ccc'};
`

export const Icon = styled(({ className, ...rest }) => {
  return <i className={`fas ${className}`} {...rest}/>
  // return <span className={`material-icons ${className}`} {...rest} />
})`
  font-size: 14px;
  vertical-align: text-bottom;
  padding: 2px 0;
`

export const Menu = styled('div')`
  & > * {
    display: inline-block;
  }
  & > * + * {
    margin-left: 15px;
  }
`

export const Toolbar = styled(Menu)`
  position: relative;
  padding: 1px 18px 17px;
  margin: 0 -20px;
  border-bottom: 2px solid #eee;
  margin-bottom: 20px;
`