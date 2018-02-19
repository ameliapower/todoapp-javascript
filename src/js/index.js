import '../css/global.scss';



var Todo = (function (){
	
	"use strict";

	
	/**
    * Global Variables
    */
    var taskList = document.getElementById('task-list');
    var todayLong = new Date();

    /**
    * Objects 
    */

	var taskObject = {

		// Get initial data if any
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
		}, 
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
				var count;
				if(thisCompleted === false){
					thisCompleted = true;
					count++;
				}else{
					thisCompleted = false;
				}

				taskObject.storeData(this.allTasks, id, false, thisCompleted);
			} 
		},
		checkDateDue: function(){
			var today = new Date().toISOString().slice(0,10);

			var tomorrow = new Date(todayLong.getFullYear(), todayLong.getMonth(), todayLong.getDate() + 1);
			tomorrow = tomorrow.toISOString().slice(0,10);

			this.allTasks.filter(function(val, i){
				if(val.dueDate === today || val.dueDate === tomorrow){
					val.dueNow = true; 
				}
			});
		},
		checkOverDue: function(){
			var yesterday = new Date(todayLong.getFullYear(), todayLong.getMonth(), todayLong.getDate() - 1);
			yesterday = yesterday.toISOString().slice(0,10);

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
			//Get the form values
			var taskName = document.getElementById('name').value;
			var taskDescription = document.getElementById('description').value;
			var taskDueDate = document.getElementById('dueDate').value;
			var taskCompleted = false;
			var taskDueNow = taskObject.checkDateDue();
			var taskOverdue = taskObject.checkOverDue();

			//Get next id from storage
			if(viewObject.retrievedData()){
				var taskId = viewObject.retrievedData().length;
			}else{
				var taskId = 0;
			}
			
			//Create our new object
			taskObject.createTask(taskId, taskName, taskDescription, taskDueDate, taskCompleted, taskDueNow, taskOverdue);

			taskObject.getItemById(taskId, taskObject.allTasks); //get id
			
			//Updates from our functions
			taskObject.checkDateDue();
			taskObject.checkOverDue();
			taskObject.storeData();
			viewObject.viewTasks();

			//Reset the form
			document.getElementById('name').value = "";
			document.getElementById('description').value = "";
		},
		removeTask: function(val){
			taskObject.removeTask(val);
			viewObject.viewTasks();
		},
		viewDetails: function(val){
			viewObject.viewDetails(val);
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
		viewDetails: function(val){
			if(val.classList.contains('task-name')){
				val.nextSibling.classList.toggle('hidden');
			} else if(val.id === 'view-more'){
				val.parentNode.nextSibling.classList.toggle('hidden');
			}
		},
		viewTasks: function(){
			taskList.innerHTML = "";
			
			var myData = this.retrievedData();

			if(myData && myData.length){
				// console.log(myData.length);
 
				myData.forEach(function(v, i) {
					var taskId = (i);
					taskList.innerHTML += '<li class="" id="'+taskId+'"><p class="task-name">'+myData[i].name+'<i aria-label="View Details" id="view-more" class="fas fa-chevron-circle-down"></i><span class="complete"><input type="checkbox" id="completedCheck" class="form-check-input"/><label class="form-check-label" for="completed">Completed?</label></span><span class="date"><strong>Due:</strong> '+myData[i].dueDate+'</span><button id="remove" class="remove-task btn btn-danger" type="button" aria-label="Delete Task"><span aria-hidden="true">&times;</span></button></p><p class="hidden"><span>'+myData[i].description+'</span></p><i aria-label="Overdue" style="display:none" class="fas fa-exclamation-triangle overdue-icon"></i><i aria-label="Due soon" style="display:none" class="far fa-bell due-icon"></i></li>';

					//Add Class helpers
					var listItem = document.getElementById(taskId);

					if(myData[i].dueNow == true) {
						listItem.classList.add("due-now"); 
					}
						
					if(myData[i].overdue == true) {
						listItem.classList.add("overdue");
					}

				}); //for loop
			} //if...

			// Visually Indicate States
			var dueItems = document.getElementsByClassName('due-now');
			var overdueItems = document.getElementsByClassName('overdue');
			
			for(var i=0; i<dueItems.length; i++){
				var due=[];
				due.push(dueItems[i]);
				due.forEach(function(v,i){
					v.getElementsByClassName('due-icon')[i].style="display:block";
				});
			}
			for(var i=0; i<overdueItems.length; i++){
				var overdueArr=[];
				overdueArr.push(overdueItems[i]);
				overdueArr.forEach(function(v,i){
					console.log(v.getElementsByClassName('overdue-icon')[i]);
					v.getElementsByClassName('overdue-icon')[i].style="display:block";
				});
			}
			
		} //viewTasks

	}; //viewObject



	/**
    * Call Events
    */

    //show tasks
	viewObject.viewTasks(); 
			
	//Add
	document.getElementById("add-task").addEventListener("click", handlerObject.createTask, false);

	//Remove
	document.addEventListener('click', function(event){
		if(event.target && event.target.parentNode.id === 'remove'){
			handlerObject.removeTask(event.target.parentNode.parentNode);
		}
	});

	document.addEventListener('keypress', function(event){
		console.log('key press 13: ', event.target);
		if(event.which === 13 && event.target.id === 'remove') {
			console.log('key press 13', event.target.id);
			handlerObject.removeTask(event.target.parentNode.parentNode);
		}
	});


	//Complete
	document.addEventListener('click', function(event){
		if(event.target && event.target.id === 'completedCheck') {
			handlerObject.toggleComplete(event.target.parentNode.parentNode.parentNode);
		}
	}, false);

	document.addEventListener('keypress', function(event){
		if(event.which === 13 && event.target.id === 'completedCheck') {
			handlerObject.toggleComplete(event.target.parentNode.parentNode.parentNode);
		}
	}, false);

	

	//Filters
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

	document.addEventListener('click', function(event){
		if(event.target && event.target.className === "task-name" || event.target && event.target.id === "view-more"){
			handlerObject.viewDetails(event.target);
		}
	}, false);
	

})();

