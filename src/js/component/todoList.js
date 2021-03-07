import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import ReactDOM from "react-dom";

//import components
import { Horizontal } from "./horizontal.js";
import { Counter } from "./counter.js";

//create your first component
export function Todo(props) {
	const [toDo, setToDo] = useState([]);

	useEffect(() => {
		getTodos(props.apiUrl);
	}, [toDo]);

	// will be call only if api list has not been created
	const postTodos = url => {
		let myHeaders = new Headers();
		myHeaders.append("Content-Type", "application/json");

		let bodyRaw = JSON.stringify([]);

		let requestOptions = {
			method: "POST",
			headers: myHeaders,
			body: bodyRaw
		};

		fetch(url, requestOptions)
			.then(resp => {
				if (resp.ok) {
					//console.log(resp.status);
					getTodos(url);
				}
			})
			.catch(error => {
				//error handling
				//console.error(error);
			});
	};

	// get array of tasks from api
	const getTodos = url => {
		let myHeaders = new Headers();
		myHeaders.append("Content-Type", "application/json");

		let requestOptions = {
			method: "GET",
			headers: myHeaders
		};
		fetch(url, requestOptions)
			.then(resp => {
				if (resp.ok === false && resp.status === 404) {
					// if list has not been created call postTodos to create api list
					postTodos(url);
				} else {
					//console.log(resp.status);
					return resp.json();
				}
			})
			.then(data => {
				setToDo(data);
			})
			.catch(error => {
				//error handling
				//console.error(error);
			});
	};

	// update api list
	const putTodos = (url, task, status) => {
		let myHeaders = new Headers();
		myHeaders.append("Content-Type", "application/json");

		let newRaw = JSON.stringify(toDo.concat({ label: task, done: status }));
		var delRaw = JSON.stringify(task);

		let requestOptions = {
			method: "PUT",
			headers: myHeaders,
			body: status === false ? newRaw : delRaw,
			redirect: "follow"
		};

		fetch(url, requestOptions)
			.then(resp => {
				if (resp.ok) {
					console.error(resp.status);
				}
			})
			.catch(error => {
				//error handling
				console.log(error);
			});
	};

	// delete api list
	const delTodos = () => {
		let myHeaders = new Headers();
		myHeaders.append("Content-Type", "application/json");

		let requestOptions = {
			method: "DELETE",
			headers: myHeaders,
			redirect: "follow"
		};

		fetch(props.apiUrl, requestOptions)
			.then(resp => {
				if (resp.ok) {
					console.error(resp.status);
					ReactDOM.render(
						<div
							className="alert alert-warning text-center mx-auto mt-5 w-25 rounded border "
							role="alert">
							<h4 className="alert-heading">List Cleared</h4>
							<p>Refresh your page to recreate the To Do list.</p>
						</div>,
						document.querySelector("#app")
					);
				}
			})
			.catch(error => {
				//error handling
				console.log(error);
			});
	};

	// create new task
	const newDo = event => {
		if (event.key === "Enter" && event.target.value === "") {
			// prevent from blank inputs
			alert("Blank inputs not allowed");
		} else if (event.key === "Enter") {
			// await for the enter Key to be pressed
			event.preventDefault();
			putTodos(props.apiUrl, event.target.value, false);
			event.target.value = ""; // clear the input box
		}
	};

	//remove to do
	const removeDo = toRemove => {
		const updatedList = toDo.filter(
			item => item.label.toString() !== toRemove
		);
		putTodos(props.apiUrl, updatedList, true);
	};

	return (
		<div>
			<Horizontal />
			<ul className="list-group m-5">
				<input
					type="text"
					placeholder="Enter to do..."
					onKeyDown={newDo}
				/>
				{toDo.map(doItem => (
					<li
						key={doItem.label.toString()}
						className="list-group-item text-left">
						{doItem.label}
						<i
							className="fas fa-trash-alt pl-5"
							onClick={() =>
								removeDo(doItem.label.toString())
							}></i>
					</li>
				))}
			</ul>
			<button type="button" className="btn" onClick={delTodos}>
				Clear List
			</button>
			<Horizontal />
			<Counter items={toDo.length} />
		</div>
	);
}

Todo.propTypes = {
	apiUrl: PropTypes.string
};
