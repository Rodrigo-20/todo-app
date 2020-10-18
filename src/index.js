import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


function TodoItem(props) {
    return (
        <div className='todoItem'>
            <input type='radio' className='todoBox' id={props.index} checked={props.check} onClick={props.handleClick} />
            <label className='todoTask'>{props.task}</label>
        </div>
    )
}

function TodoList(props) {
    const list = props.list;
    const TodoItems = list.map(item => (
        <TodoItem task={item.text} index={item.key} check={item.status} handleClick={props.handleClick} />
    ));

    return (
        TodoItems
    );
}

function AddItem(props) {
    return (
        <div>
            <form onSubmit={props.handleSubmit}>
                <button type="submit">Add</button>
                <input type="text" value={props.value} onChange={props.handleChange}></input>
            </form>
        </div>
    )
}

function AddTaskButton(props) {
    return (
        <button type='button' onClick={props.showForm}>Add Task</button>
    )
}

class TodoApp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            todoList: [
                {
                    text: "take out for walk",
                    key: 1,
                    status: false,
                },
                {
                    text: "clean the floor",
                    key: 2,
                    status: false,
                }
            ],
            newItemText: '',
            showForm: false,

        }
        this.toggleCheck = this.toggleCheck.bind(this);
        this.addItem = this.addItem.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.renderForm = this.renderForm.bind(this);
    }

    toggleCheck(event) {
        const index = event.target.id - 1;
        this.setState(state => ({
            todoList: state.todoList.map((item, itemIndex) => {
                return itemIndex == index ? Object.assign(item, { status: !item.status }) : item;

            })

        }));

    }

    addItem(event) {
        event.preventDefault();
        const newItem = {};
        newItem.text = this.state.newItemText;
        newItem.key = this.state.todoList.length + 1;
        newItem.status = false;
        this.setState(state => ({
            todoList: [...state.todoList, newItem],
            newItemText: '',
            showForm: false,
        }));
        console.log(this.state.todoList);
    }

    handleChange(event) {
        this.setState({
            newItemText: event.target.value
        })
    }

    renderForm() {
        this.setState({
            showForm: true
        })
    }

    render() {
        const addItem = <AddItem handleSubmit={this.addItem} value={this.state.newItemText} handleChange={this.handleChange} />
        return (
            <div id='todoApp' >
                <TodoList list={this.state.todoList} handleClick={this.toggleCheck} />
                {this.state.showForm ? addItem : <AddTaskButton showForm={this.renderForm} />}
            </div>

        )
    }

}


const root = document.querySelector('#root');
ReactDOM.render(<TodoApp />, root);

