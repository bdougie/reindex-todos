import React, {Component} from 'react';
import Relay from 'react-relay';
import classNames from 'classnames';

import TodoInput from './TodoInput';

import ChangeTodoStatusMutation from '../mutations/ChangeTodoCompleteMutation';
import ChangeTodoTextMutation from '../mutations/ChangeTodoTextMutation';
import DeleteTodoMutation from '../mutations/DeleteTodoMutation';

class Todo extends Component {
  state = {
    isEditing: false,
  }

  handleCompleteChange = () => {
    Relay.Store.commitUpdate(
      new ChangeTodoStatusMutation({
        id: this.props.todo.id,
        complete: !this.props.todo.complete,
      }),
    );
  }

  handleLabelDoubleClick = () => {
    this.setState({
      isEditing: true,
    });
  }

  handleDestroyClick = () => {
    Relay.Store.commitUpdate(
      new DeleteTodoMutation({
        id: this.props.todo.id,
        viewer: this.props.viewer,
      }),
    );
  }

  handleInputSave = (text) => {
    Relay.Store.commitUpdate(
      new ChangeTodoTextMutation({
        id: this.props.todo.id,
        text: text,
      }),
    );
    this.setState({
      isEditing: false,
    });
  }

  handleInputCancel = () => {
    this.setState({
      isEditing: false,
    });
  }

  handleInputDelete = () => {
    this.setState({
      isEditing: false,
    });
  }

  makeInput() {
    if (this.state.isEditing) {
      return (
        <TodoInput className="edit"
                   saveOnBlur={true}
                   initialValue={this.props.todo.text}
                   onSave={this.handleInputSave}
                   onCancel={this.handleInputCancel}
                   onDelete={this.handleInputDelete} />
      );
    } else {
      return null;
    }
  }

  render() {
    return (
      <li className={classNames({
        completed: this.props.todo.complete,
        editing: this.state.isEditing
      })}>
        <div className="view">
          <input checked={this.props.todo.complete}
                 className="toggle"
                 onChange={this.handleCompleteChange}
                 type="checkbox" />
           <label onDoubleClick={this.handleLabelDoubleClick}>
             {this.props.todo.text}
           </label>
          <button className="destroy"
                  onClick={this.handleDestroyClick} />
        </div>
        {this.makeInput()}
      </li>
    );
  }
}

export default Relay.createContainer(Todo, {
  fragments: {
    todo: () => Relay.QL`
      fragment on Todo {
        id,
        text,
        complete
      }
    `,
    viewer: () => Relay.QL`
      fragment on ReindexViewer {
        ${DeleteTodoMutation.getFragment('viewer')}
      }
    `
  }
});
