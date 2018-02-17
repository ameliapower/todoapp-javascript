import '../css/global.scss';

(function(){
	
	"use strict";

	/**
    * Objects 
    */

    var taskList = document.getElementById('task-list');

	var taskObject = {

		allTasks: JSON.parse(localStorage.getItem('data')) || [],

		createTask: function(id, name, description, dueDate, completed, dueNow, overdue) {
			this.allTasks.push({
				id: id,
				name: name,
				description: description,
				dueDate: dueDate,
				completed: false,
				dueNow: false,
				overdue: false
			});
			// console.log(this.allTasks);
		}, //createTask
		getItemById: function (id, allTasks) {
			for (var i = 0; i < allTasks.length; i++) {
				if (allTasks[i].id == id) {
					return i;
				}
			}
		},
		storeData: function(allTasks, id, isRemove, isComplete){
			if(isRemove){
				this.allTasks.splice(id, 1);
			}
			else if(isComplete !== undefined){
				this.allTasks[id].completed = isComplete;
			}
		    localStorage.setItem("data", JSON.stringify(this.allTasks)); 
		},
		removeTask: function(val) {
			var idToRemove = val.getAttribute('id');
			taskObject.storeData(this.allTasks, idToRemove, true, false);
		},
		toggleComplete: function(task) {
			if(task !== undefined){
				var toggled = task.classList.toggle('toggleCompleted');
				var id = task.getAttribute('id');
				let thisCompleted = this.allTasks[id].completed;

				if(thisCompleted === false){
					thisCompleted = true;
					completedCheck.checked = true;
				}else{
					thisCompleted = false;
				}
				//keep the checkbox on refresh!!
				// if(myData[i].completed === true) {
				// 	console.log('completed', myData[i]); 
				// 	console.log(completedCheck[i]); 
					// console.log(completedCheck.checked); 
				// 	completedCheck[i].checked = true;
				// }
				taskObject.storeData(this.allTasks, id, false, thisCompleted);
			} 
		},
		checkDateDue: function(){
			var todayLong = new Date();
			var today = new Date().toISOString().slice(0,10);
			// console.log(today);

			var tomorrow = new Date(todayLong.getFullYear(), todayLong.getMonth(), todayLong.getDate() + 1);
			tomorrow = tomorrow.toISOString().slice(0,10);

			this.allTasks.filter(function(val, i){
				if(val.dueDate === today || val.dueDate === tomorrow){
					val.dueNow = true; 
				}
			});
		},
		checkOverDue: function(){
			var todayLong = new Date();
			var yesterday = new Date(todayLong.getFullYear(), todayLong.getMonth(), todayLong.getDate() - 1);
			yesterday = yesterday.toISOString().slice(0,10);
			// console.log(yesterday);

			this.allTasks.filter(function(val, i){
				if(val.dueDate <= yesterday){
					val.overdue = true; 
				}
			});
		}

	}; //taskObject


	/**
    * Events 
    */
	var handlerObject = {
		createTask: function(e) {
			e.preventDefault();
			var taskName = document.getElementById('name').value;
			var taskDescription = document.getElementById('description').value;
			var taskDueDate = document.getElementById('dueDate').value;
			var taskCompleted = false;
			var taskDueNow = taskObject.checkDateDue();
			var taskOverdue = taskObject.checkOverDue();
			if(viewObject.retrievedData()){
				var taskId = viewObject.retrievedData().length;
			}else{
				var taskId = 0;
			}
			
			taskObject.createTask(taskId, taskName, taskDescription, taskDueDate, taskCompleted, taskDueNow, taskOverdue);

			taskObject.getItemById(taskId, taskObject.allTasks); //get id
			
			taskObject.checkDateDue();
			taskObject.checkOverDue();
			taskObject.storeData();
			viewObject.viewTasks();

		},
		removeTask: function(val){
			taskObject.removeTask(val);
			viewObject.viewTasks();
		},
		toggleComplete: function(task){
			taskObject.toggleComplete(task);
		},
		filterDue: function(val){
			viewObject.filterDue(val);
		},
		filterOverdue: function(val){
			viewObject.filterOverdue(val);
		},
		filterComplete: function(val){
			viewObject.filterComplete(val);
		},
		clearFilters: function(val){
			viewObject.clearFilters(val);
		}

	}; //handlerObject


	/**
    * View 
    */
	var viewObject = {
		retrievedData: function(){
			taskList.innerHTML = "";
			taskObject.checkDateDue();
			taskObject.checkOverDue();
			taskObject.toggleComplete();

			return JSON.parse(localStorage.getItem("data"));
		},
		filterDue: function(val){
			var list = taskList.querySelectorAll('li');
			list.forEach(function(v, i){
				v.classList.remove('hidden');
			});
			var filteredDue = [];
			for(var i=0; i<taskObject.allTasks.length; i++){
				if(taskObject.allTasks[i].dueNow !== true){
					filteredDue.push(taskObject.allTasks[i]);
					var domId = document.getElementById(i);
					domId.classList.add('hidden');
				}
			}
		},
		filterOverdue: function(val){
			var list = taskList.querySelectorAll('li');
			list.forEach(function(v, i){
				v.classList.remove('hidden');
			});
			var filteredOverdue = [];
			for(var i=0; i<taskObject.allTasks.length; i++){
				if(taskObject.allTasks[i].overdue !== true){
					filteredOverdue.push(taskObject.allTasks[i]);
					var domId = document.getElementById(i);
					domId.classList.add('hidden');
				}
			}
		},
		filterComplete: function(){
			var list = taskList.querySelectorAll('li');
			list.forEach(function(v, i){
				v.classList.remove('hidden');
			});
			var filteredComplete = [];
			for(var i=0; i<taskObject.allTasks.length; i++){
				if(taskObject.allTasks[i].completed !== true){
					filteredComplete.push(taskObject.allTasks[i]);
					var domId = document.getElementById(i);
					domId.classList.add('hidden');
				}
			}
		},
		clearFilters: function(){
			var list = taskList.querySelectorAll('li');
			list.forEach(function(v, i){
				v.classList.remove('hidden');
			});
		},
		viewTasks: function(){
			taskList.innerHTML = "";
			
			var myData = this.retrievedData();

			if(myData && myData.length){
				// console.log(myData.length);
 
				myData.forEach(function(v, i) {
					var taskId = (i);
					// console.log(taskId);
					
					taskList.innerHTML += '<li class="" id="'+taskId+'"><span>'+taskId+'</span><strong><span>'+myData[i].name+'</span></strong><p><span>'+myData[i].description+'</span><span class="date">'+myData[i].dueDate+'</span><span class="complete"><input type="checkbox" id="completedCheck" class="form-check-input"/><label class="form-check-label" for="completed">Completed?</label></span><button id="remove" class="remove-task btn btn-danger" type="button" aria-label="Close">&times;</button></p></li>';
					
					
					//add visual indicators
					var listItem = document.getElementById(taskId);

					if(myData[i].dueNow == true) {
						// console.log(listItem.classList);
						listItem.classList.add("due-now"); 
					}
					
					if(myData[i].overdue == true) {
						listItem.classList.add("overdue");
					}
						

				}); //for loop
			} //if...
		} //viewTasks

	}; //viewObject

// form.reset();


	/**
    * Call Events
    */
	viewObject.viewTasks(); //show tasks
			
	//Add task
	document.getElementById("add-task").addEventListener("click", handlerObject.createTask, false);

	//Remove task
	document.addEventListener('click', function(event){
		// console.log(event);
		if(event.target && event.target.id == 'remove'){
			// console.log(event.target.parentNode.parentNode);
			handlerObject.removeTask(event.target.parentNode.parentNode);
		}
	});

	//Complete task
	document.addEventListener('click', function(event){
		if(event.target && event.target.id === 'completedCheck') {
			handlerObject.toggleComplete(event.target.parentNode.parentNode.parentNode);
		}
	}, false);


	//Filter tasks
	document.addEventListener('click', function(event){
		if(event.target && event.target.id === 'filter-duesoon') {
			handlerObject.filterDue(event.target);
		}
	});

	document.addEventListener('click', function(event){
		if(event.target && event.target.id === 'filter-overdue') {
			handlerObject.filterOverdue(event.target);
		}
	});

	document.addEventListener('click', function(event){
		if(event.target && event.target.id === "filter-completed"){
			handlerObject.filterComplete(event.target);
		}
	});

	document.addEventListener('click', function(event){
		if(event.target && event.target.id === "clear-filter"){
			handlerObject.clearFilters(event.target);
		}
	});


})();

