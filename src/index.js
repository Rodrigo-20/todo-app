import React from 'react';
import ReactDOM from 'react-dom';
import { Component } from 'react';
import Calendar from 'react-calendar';
import './style.scss';
import 'react-calendar/dist/Calendar.css';
import formatDistance from 'date-fns/formatDistance';
import diferenceInDays from 'date-fns/differenceInDays';


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
    const TodoItems = Object.values(list.reduce((obj, items) => {
        if (!(items.dateHead in obj)) {
            obj[items.dateHead] = new Array(items);
        }
        else { obj[items.dateHead].push(items) }
        return obj;
    }, {})).map(item => <div className='perDay'>
        <h2>{item[0].dateHead}</h2>
        {item.map(todo => < TodoItem check={todo.status} task={todo.text} index={todo.key} handleClick={props.handleClick} />)}
    </div>)

    return (
        TodoItems
    );
}

function AddItem(props) {
    return (
        <div className='addForm'>
            <form onSubmit={props.handleSubmit}>
                <input type="text" value={props.value} onChange={props.handleChange}></input>
                < div className='buttons'>
                    <button type="submit" disabled={props.disabled}>Add</button>
                    <button type='button' onClick={props.displayCalendar}>Today</button>
                </div>
            </form>
        </div>
    )
}

function AddTaskButton(props) {
    return (
        <button type='button' onClick={props.showForm}>Add Task</button>
    )
}

function Header() {
    return (
        <div className='header'>
            <h1>Todo List</h1>
        </div>
    )
}



function MyCalendar(props) {
    return (
        <div className='calendar'>
            <Calendar
                value={props.date}
                onClickDay={props.onClickDay}
            />
        </div>
    );
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
                    dateCreation: new Date(),
                    dateHead: '',
                },
                {
                    text: "clean the floor",
                    key: 2,
                    status: false,
                    dateCreation: new Date(),
                    dateHead: '',

                }
            ],
            newItemText: '',
            showForm: false,
            showCalendar: false,
            today: new Date(),
            date: new Date(),
            taskDate: '',

        }
        this.toggleCheck = this.toggleCheck.bind(this);
        this.addItem = this.addItem.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.renderForm = this.renderForm.bind(this);
        /*this.onChange = this.onChange.bind(this);*/
        this.onClickDay = this.onClickDay.bind(this);
        this.displayCalendar = this.displayCalendar.bind(this);

    }
    componentDidMount() {
        this.dateTittle();
    }
    componentDidUpdate(prevProps, prevState) {

    }

    dateTittle() {
        this.setState(state => ({
            todoList: state.todoList.map((item, itemIndex) => {
                return Object.assign(item, { dateHead: diferenceInDays(item.dateCreation, state.today) === 0 ? 'Today' : formatDistance(item.dateCreation, state.today, { addSuffix: true }), });

            })

        }));
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
        newItem.dateCreation = this.state.date;
        this.setState(state => ({
            todoList: [...state.todoList, newItem],
            newItemText: '',
            showForm: false,
            showCalendar: false,
            date: new Date(),
        }));
        this.dateTittle();
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

    displayCalendar() {
        this.setState({
            showCalendar: true
        })
    }

    /*onChange = date => {
        this.setState({ date });
        console.log(this.state.date);

    }*/

    onClickDay = value => {
        this.setState({ date: value });

    }

    render() {
        const addItem = <AddItem handleSubmit={this.addItem} value={this.state.newItemText} handleChange={this.handleChange}
            disabled={!this.state.newItemText} displayCalendar={this.displayCalendar} />
        return (
            <div id='todoApp' >
                <Header />
                <div className='todoList'>
                    <TodoList list={this.state.todoList} handleClick={this.toggleCheck} date={this.state.today} />
                    {this.state.showForm ? addItem : <AddTaskButton showForm={this.renderForm} />}
                </div>
                { this.state.showCalendar ?
                    <MyCalendar date={this.state.date} onClickDay={this.onClickDay} /> : null}
            </div>
        )
    }

}


const root = document.querySelector('#root');
ReactDOM.render(<TodoApp />, root);

