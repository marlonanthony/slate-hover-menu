import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Editor } from 'slate-react' 
import { Value } from 'slate' 
import initialValue from './value.json'
import styled from 'react-emotion' 
import { Button, Icon, Menu } from './components' 

const StyledMenu = styled(Menu)`
  padding: 8px 7px 6px;
  postion: absolute;
  z-index: 1;
  top: -10000px;
  left: -10000px;
  margin-top: -6px;
  opacity: 0;
  background-color: #222;
  border-radius: 4px;
  transition: opacity 0.75s;
  width: 120px;
`

class HoverMenu extends Component {
  render() {
    const { className, innerRef } = this.props 
    const root = window.document.getElementById('root') 

    return ReactDOM.createPortal(
      <StyledMenu className={className} innerRef={innerRef}>
        {this.renderMarkButton('bold', <Icon title='bold' className='fa-bold'/>)}
        {this.renderMarkButton('italic', <Icon title='italic' className="fa-italic" />)}
        {this.renderMarkButton('underlined', <Icon title='underline' className='fa-underline' />)}
        {this.renderMarkButton('code', <Icon title='Add a code block' className='fa-code' />)}
      </StyledMenu>,
      root 
    )
  }

  renderMarkButton(type, icon) {
    const { editor } = this.props 
    const { value } = editor 
    const isActive = value.activeMarks.some(mark => mark.type === type)
    return (
      <Button
        reversed
        active={isActive}
        onMouseDown={event => this.onClickMark(event, type)}
      >
        <Icon>{icon}</Icon>
      </Button>
    )
  }

  onClickMark(event, type) {
    const { editor } = this.props 
    event.preventDefault() 
    editor.toggleMark(type) 
  }
}

class App extends Component {
  
  state = {
    value: Value.fromJSON(initialValue)
  }

  componentDidMount = () => {
    this.updateMenu()
  }

  componentDidUpdate = () => {
    this.updateMenu() 
  }

  updateMenu = () => {
    const menu = this.menu
    if(!menu) return 

    const { value } = this.state 
    const { fragment, selection } = value 

    if(selection.isBlurred || selection.isCollapsed || fragment.text === '') {
      menu.removeAttribute('style') 
      return 
    }

    const native = window.getSelection()
    const range = native.getRangeAt(0) 
    const rect = range.getBoundingClientRect() 
    menu.style.opacity = 1
    menu.style.top = `${rect.top + window.pageYOffset - menu.offsetHeight}px`

    menu.style.left = `${rect.left + 
      window.pageXOffset - 
      menu.offsetWidth / 2 + 
      rect.width / 2}px`
  }

  render() {
    return (
      <div>
        <Editor
          placeholder="Enter some text..."
          value={this.state.value}
          onChange={this.onChange}
          renderEditor={this.renderEditor}
          renderMark={this.renderMark}
        />
      </div>
    )
  }

  renderEditor = (props, editor, next) => {
    const children = next()
    return (
      <React.Fragment>
        {children}
        <HoverMenu innerRef={menu => (this.menu = menu)} editor={editor} />
      </React.Fragment>
    )
  }

  renderMark = (props, editor, next) => {
    const { children, mark, attributes } = props

    switch (mark.type) {
      case 'bold':
        return <strong {...attributes}>{children}</strong>
      case 'code':
        return <code {...attributes}>{children}</code>
      case 'italic':
        return <em {...attributes}>{children}</em>
      case 'underlined':
        return <u {...attributes}>{children}</u>
      default:
        return next()
    }
  }

  onChange = ({ value }) => {
    this.setState({ value })
  }
}

export default App;
