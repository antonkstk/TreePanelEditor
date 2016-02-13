var tree = document.getElementById('treeview');
var ul = document.createElement('ul');
var obj = {
	director: {
		level: 1, 
		persons: new Array()
	},
	deputy: {
		level: 2, 
		persons: new Array()
	},
	contractor: {
		level: 3, 
		persons: new Array()
	},
	courier: {
		level: 4, 
		persons: new Array() 
	}
};
var socket = io.connect('http://localhost:8080');
socket.on('firstcall', function(data) {
	console.log('notification received');
	var treeNode = data;
	buildTree(treeNode, tree);
	//unsubscribe from first json upload listener
	socket.removeAllListeners('firstcall');
});

function buildTree(treeNode, domElement) {
    domElement.appendChild(ul);
    
    for (i in treeNode) {
        var li = document.createElement('li');
        li.innerHTML = i;
        
        var ulChild = document.createElement('ul');
        for (j in treeNode[i].persons){
        	var liChild = document.createElement('li');
        	liChild.innerHTML = '<img onclick="moveEl(event, 1)" class="moveUp" src="../resources/images/stockIndexUp.png" /> ' + treeNode[i].persons[j] + ' <img onclick="moveEl(event, -1)" class="moveDown" src="../resources/images/stockIndexDown.png" />';
        	ulChild.appendChild(liChild);
        }
        //ulChild.setAttribute("class", "childUl");
        li.setAttribute("class", treeNode[i].level);
        li.appendChild(ulChild);
        ul.appendChild(li);
    }
}

function moveEl(event, direction) {
	console.log("Event type: " + event.type + " Direction: "+ direction);
	
	var currentEl = event.target.parentElement;
	var parentNode = currentEl.parentNode.parentNode;
	var parentNodeClassName = parentNode.className;
	
	if(direction==1 && parentNodeClassName != "1"){
		currentEl.parentNode.appendChild(parentNode.previousSibling.firstElementChild.firstElementChild);
		parentNode.previousSibling.firstElementChild.appendChild(currentEl);	
	}
	if(direction==-1 && parentNodeClassName != "4"){
		currentEl.parentNode.appendChild(parentNode.nextSibling.firstElementChild.firstElementChild);
		parentNode.nextSibling.firstElementChild.appendChild(currentEl);	
	}
	loopOverChildren(ul);
}

function loopOverChildren(ul) {
	var obj = {
		director: {
			level: 1, 
			persons: new Array()
		},
		deputy: {
			level: 2, 
			persons: new Array()
		},
		contractor: {
			level: 3, 
			persons: new Array()
		},
		courier: {
			level: 4, 
			persons: new Array() 
		}
	};
	for(var i=0; i< ul.childNodes.length; i++){
		//get firstchild of general ul
		var position = ul.childNodes[i].firstChild.data;
		var childLis = ul.childNodes[i].firstElementChild.childNodes;
		if(position=="director"){
			//get sub li elements
			for(var j=0; j<childLis.length; j++){
				var person = childLis[j].innerText;
				obj.director.persons.push(person);
			}
		}
		if(position=="deputy"){
			for(var j=0; j<childLis.length; j++){
				var person = childLis[j].innerText;
				obj.deputy.persons.push(person);
			}	
		}
		if(position=="contractor"){
			for(var j=0; j<childLis.length; j++){
				var person = childLis[j].innerText;
				obj.contractor.persons.push(person);
			}	
		}
		if(position=="courier"){
			for(var j=0; j<childLis.length; j++){
				var person = childLis[j].innerText;
				obj.courier.persons.push(person);
			}
		}
	}
	saveJsonChanges(obj);
}

function saveJsonChanges(obj) {
	socket.emit('message', JSON.stringify(obj));
}
